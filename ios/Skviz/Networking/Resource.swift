import Foundation

enum HTTPMethod: Sendable {
    case get
    case post(Data?)
    case put(Data?)
    case delete

    var name: String {
        switch self {
        case .get: "GET"
        case .post: "POST"
        case .put: "PUT"
        case .delete: "DELETE"
        }
    }

    var body: Data? {
        switch self {
        case .post(let data), .put(let data): data
        case .get, .delete: nil
        }
    }
}

/// Opis jednog zahteva i načina na koji se odgovor pretvara u `Response`.
/// Tip odgovora je deo resursa, pa klijent nikad ne radi `as!`.
struct Resource<Response: Sendable>: Sendable {
    var url: URL
    var method: HTTPMethod
    var query: [URLQueryItem]
    var headers: [String: String]
    /// `true` = klijent dodaje `Authorization` i na 401 jednom osvežava token.
    var requiresAuth: Bool
    let decode: @Sendable (Data, LossyReport) throws -> Response

    init(
        url: URL,
        method: HTTPMethod = .get,
        query: [URLQueryItem] = [],
        headers: [String: String] = [:],
        requiresAuth: Bool = false,
        decode: @escaping @Sendable (Data, LossyReport) throws -> Response
    ) {
        self.url = url
        self.method = method
        self.query = query
        self.headers = headers
        self.requiresAuth = requiresAuth
        self.decode = decode
    }
}

extension Resource where Response: Decodable {
    /// Odgovor je JSON model. Prazno telo je greška (`NetworkError.emptyBody`).
    init(
        url: URL,
        method: HTTPMethod = .get,
        query: [URLQueryItem] = [],
        headers: [String: String] = [:],
        requiresAuth: Bool = false,
        makeDecoder: @escaping @Sendable () -> JSONDecoder = { JSONDecoder() }
    ) {
        self.init(url: url, method: method, query: query, headers: headers, requiresAuth: requiresAuth) { data, report in
            guard !data.isEmpty else { throw NetworkError.emptyBody }
            let decoder = makeDecoder()
            decoder.userInfo[.lossyReport] = report
            do {
                return try decoder.decode(Response.self, from: data)
            } catch {
                throw NetworkError.decoding(String(describing: error))
            }
        }
    }
}

extension Resource where Response == Void {
    /// Zahtev kod koga je bitan samo status (brisanje, glasanje, odjava). Telo se ignoriše.
    init(
        url: URL,
        method: HTTPMethod,
        query: [URLQueryItem] = [],
        headers: [String: String] = [:],
        requiresAuth: Bool = false
    ) {
        self.init(url: url, method: method, query: query, headers: headers, requiresAuth: requiresAuth) { _, _ in }
    }
}
