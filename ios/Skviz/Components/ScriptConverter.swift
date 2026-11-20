import SwiftUI

/// Pretvara tekst u pismo prikaza. Ekrani ga čitaju iz environment-a: `@Environment(\.sr) private var sr`,
/// pa `Text(sr("Napravi sobu"))`. Ceo prikaz se preslovljava kad se promeni pismo uređaja ili sobe.
///
/// Latinicom ostaje ono što se i na sajtu ne preslovljava: kod sobe, adrese, kvizovi na engleskom
/// (za njih se koristi `Text(verbatim:)` ili `sr.keep`).
struct ScriptConverter: Sendable {
    let script: Script
    private let transliterator: Transliterator?

    init(script: Script, transliterator: Transliterator?) {
        self.script = script
        self.transliterator = transliterator
    }

    static let latin = ScriptConverter(script: .latinica, transliterator: nil)

    func callAsFunction(_ text: String) -> String {
        guard script == .cirilica, let transliterator else { return text }
        return transliterator.cyrillic(text)
    }

    /// Tekst pitanja na stranom jeziku (`jezik: "en"`) se ne preslovljava.
    func content(_ text: String, language: String?) -> String {
        language == nil || language == "sr" ? self(text) : text
    }

    /// Slova odgovora: А Б В Г ćirilicom, A B C D latinicom (kao `slovaOdg` na sajtu).
    var answerLetters: [String] {
        script == .cirilica ? ["А", "Б", "В", "Г"] : ["A", "B", "C", "D"]
    }
}

extension EnvironmentValues {
    @Entry var sr: ScriptConverter = .latin
}
