import SwiftUI

struct RootView: View {
    @EnvironmentObject private var settings: SettingsDataStore
    @EnvironmentObject private var errorCenter: ErrorCenter
    @StateObject private var navigation = AppNavigation()

    var body: some View {
        NavigationStack(path: $navigation.routes) {
            HomeScreen()
                // Jedino mesto koje zna koji ekran pripada kojoj ruti.
                .navigationDestination(for: Route.self) { route in
                    switch route {
                    case .room(let code):
                        RoomScreen(code: code)
                    }
                }
        }
        .environmentObject(navigation)
        .errorAlert(errorCenter)
        // Uvod „Šta je Skviz?“ se pojavi jednom, pri prvom pokretanju.
        .fullScreenCover(isPresented: Binding(get: { !settings.hasSeenIntro }, set: { if !$0 { settings.markIntroSeen() } })) {
            OnboardingScreen { settings.markIntroSeen() }
                .environment(\.sr, settings.converter())
                .scrollIndicators(.hidden)
        }
        // Pismo uređaja; važi i za alert iznad. `RoomScreen` ga zamenjuje pismom sobe.
        .environment(\.sr, settings.converter())
        .task { await settings.refreshRules() }
    }
}
