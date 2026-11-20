import Foundation
import JavaScriptCore
import os

/// Preslovljavanje latinica → ćirilica po pravilima sajta (`public/pismo.js`), izvršenim u JavaScriptCore-u.
///
/// Pravila nisu prosta zamena slova: rimski brojevi, formule, jedinice, hemijski simboli, krvne grupe
/// i strani nazivi (skup `STRANE`) ostaju latinicom. Zato aplikacija koristi isti fajl kao sajt,
/// umesto da ga prepisuje u Swift i da se pravila vremenom raziđu.
final class Transliterator: @unchecked Sendable {
    // JSContext nije bezbedan za istovremeni pristup, pa sve ide kroz `lock`.
    private let lock = NSLock()
    private let function: JSValue?
    private var cache: [String: String] = [:]

    /// - Parameter source: sadržaj `pismo.js`. Ako se ne izvrši, preslovljavanje vraća tekst nepromenjen.
    init(source: String) {
        let context = JSContext()
        var failed = false
        context?.exceptionHandler = { _, exception in
            failed = true
            Logger(subsystem: Bundle.main.bundleIdentifier ?? "app", category: "pismo")
                .error("pismo.js: \(exception?.toString() ?? "", privacy: .public)")
        }
        context?.evaluateScript("var window = {};")
        context?.evaluateScript(source)
        let candidate = context?.objectForKeyedSubscript("window")?
            .objectForKeyedSubscript("Pismo")?
            .objectForKeyedSubscript("uCirilicu")
        function = failed || candidate?.isUndefined != false ? nil : candidate
    }

    /// Pravila koja su stigla uz aplikaciju.
    static func bundled() -> Transliterator {
        let url = Bundle.main.url(forResource: "pismo", withExtension: "js")
        let source = url.flatMap { try? String(contentsOf: $0, encoding: .utf8) } ?? ""
        return Transliterator(source: source)
    }

    var isWorking: Bool { function != nil }

    /// Tekst ćirilicom. Delovi između `$…$` (matematika, kôd) ostaju latinicom, kao `.formula` na sajtu.
    func cyrillic(_ text: String) -> String {
        guard !text.isEmpty, let function else { return text }
        lock.lock()
        defer { lock.unlock() }
        if let cached = cache[text] { return cached }

        let parts = text.components(separatedBy: "$")
        let converted = parts.enumerated().map { index, part in
            index.isMultiple(of: 2) ? (function.call(withArguments: [part])?.toString() ?? part) : part
        }
        let result = converted.joined(separator: "$")
        if cache.count > 4000 { cache.removeAll() }
        cache[text] = result
        return result
    }
}
