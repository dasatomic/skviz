import Foundation

/// Soba u kojoj je ovaj telefon: ulazak, praćenje stanja (long-polling) i akcije.
///
/// Server vodi celu igru; aplikacija samo prikazuje `state` i šalje akcije.
@MainActor
final class RoomDataStore: ObservableObject {
    @Published private(set) var code: String?
    @Published private(set) var state: RoomState?
    @Published private(set) var isJoining = false
    /// Soba više ne postoji na serveru (istekla, ili je server restartovan).
    @Published private(set) var isClosed = false
    @Published private(set) var error: NetworkError?

    /// Razlika sata servera i telefona u ms. Tajmeri se računaju po satu servera.
    private(set) var clockOffset: Double = 0

    private let service: any GameService
    private let playerId: String

    init(service: any GameService, playerId: String) {
        self.service = service
        self.playerId = playerId
    }

    /// Trenutno vreme po satu servera (ms od 1970).
    var serverNow: Double { Date().timeIntervalSince1970 * 1000 + clockOffset }

    // MARK: - Poziv linkom

    /// Kod sobe iz linka koji je otvorio aplikaciju; početni ekran ulazi u sobu (ili traži ime) i briše ga.
    @Published private(set) var invitedCode: String?

    func invite(code: String) {
        invitedCode = code
    }

    func consumeInvite() {
        invitedCode = nil
    }

    // MARK: - Ulazak

    /// Vraća `true` kad je soba napravljena; ekran tada otvara sobu.
    func create(profile: PlayerProfile, script: Script) async -> Bool {
        await enter { try await self.service.createRoom(playerId: self.playerId, profile: profile, script: script) }
    }

    func join(code: String, profile: PlayerProfile) async -> Bool {
        let normalized = code.trimmingCharacters(in: .whitespaces).uppercased()
        return await enter { try await self.service.joinRoom(code: normalized, playerId: self.playerId, profile: profile) }
    }

    private func enter(_ request: @escaping () async throws -> String) async -> Bool {
        isJoining = true
        defer { isJoining = false }
        do {
            let newCode = try await request()
            code = newCode
            state = nil
            isClosed = false
            error = nil
            return true
        } catch {
            report(error)
            return false
        }
    }

    // MARK: - Praćenje stanja

    /// Prati sobu dok se `.task` ekrana ne otkaže. Svaki odgovor servera je novo stanje.
    func observe() async {
        var failures = 0
        while !Task.isCancelled, let code, !isClosed {
            do {
                let next = try await service.fetchState(code: code, playerId: playerId, knownVersion: state?.verzija)
                apply(next)
                failures = 0
            } catch NetworkError.cancelled {
                return
            } catch NetworkError.http(status: 404, _) {
                isClosed = true
                return
            } catch {
                failures += 1
                // Kratki prekidi (Wi-Fi, tunel) se ne prijavljuju; posle trećeg neuspeha korisnik vidi grešku.
                if failures == 3 { report(error) }
                // `try?`: otkazan `.task` prekida čekanje, a petlja se završava na proveri `Task.isCancelled`.
                try? await Task.sleep(for: .seconds(min(failures * 2, 10)))
            }
        }
    }

    private func apply(_ next: RoomState) {
        clockOffset = next.sada - Date().timeIntervalSince1970 * 1000
        state = next
    }

    // MARK: - Akcije

    func send(_ action: RoomAction) async {
        guard let code else { return }
        do {
            try await service.send(action, code: code, playerId: playerId)
        } catch {
            report(error)
        }
    }

    /// Vođa pokreće partiju. Aplikacija još nema krug „Najduža reč“, pa igra samo pitanja.
    func start() async {
        if state?.podesavanja.krugovi != "pitanja" {
            await send(.updateSettings(SettingsPatch(krugovi: "pitanja")))
        }
        await send(.start)
    }

    /// Izlazak iz sobe. Stanje se briše i kad server ne odgovori – igrač ionako napušta sobu.
    func leave() async {
        if code != nil {
            await send(.leave)
        }
        code = nil
        state = nil
        isClosed = false
    }

    func clearError() {
        error = nil
    }

    private func report(_ error: Error) {
        let networkError = error as? NetworkError ?? .transport(code: (error as NSError).code)
        guard !networkError.isCancellation else { return }
        self.error = networkError
    }
}
