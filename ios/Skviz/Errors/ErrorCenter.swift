import Combine
import Foundation
import os

/// Ono što korisnik vidi: naslov i poruka, bez tehničkih detalja.
struct UserAlert: Equatable, Identifiable, Sendable {
    enum Kind: Equatable, Sendable {
        case error
        /// Sesija je istekla. Posle zatvaranja aplikacija vodi korisnika na prijavu.
        case sessionExpired
    }

    let kind: Kind
    let title: String
    let message: String

    var id: String { "\(kind)|\(title)|\(message)" }

    init(kind: Kind = .error, title: String, message: String) {
        self.kind = kind
        self.title = title
        self.message = message
    }
}

/// Jedino mesto koje odlučuje šta se od greške prikazuje korisniku.
///
/// Pravi se jednom, pri pokretanju aplikacije, i stavlja u environment. Alert se prikazuje na
/// jednom mestu (root view), pa dva ekrana ne mogu da prikažu dva alert-a jedan preko drugog.
@MainActor
final class ErrorCenter: ObservableObject {
    struct Texts: Sendable {
        var errorTitle = "Greška"
        var sessionExpiredTitle = "Sesija je istekla"
        var genericMessage = "Došlo je do privremenog problema u komunikaciji. Pokušaj kasnije."

        init() {}
    }

    /// Alert koji je trenutno na ekranu.
    @Published private(set) var current: UserAlert?

    /// Poziva se kad korisnik zatvori alert o isteku sesije: odjava i povratak na prijavu.
    var onSessionExpired: (() -> Void)?

    private var queue: [UserAlert] = []
    private let texts: Texts
    private let log: @Sendable (String) -> Void

    /// - Parameter log: prima tehnički opis greške (bez adresa, tela i tokena). Podrazumevano ide u sistemski log.
    init(texts: Texts = Texts(), log: @escaping @Sendable (String) -> Void = ErrorCenter.systemLog) {
        self.texts = texts
        self.log = log
    }

    /// Prijavljuje grešku. Otkazan zahtev se preskače; sve ostalo se loguje i prikazuje.
    func present(_ error: any Error) {
        guard !Self.isCancellation(error) else { return }
        log(Self.logDescription(of: error))
        show(alert(for: error))
    }

    /// Prikazuje alert, ili ga stavlja u red ako je neki već na ekranu.
    /// Poruka koja je već na ekranu ili u redu se ne ponavlja (deset zahteva bez mreže daje jedan alert).
    func show(_ alert: UserAlert) {
        guard current != alert, !queue.contains(alert) else { return }
        if current == nil {
            current = alert
        } else {
            queue.append(alert)
        }
    }

    /// Poziva se kad korisnik zatvori alert. Prikazuje sledeći iz reda, ako postoji.
    func dismiss() {
        guard let dismissed = current else { return }
        if dismissed.kind == .sessionExpired {
            // Posle odjave ostale greške više nisu bitne.
            queue.removeAll()
            current = nil
            onSessionExpired?()
        } else {
            current = queue.isEmpty ? nil : queue.removeFirst()
        }
    }

    private func alert(for error: any Error) -> UserAlert {
        if let networkError = error as? NetworkError, networkError == .unauthorized {
            return UserAlert(
                kind: .sessionExpired,
                title: texts.sessionExpiredTitle,
                message: networkError.userMessage ?? texts.genericMessage
            )
        }
        let message = (error as? any UserFacingError)?.userMessage ?? texts.genericMessage
        return UserAlert(title: texts.errorTitle, message: message)
    }
}

extension ErrorCenter {
    /// Otkazan zahtev (zatvoren ekran, prekinut `.task`) nije greška za korisnika.
    nonisolated static func isCancellation(_ error: any Error) -> Bool {
        if error is CancellationError { return true }
        if let networkError = error as? NetworkError { return networkError.isCancellation }
        let nsError = error as NSError
        return nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled
    }

    /// Opis za log. Namerno ne koristi `"\(error)"`: `URLError` u opisu nosi ceo URL sa parametrima,
    /// a poruka servera može da sadrži lične podatke.
    nonisolated static func logDescription(of error: any Error) -> String {
        if let networkError = error as? NetworkError {
            switch networkError {
            case .http(let status, _): return "NetworkError.http status=\(status)"
            case .transport(let code): return "NetworkError.transport code=\(code)"
            case .decoding(let details): return "NetworkError.decoding \(details)"
            default: return "NetworkError.\(networkError)"
            }
        }
        let nsError = error as NSError
        return "\(type(of: error)) domain=\(nsError.domain) code=\(nsError.code)"
    }

    static let systemLog: @Sendable (String) -> Void = { message in
        Logger(subsystem: Bundle.main.bundleIdentifier ?? "app", category: "errors")
            .error("\(message, privacy: .public)")
    }
}
