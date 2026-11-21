import Foundation

/// Konfiguracija aplikacije. Adresa servera je samo ovde; servisi sastavljaju URL-ove od nje.
enum AppConfig {
    /// Javni Skviz server. Za rad sa lokalnim serverom (`node server.js`) ovde ide `http://<IP računara>:3000`
    /// (uz izuzetak za lokalnu mrežu u Info.plist-u).
    static let baseURL = URL(string: "https://skviz.rs")!
}
