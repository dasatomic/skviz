import Foundation

/// Sve rute aplikacije. Ekrani unutar partije (lobi, pitanje, tabela…) nisu rute:
/// njih bira faza koju šalje server, unutar `RoomScreen`.
enum Route: Hashable {
    case room(code: String)
}

typealias AppNavigation = NavigationState<Route>
