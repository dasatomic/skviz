import SwiftUI

@main
struct SkvizApp: App {
    @StateObject private var player: PlayerDataStore
    @StateObject private var settings: SettingsDataStore
    @StateObject private var catalog: QuizCatalogDataStore
    @StateObject private var room: RoomDataStore
    @StateObject private var errorCenter = ErrorCenter()

    init() {
        // Zavisnosti se prave jednom, ovde, i prosleđuju naniže kroz environment.
        var configuration = HTTPClient.Configuration()
        configuration.serverMessage = { data in
            (try? JSONDecoder().decode(ServerError.self, from: data))?.greska
        }
        let service = GameServiceFactory.make(client: HTTPClient(configuration: configuration), baseURL: AppConfig.baseURL)
        let player = PlayerDataStore()
        _player = StateObject(wrappedValue: player)
        _settings = StateObject(wrappedValue: SettingsDataStore(service: service))
        _catalog = StateObject(wrappedValue: QuizCatalogDataStore(service: service))
        _room = StateObject(wrappedValue: RoomDataStore(service: service, playerId: player.playerId))
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(player)
                .environmentObject(settings)
                .environmentObject(catalog)
                .environmentObject(room)
                .environmentObject(errorCenter)
                // Bez indikatora skrolovanja u celoj aplikaciji (listovi preko ekrana ga postavljaju i sami).
                .scrollIndicators(.hidden)
                .preferredColorScheme(.dark)
                .tint(Theme.accent)
        }
    }
}
