import Foundation

/// Identitet ovog telefona: tajni id igrača, ime i avatar. Čuva se u `UserDefaults`, kao `ja` u localStorage na sajtu.
///
/// Tajni id ide samo serveru; ostali igrači vide javni id koji server izvodi iz njega (HMAC).
@MainActor
final class PlayerDataStore: ObservableObject {
    @Published private(set) var profile: PlayerProfile

    let playerId: String
    private let defaults: UserDefaults

    private enum Key {
        static let id = "skviz.igrac.id"
        static let name = "skviz.igrac.ime"
        static let avatar = "skviz.igrac.avatar"
    }

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        if let saved = defaults.string(forKey: Key.id), saved.count >= 8 {
            playerId = saved
        } else {
            // 32 heksadecimalna znaka, kao `noviId()` na sajtu; server traži 8–64.
            playerId = UUID().uuidString.replacingOccurrences(of: "-", with: "").lowercased()
            defaults.set(playerId, forKey: Key.id)
        }
        profile = PlayerProfile(
            name: defaults.string(forKey: Key.name) ?? "",
            avatar: defaults.string(forKey: Key.avatar) ?? PlayerProfile.avatars.randomElement() ?? "🦉"
        )
    }

    func setName(_ name: String) {
        profile.name = String(name.prefix(PlayerProfile.maxNameLength))
        defaults.set(profile.name, forKey: Key.name)
    }

    func setAvatar(_ avatar: String) {
        profile.avatar = avatar
        defaults.set(avatar, forKey: Key.avatar)
    }
}
