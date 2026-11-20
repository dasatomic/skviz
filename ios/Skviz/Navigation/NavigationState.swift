import Combine
import Foundation

/// Ključ za jednokratan rezultat koji ekran vraća prethodnom ekranu. Tip vrednosti je deo ključa.
///
///     enum NavigationResults {
///         static let pickedCompany = ResultKey<Company>("pickedCompany")
///     }
struct ResultKey<Value>: Sendable {
    let name: String

    init(_ name: String) {
        self.name = name
    }
}

/// Jedini izvor istine za navigaciju. `routes` je vezan za `NavigationStack(path:)`.
///
/// Pravi se jednom, na root view-u, i stavlja u environment. Ekrani ne otvaraju druge ekrane sami,
/// nego zovu `push` / `pop`. U aplikaciji je `Route` enum aplikacije, pa se generički parametar
/// može zameniti konkretnim tipom.
@MainActor
final class NavigationState<Route: Hashable>: ObservableObject {
    @Published var routes: [Route] = []

    private var results: [String: Any] = [:]

    init() {}

    func push(_ route: Route) {
        routes.append(route)
    }

    /// Vraća se jedan ekran unazad. Na praznom steku ne radi ništa.
    func pop() {
        guard !routes.isEmpty else { return }
        routes.removeLast()
    }

    /// Vraća se na rutu koja je već na steku. Ako se ista ruta javlja više puta, bira se najbliža vrhu.
    /// Ako je nema, stek ostaje kakav je bio.
    func popTo(_ route: Route) {
        guard let index = routes.lastIndex(of: route) else { return }
        routes.removeSubrange(routes.index(after: index)...)
    }

    func popToRoot() {
        routes.removeAll()
    }

    /// Zamenjuje ceo stek (npr. posle prijave ili otvaranja deep link-a).
    func replace(with routes: [Route]) {
        self.routes = routes
    }

    /// Ekran ostavlja rezultat za prethodni ekran, pa zove `pop()`.
    func setResult<Value>(_ value: Value, for key: ResultKey<Value>) {
        results[key.name] = value
    }

    /// Prethodni ekran preuzima rezultat. Rezultat se čita jednom: drugi poziv vraća `nil`.
    func takeResult<Value>(for key: ResultKey<Value>) -> Value? {
        results.removeValue(forKey: key.name) as? Value
    }
}
