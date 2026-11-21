import Foundation
import os

/// Log zahteva bez tajnih podataka. Telo zahteva i odgovora se nikad ne loguje,
/// vrednosti query parametara i osetljivih header-a su sakrivene.
enum RequestLog {
    static let sensitiveHeaders: Set<String> = [
        "authorization", "proxy-authorization", "cookie", "set-cookie", "x-api-key",
    ]

    static func describe(_ request: URLRequest) -> String {
        var line = request.httpMethod ?? "GET"
        if let url = request.url, var components = URLComponents(url: url, resolvingAgainstBaseURL: false) {
            let names = (components.queryItems ?? []).map(\.name)
            components.query = nil
            components.fragment = nil
            components.user = nil
            components.password = nil
            line += " " + (components.string ?? "")
            if !names.isEmpty {
                line += " ?" + names.joined(separator: "&")
            }
        }
        let headers = (request.allHTTPHeaderFields ?? [:])
            .sorted { $0.key < $1.key }
            .map { name, value in
                sensitiveHeaders.contains(name.lowercased()) ? "\(name): <sakriveno>" : "\(name): \(value)"
            }
        if !headers.isEmpty {
            line += " [" + headers.joined(separator: ", ") + "]"
        }
        return line
    }

    /// Ispis postoji samo u DEBUG build-u; u release build-u funkcija je prazna.
    static func debug(_ message: @autoclosure () -> String) {
        #if DEBUG
        let text = message()
        logger.debug("\(text, privacy: .public)")
        #endif
    }

    #if DEBUG
    private static let logger = Logger(subsystem: Bundle.main.bundleIdentifier ?? "app", category: "network")
    #endif
}
