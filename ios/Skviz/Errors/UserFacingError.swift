import Foundation

/// Greška čiju poruku sme da vidi korisnik. Samo tipovi koje je pisala aplikacija usvajaju ovaj protokol.
///
/// Sistemske greške (`URLError`, `DecodingError`, `NSError`) ga ne usvajaju, pa njihov tekst
/// ("The data couldn't be read because it is missing.") nikad ne stiže do korisnika.
protocol UserFacingError: Error {
    /// Poruka za korisnika. `nil` znači: prikaži opštu poruku.
    var userMessage: String? { get }
}

extension NetworkError: UserFacingError {
    var userMessage: String? { errorDescription }
}
