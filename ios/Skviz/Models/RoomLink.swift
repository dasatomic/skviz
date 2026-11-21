import Foundation

/// Poziv u sobu: link koji se deli i prepoznavanje koda iz linka ili nalepljene poruke.
///
/// Deli se `https://skviz.rs/?soba=ABCD`: u porukama je klikabilan, a sajt ga već razume
/// (otvori početnu sa upisanim kodom). Aplikacija prepoznaje isti link i `skviz://soba/ABCD`.
enum RoomLink {
    /// Slova od kojih server pravi kodove soba (`novKod` u `server.js`).
    private static let codeLetters = Set("ABCDEFGHJKLMNPRSTUVZ")

    static func url(for code: String) -> URL {
        var components = URLComponents(url: AppConfig.baseURL, resolvingAgainstBaseURL: false)
        components?.path = "/"
        components?.queryItems = [URLQueryItem(name: "soba", value: code)]
        return components?.url ?? AppConfig.baseURL
    }

    /// Kod sobe iz linka koji je otvorio aplikaciju.
    static func code(from url: URL) -> String? {
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        if let value = components?.queryItems?.first(where: { $0.name == "soba" })?.value {
            return validated(value)
        }
        // skviz://soba/ABCD
        if url.scheme == "skviz", url.host() == "soba" {
            return validated(url.lastPathComponent)
        }
        return nil
    }

    /// Kod sobe iz nalepljenog teksta: link sa `soba=`, ili četiri slova koda u poruci
    /// („Уђи у моју Сквиз собу: GCTU – https://skviz.rs“).
    static func code(fromText text: String) -> String? {
        if let range = text.range(of: #"soba=([A-Za-z]{4})"#, options: .regularExpression) {
            return validated(String(text[range].suffix(4)))
        }
        // Kod se deli velikim slovima; obična reč od četiri slova („nema“) nije kod.
        let words = text.split(whereSeparator: { !$0.isLetter })
        return words.lazy.compactMap { word in
            word.count == 4 && word == word.uppercased() ? validated(String(word)) : nil
        }.first
    }

    private static func validated(_ value: String) -> String? {
        let code = value.uppercased()
        return code.count == 4 && code.allSatisfy(codeLetters.contains) ? code : nil
    }
}
