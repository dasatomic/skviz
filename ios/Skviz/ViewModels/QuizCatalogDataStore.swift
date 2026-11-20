import Foundation

/// Spisak kvizova za izbor u lobiju.
@MainActor
final class QuizCatalogDataStore: ObservableObject {
    @Published private(set) var quizzes: [Quiz] = []
    @Published private(set) var isLoading = false
    @Published private(set) var error: NetworkError?

    private let service: any GameService

    init(service: any GameService) {
        self.service = service
    }

    var sections: [QuizSection] { QuizSection.sections(from: quizzes) }

    /// Ukupan broj pitanja („Opšte znanje“ je zbir drugih kvizova, pa se ne broji).
    var totalQuestions: Int {
        quizzes.filter { $0.id != "opste" }.reduce(0) { $0 + $1.broj }
    }

    func title(for choiceId: String) -> String {
        sections.lazy.flatMap(\.choices).first { $0.id == choiceId }?.title ?? choiceId
    }

    func load() async {
        isLoading = true
        defer { isLoading = false }
        do {
            quizzes = try await service.fetchQuizzes()
            error = nil
        } catch {
            report(error)
        }
    }

    func clearError() {
        error = nil
    }

    private func report(_ error: Error) {
        let networkError = error as? NetworkError ?? .transport(code: (error as NSError).code)
        guard !networkError.isCancellation else { return }
        self.error = networkError
    }
}
