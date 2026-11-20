import Foundation

/// Podešavanja ovog uređaja: pismo prikaza i da li je uvod („Šta je Skviz?“) već viđen.
///
/// Pismo uređaja važi van sobe i pri pravljenju nove sobe; u sobi važi pismo koje je izabrao vođa
/// (`podesavanja.pismo`), kao na sajtu.
@MainActor
final class SettingsDataStore: ObservableObject {
    @Published private(set) var script: Script
    @Published private(set) var hasSeenIntro: Bool
    /// Pravila preslovljavanja; zamenjuju se novijim sa servera kad stignu.
    @Published private(set) var transliterator: Transliterator

    private let service: any GameService
    private let defaults: UserDefaults

    private enum Key {
        static let script = "skviz.pismo"
        static let intro = "skviz.uvodVidjen"
        static let rules = "skviz.pismoPravila"
    }

    init(service: any GameService, defaults: UserDefaults = .standard) {
        self.service = service
        self.defaults = defaults
        script = Script(server: defaults.string(forKey: Key.script))
        hasSeenIntro = defaults.bool(forKey: Key.intro)
        // Pravila sa servera iz prethodnog pokretanja su novija od onih u aplikaciji.
        let saved = defaults.string(forKey: Key.rules).map(Transliterator.init(source:))
        transliterator = saved?.isWorking == true ? saved ?? .bundled() : .bundled()
    }

    /// Konverter za pismo uređaja, ili za pismo sobe kad je zadato.
    func converter(for roomScript: Script? = nil) -> ScriptConverter {
        ScriptConverter(script: roomScript ?? script, transliterator: transliterator)
    }

    func setScript(_ newValue: Script) {
        script = newValue
        defaults.set(newValue.rawValue, forKey: Key.script)
    }

    func markIntroSeen() {
        hasSeenIntro = true
        defaults.set(true, forKey: Key.intro)
    }

    /// Preuzima `pismo.js` sa servera: uz nova pitanja stižu i nove strane reči koje ostaju latinicom.
    /// Neuspeh nije greška za korisnika – ostaju pravila koja već postoje.
    func refreshRules() async {
        do {
            let source = try await service.fetchScriptRules()
            let candidate = Transliterator(source: source)
            guard candidate.isWorking else { return }
            transliterator = candidate
            defaults.set(source, forKey: Key.rules)
        } catch {
            ErrorCenter.systemLog("pismo.js nije preuzet: \(ErrorCenter.logDescription(of: error))")
        }
    }
}
