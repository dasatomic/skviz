import Foundation

/// Ime i avatar koje igrač bira na početnom ekranu.
struct PlayerProfile: Equatable, Sendable {
    var name: String
    var avatar: String

    /// Isti avatari kao na sajtu (`AVATARI` u `public/app.js`).
    static let avatars = [
        "🦉", "🦊", "🐼", "🐯", "🦁", "🐸", "🐙", "🦄", "🐧", "🐨", "🐵", "🐶",
        "🐱", "🐰", "🦖", "🐢", "🦋", "🐝", "🦈", "🐳", "🌻", "🚀", "⚽", "🎸",
        "👑", "🧙", "🦸", "🤖", "👽", "🍕", "🌈", "⭐",
    ]

    /// Server skraćuje ime na 16 znakova (`dodajIgraca`).
    static let maxNameLength = 16

    var trimmedName: String {
        String(name.trimmingCharacters(in: .whitespacesAndNewlines).prefix(Self.maxNameLength))
    }
}
