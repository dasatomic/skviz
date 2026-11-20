import Foundation

/// Akcija igrača ili vođe (`POST /api/akcija`, polje `tip`).
enum RoomAction: Sendable, Equatable {
    /// Indeks odgovora (izbor, uljez) ili parovi (spoji pojmove).
    case answer(AnswerValue)
    case updateSettings(SettingsPatch)
    /// Samo vođa.
    case start
    /// Samo vođa. `phase` je faza koju je vođa video kad je pritisnuo „Dalje“.
    case next(phase: String)
    /// Samo vođa: povratak svih u lobi.
    case backToLobby
    case leave
}

/// Podešavanja koja vođa menja u lobiju. Polje koje je `nil` se ne šalje i ostaje kakvo je bilo.
struct SettingsPatch: Encodable, Equatable, Sendable {
    var kviz: String?
    /// `oba`, `pitanja` ili `reci`.
    var krugovi: String?
    var brojPitanja: Int?
    var vreme: Int?
    var pismo: String?
}

/// Ugovor prema Skviz serveru (`server.js`). Igrač se predstavlja tajnim id-jem koji čuva telefon.
protocol GameService: Sendable {
    func fetchQuizzes() async throws -> [Quiz]
    /// Pravi sobu u kojoj je ovaj igrač vođa. Vraća kod sobe (4 slova).
    func createRoom(playerId: String, profile: PlayerProfile, script: Script) async throws -> String
    func joinRoom(code: String, playerId: String, profile: PlayerProfile) async throws -> String
    /// Long-polling: odmah vraća stanje ako je novije od `knownVersion`, inače čeka promenu (do 20 s).
    func fetchState(code: String, playerId: String, knownVersion: Int?) async throws -> RoomState
    func send(_ action: RoomAction, code: String, playerId: String) async throws
    /// Pravila preslovljavanja sa sajta (`/pismo.js`).
    func fetchScriptRules() async throws -> String
}

/// Telo greške koje vraća server: `{ "greska": "Soba ne postoji. Proveri kod." }`.
struct ServerError: Decodable, Sendable {
    let greska: String
}

struct WebGameService: GameService {
    private let client: HTTPClient
    private let baseURL: URL

    init(client: HTTPClient, baseURL: URL) {
        self.client = client
        self.baseURL = baseURL
    }

    func fetchQuizzes() async throws -> [Quiz] {
        // Spisak je sadržaj: kviz koji aplikacija ne razume se preskače, ne obara ceo izbor.
        let resource = Resource<LossyArray<Quiz>>(url: baseURL.appendingPathComponent("api/kvizovi"))
        return try await client.load(resource).wrappedValue
    }

    func createRoom(playerId: String, profile: PlayerProfile, script: Script) async throws -> String {
        // Soba počinje u pismu uređaja vođe; vođa ga posle može promeniti u lobiju.
        let body = ActionRequest(tip: "nova-soba", igrac: playerId, ime: profile.trimmedName, avatar: profile.avatar, pismo: script.rawValue)
        return try await client.load(Resource<RoomCodeResponse>(url: actionURL, method: .post(try encode(body)))).kod
    }

    func joinRoom(code: String, playerId: String, profile: PlayerProfile) async throws -> String {
        let body = ActionRequest(tip: "udji", igrac: playerId, soba: code, ime: profile.trimmedName, avatar: profile.avatar)
        return try await client.load(Resource<RoomCodeResponse>(url: actionURL, method: .post(try encode(body)))).kod
    }

    func fetchState(code: String, playerId: String, knownVersion: Int?) async throws -> RoomState {
        let resource = Resource<RoomState>(
            url: baseURL.appendingPathComponent("api/stanje"),
            query: [
                URLQueryItem(name: "soba", value: code),
                URLQueryItem(name: "igrac", value: playerId),
                URLQueryItem(name: "v", value: String(knownVersion ?? -1)),
            ]
        )
        return try await client.load(resource)
    }

    func send(_ action: RoomAction, code: String, playerId: String) async throws {
        var body = ActionRequest(tip: "", igrac: playerId, soba: code)
        switch action {
        case .answer(let value):
            body.tip = "odgovor"
            body.izbor = value
        case .updateSettings(let patch):
            body.tip = "podesavanja"
            body.podesavanja = patch
        case .start:
            body.tip = "pokreni"
        case .next(let phase):
            body.tip = "dalje"
            body.faza = phase
        case .backToLobby:
            body.tip = "lobi"
        case .leave:
            body.tip = "izadji"
        }
        try await client.load(Resource<Void>(url: actionURL, method: .post(try encode(body))))
    }

    func fetchScriptRules() async throws -> String {
        let resource = Resource<String>(url: baseURL.appendingPathComponent("pismo.js"), headers: ["Accept": "*/*"]) { data, _ in
            guard let source = String(data: data, encoding: .utf8), !source.isEmpty else { throw NetworkError.emptyBody }
            return source
        }
        return try await client.load(resource)
    }

    private var actionURL: URL { baseURL.appendingPathComponent("api/akcija") }

    private func encode(_ body: ActionRequest) throws -> Data {
        do {
            return try JSONEncoder().encode(body)
        } catch {
            throw NetworkError.invalidRequest
        }
    }
}

/// Telo `POST /api/akcija`. Polja koja su `nil` se ne šalju.
private struct ActionRequest: Encodable {
    var tip: String
    var igrac: String
    var soba: String?
    var ime: String?
    var avatar: String?
    var pismo: String?
    var izbor: AnswerValue?
    var faza: String?
    var podesavanja: SettingsPatch?
}

private struct RoomCodeResponse: Decodable, Sendable {
    let kod: String
}

enum GameServiceFactory {
    /// Mock se uključuje samo u DEBUG build-u, promenljivom okruženja `ENV=TEST`.
    static func make(client: HTTPClient, baseURL: URL) -> any GameService {
        #if DEBUG
        if ProcessInfo.processInfo.environment["ENV"] == "TEST" {
            return MockGameService()
        }
        #endif
        return WebGameService(client: client, baseURL: baseURL)
    }
}
