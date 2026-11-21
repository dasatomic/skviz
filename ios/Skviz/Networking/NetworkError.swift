import Foundation

/// Sve greške mrežnog sloja. Ostatak aplikacije ne vidi `URLError` ni `DecodingError`.
enum NetworkError: Error, Equatable, Sendable {
    /// Zahtev nije mogao da se sastavi (pokvaren URL ili parametri).
    case invalidRequest
    case noConnection
    case timedOut
    /// Zahtev je otkazan (ekran je zatvoren, `.task` je prekinut). Ne prikazuje se korisniku.
    case cancelled
    /// Ostale greške transporta; `code` je `URLError.Code.rawValue`.
    case transport(code: Int)
    /// 401, ili osvežavanje tokena nije uspelo. Aplikacija vodi korisnika na prijavu.
    case unauthorized
    /// Svaki drugi status van 200..<300. `serverMessage` je poruka iz tela odgovora, ako postoji.
    case http(status: Int, serverMessage: String?)
    /// Status je uspešan, ali telo je prazno, a očekivan je model.
    case emptyBody
    /// Odgovor ne odgovara modelu. Tekst je za log, ne za korisnika.
    case decoding(String)
}

extension NetworkError {
    init(_ error: URLError) {
        switch error.code {
        case .notConnectedToInternet, .networkConnectionLost, .dataNotAllowed:
            self = .noConnection
        case .timedOut:
            self = .timedOut
        case .cancelled:
            self = .cancelled
        default:
            self = .transport(code: error.code.rawValue)
        }
    }

    /// `true` za otkazan zahtev. UI ovakvu grešku preskače, bez alert-a.
    var isCancellation: Bool { self == .cancelled }
}

// `LocalizedError` traži `errorDescription`. Ako se umesto toga definiše `localizedDescription`,
// kroz `Error` stiže sistemska poruka, a ne ova.
extension NetworkError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .noConnection:
            "Nema internet konekcije. Proveri vezu i pokušaj ponovo."
        case .timedOut:
            "Server ne odgovara. Pokušaj ponovo."
        case .unauthorized:
            "Veza sa igrom je prekinuta."
        case .http(_, let serverMessage?) where !serverMessage.isEmpty:
            serverMessage
        case .cancelled:
            nil
        case .invalidRequest, .transport, .http, .emptyBody, .decoding:
            "Došlo je do privremenog problema u komunikaciji. Pokušaj kasnije."
        }
    }
}
