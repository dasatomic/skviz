import Foundation

/// Jedino mesto koje stvarno šalje zahtev. U testu se zamenjuje lažnim transportom kroz `init`,
/// bez globalnog stanja i bez `URLProtocol`-a.
protocol HTTPTransport: Sendable {
    func send(_ request: URLRequest) async throws -> (Data, URLResponse)
}

extension URLSession: HTTPTransport {
    func send(_ request: URLRequest) async throws -> (Data, URLResponse) {
        try await data(for: request)
    }
}

struct HTTPClient: Sendable {

    struct Configuration: Sendable {
        var defaultHeaders: [String: String] = ["Accept": "application/json"]
        /// Vadi poruku za korisnika iz tela greške. Svaki backend ima svoj model greške.
        var serverMessage: @Sendable (Data) -> String? = { _ in nil }
        /// Poziva se kad `@LossyArray` preskoči elemente: URL zahteva i broj preskočenih.
        /// Ovde se prijavljuje u Crashlytics / log, da tiho izgubljeni podaci ne ostanu nevidljivi.
        var onLossyDecode: @Sendable (URL, Int) -> Void = { _, _ in }

        init() {}
    }

    private let transport: any HTTPTransport
    private let configuration: Configuration

    // Skviz nema prijavu, pa klijent nema `AuthSession` ni osvežavanje tokena.
    init(
        transport: any HTTPTransport = URLSession.shared,
        configuration: Configuration = Configuration()
    ) {
        self.transport = transport
        self.configuration = configuration
    }

    func load<Response>(_ resource: Resource<Response>) async throws -> Response {
        try await perform(resource, token: nil)
    }

    private func perform<Response>(_ resource: Resource<Response>, token: String?) async throws -> Response {
        let request = try makeRequest(resource, token: token)
        RequestLog.debug(RequestLog.describe(request))

        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await transport.send(request)
        } catch let error as URLError {
            throw NetworkError(error)
        } catch is CancellationError {
            throw NetworkError.cancelled
        }

        guard let http = response as? HTTPURLResponse else {
            throw NetworkError.transport(code: URLError.Code.badServerResponse.rawValue)
        }
        RequestLog.debug("\(http.statusCode) \(request.url?.path ?? "")")

        switch http.statusCode {
        case 200..<300:
            let report = LossyReport()
            let value = try resource.decode(data, report)
            if report.skipped > 0, let url = request.url {
                configuration.onLossyDecode(url, report.skipped)
            }
            return value
        case 401:
            throw NetworkError.unauthorized
        default:
            throw NetworkError.http(status: http.statusCode, serverMessage: configuration.serverMessage(data))
        }
    }

    private func makeRequest<Response>(_ resource: Resource<Response>, token: String?) throws -> URLRequest {
        guard var components = URLComponents(url: resource.url, resolvingAgainstBaseURL: false) else {
            throw NetworkError.invalidRequest
        }
        if !resource.query.isEmpty {
            components.queryItems = (components.queryItems ?? []) + resource.query
        }
        guard let url = components.url else {
            throw NetworkError.invalidRequest
        }

        var request = URLRequest(url: url)
        request.httpMethod = resource.method.name
        if let body = resource.method.body {
            request.httpBody = body
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        for (name, value) in configuration.defaultHeaders.merging(resource.headers, uniquingKeysWith: { _, new in new }) {
            request.setValue(value, forHTTPHeaderField: name)
        }
        if let token {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        return request
    }
}
