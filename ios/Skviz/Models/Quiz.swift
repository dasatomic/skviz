import Foundation

/// Jedan kviz iz `GET /api/kvizovi`. Prvi u listi je uvek „Opšte znanje“ (`id = "opste"`).
struct Quiz: Decodable, Identifiable, Hashable, Sendable {
    let id: String
    let naziv: String
    let ikona: String?
    let boja: String?
    let opis: String?
    let broj: Int
    let oblast: String?
    let razred: Int?
    /// Kviz bez pitanja koji samo okuplja podkategorije (npr. „Sport“).
    let kategorija: Bool?
    /// Matematički zadaci se rešavaju na papiru – aplikacija ih još ne podržava.
    let zadaci: Bool?

    var canBePlayed: Bool { broj > 0 && kategorija != true && zadaci != true }
}

/// Grupa kvizova za izbor u lobiju: „Opšte“ i po jedna grupa za svaku oblast.
struct QuizSection: Identifiable, Hashable, Sendable {
    /// Izbor koji se šalje serveru u `podesavanja.kviz` (`opste`, `oblast:<oblast>`, `<paket>`).
    struct Choice: Identifiable, Hashable, Sendable {
        let id: String
        let title: String
        let icon: String
        let color: String?
        let questionCount: Int
    }

    let id: String
    let title: String
    let icon: String
    /// Razredi za koje oblast ima kvizove (prazno za „Opšte“).
    let grades: [Int]
    let choices: [Choice]

    /// Pravi grupe po pravilima servera (`lib/kvizovi.js` → `izvor`).
    static func sections(from quizzes: [Quiz]) -> [QuizSection] {
        let playable = quizzes.filter(\.canBePlayed)
        let general = playable.filter { $0.oblast == nil }
        var sections = [
            QuizSection(id: "opste", title: "Opšte", icon: "🌍", grades: [], choices: general.map(Choice.init)),
        ]

        var order: [String] = []
        var byArea: [String: [Quiz]] = [:]
        for quiz in playable {
            guard let area = quiz.oblast else { continue }
            if byArea[area] == nil { order.append(area) }
            byArea[area, default: []].append(quiz)
        }
        for area in order {
            let items = byArea[area] ?? []
            var choices = items.map(Choice.init)
            if items.count > 1 {
                let all = Choice(
                    id: "oblast:\(area)",
                    title: "Sve iz oblasti",
                    icon: items.first?.ikona ?? "📚",
                    color: items.first?.boja,
                    questionCount: items.reduce(0) { $0 + $1.broj }
                )
                choices.insert(all, at: 0)
            }
            sections.append(QuizSection(
                id: area,
                title: title(of: area, in: quizzes),
                icon: items.first?.ikona ?? "📚",
                grades: Array(Set(items.compactMap(\.razred))).sorted(),
                choices: choices
            ))
        }
        return sections.filter { !$0.choices.isEmpty }
    }

    /// Naslov oblasti: naziv kategorije („Sport“), kviza bez razreda („Fizika“),
    /// ili deo naziva posle „·“ („5. razred · Srpski – gramatika“ → „Srpski – gramatika“).
    private static func title(of area: String, in quizzes: [Quiz]) -> String {
        let inArea = quizzes.filter { $0.oblast == area }
        if let named = inArea.first(where: { $0.kategorija == true }) ?? inArea.first(where: { $0.razred == nil }) {
            return named.naziv
        }
        if let naziv = inArea.first?.naziv, let part = naziv.split(separator: "·").last {
            return part.trimmingCharacters(in: .whitespaces)
        }
        return area.capitalized
    }
}

extension QuizSection.Choice {
    init(_ quiz: Quiz) {
        self.init(id: quiz.id, title: quiz.naziv, icon: quiz.ikona ?? "📚", color: quiz.boja, questionCount: quiz.broj)
    }
}
