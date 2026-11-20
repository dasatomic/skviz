import SwiftUI

/// Uvod „Šta je Skviz?“ (tekst sa početne strane sajta). Pojavljuje se jednom, pri prvom pokretanju,
/// a posle se otvara sa početnog ekrana.
struct OnboardingScreen: View {
    let onFinish: () -> Void

    @EnvironmentObject private var catalog: QuizCatalogDataStore
    @Environment(\.sr) private var sr
    @State private var page = 0

    private let pageCount = 3

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Spacer()
                Button(sr("Preskoči"), action: onFinish)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(Theme.muted)
                    .opacity(page < pageCount - 1 ? 1 : 0)
            }
            .padding(.horizontal, 20)
            .padding(.top, 8)

            TabView(selection: $page) {
                about.tag(0)
                howToPlay.tag(1)
                subjects.tag(2)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))

            PageDots(count: pageCount, current: page)
                .padding(.bottom, 16)

            Button(sr(page < pageCount - 1 ? "Dalje" : "Počni da igraš")) {
                if page < pageCount - 1 {
                    withAnimation { page += 1 }
                } else {
                    onFinish()
                }
            }
            .buttonStyle(page < pageCount - 1 ? .primary : .go)
            .padding(.horizontal, 20)
            .padding(.bottom, 12)
        }
        .frame(maxWidth: Theme.maxFormWidth)
        .frame(maxWidth: .infinity)
        .background { AppBackground() }
        .task {
            if catalog.quizzes.isEmpty { await catalog.load() }
        }
    }

    // MARK: - Strane

    private var about: some View {
        pageContent {
            Image("Logo")
                .resizable()
                .scaledToFit()
                .frame(maxWidth: 220)
                .shadow(color: Theme.neon.opacity(0.35), radius: 20)
                .accessibilityLabel("Skviz")
            Title(sr("Šta je Skviz?"))
            Text(sr("Skviz je besplatan kviz znanja koji se igra preko telefona – bez naloga. Jedan igrač napravi sobu, ostali uđu kodom od četiri slova, a pitanja se mogu prikazati i na televizoru ili računaru."))
                .multilineTextAlignment(.center)
                .lineSpacing(3)
            Text(sr("Igra je namenjena deci od 11 do 15 godina i odraslima, a može se igrati i sam."))
                .multilineTextAlignment(.center)
                .foregroundStyle(Theme.muted)
            VStack(spacing: 8) {
                SectionLabel(sr("Pismo"), alignment: .center)
                ScriptPicker().frame(maxWidth: 280)
            }
            .padding(.top, 8)
        }
    }

    private var howToPlay: some View {
        pageContent {
            Title(sr("Kako se igra"))
            VStack(alignment: .leading, spacing: 14) {
                Step(number: 1, text: sr("Upiši ime, izaberi avatar i napravi sobu."))
                Step(number: 2, text: sr("Pozovi ostale – ulaze sa svojih telefona kodom sobe."))
                Step(number: 3, text: sr("Izaberi predmet, razred ili lekciju i pokreni kviz."))
                Step(number: 4, text: sr("Odgovaraj brzo i tačno: brži tačan odgovor donosi više poena, a tri tačna zaredom donose bonus."))
            }
            .card()
        }
    }

    private var subjects: some View {
        pageContent {
            Title(sr("Predmeti i razredi"))
            if catalog.quizzes.isEmpty {
                Text(sr("Biologija, fizika, geografija, istorija, hemija, srpski jezik i opšte znanje – po lekcijama za 5–8. razred."))
                    .multilineTextAlignment(.center)
            } else {
                VStack(spacing: 0) {
                    ForEach(catalog.sections.filter { !$0.grades.isEmpty }.prefix(7)) { section in
                        HStack(spacing: 12) {
                            QuizIcon(icon: section.icon, color: section.choices.first?.color, size: 38)
                            Text(sr(section.title)).font(.body.weight(.semibold))
                            Spacer()
                            Text(sr(gradesText(section.grades)))
                                .font(.footnote)
                                .foregroundStyle(Theme.muted)
                        }
                        .padding(.vertical, 6)
                    }
                    HStack(spacing: 12) {
                        QuizIcon(icon: "🌍", color: "#e17055", size: 38)
                        Text(sr("Opšte znanje")).font(.body.weight(.semibold))
                        Spacer()
                        Text(sr("istorija, umetnost, sport, igrice…"))
                            .font(.footnote)
                            .foregroundStyle(Theme.muted)
                    }
                    .padding(.vertical, 6)
                }
                .card(padding: 12)
                Text(sr("Više od \(roundedCount) pitanja, sa zanimljivostima posle svakog odgovora."))
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Theme.muted)
            }
        }
    }

    // MARK: - Pomoćno

    private func pageContent<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        ScrollView {
            VStack(spacing: 18) {
                content()
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 12)
            .frame(maxWidth: .infinity)
        }
        .scrollBounceBehavior(.basedOnSize)
    }

    /// „5–8. razred“ ili „6, 7. i 8. razred“.
    private func gradesText(_ grades: [Int]) -> String {
        guard let first = grades.first, let last = grades.last else { return "" }
        if grades.count == 1 { return "\(first). razred" }
        if grades == Array(first...last), grades.count > 2 { return "\(first)–\(last). razred" }
        let head = grades.dropLast().map(String.init).joined(separator: ", ")
        return "\(head). i \(last). razred"
    }

    /// Broj pitanja zaokružen naniže na hiljadu („12.000“), da tekst ne zastareva sa svakim novim pitanjem.
    private var roundedCount: String {
        let thousands = catalog.totalQuestions / 1000 * 1000
        return thousands.formatted(.number.locale(Locale(identifier: "sr")))
    }
}

/// Veliki naslov strane uvoda.
private struct Title: View {
    let text: String

    init(_ text: String) {
        self.text = text
    }

    var body: some View {
        Text(text)
            .font(Theme.display(.largeTitle))
            .multilineTextAlignment(.center)
            .neonGlow(radius: 12)
    }
}

/// Korak „Kako se igra“: broj u neonskom krugu i tekst.
private struct Step: View {
    let number: Int
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            Text("\(number)")
                .font(Theme.display(.title3))
                .goldGlow(radius: 4)
                .frame(width: 38, height: 38)
                .background {
                    Circle().fill(RadialGradient(colors: [Theme.showBlue1, Theme.showBlue3], center: .top, startRadius: 0, endRadius: 30))
                }
                .overlay { Circle().stroke(Theme.neon, lineWidth: 2) }
            Text(text)
                .fixedSize(horizontal: false, vertical: true)
                .padding(.top, 8)
        }
    }
}

/// Tačkice strana uvoda.
private struct PageDots: View {
    let count: Int
    let current: Int

    var body: some View {
        HStack(spacing: 8) {
            ForEach(0..<count, id: \.self) { index in
                Capsule()
                    .fill(index == current ? Theme.neon : Theme.field)
                    .frame(width: index == current ? 22 : 8, height: 8)
            }
        }
        .animation(.spring(duration: 0.3), value: current)
        .accessibilityHidden(true)
    }
}

#if DEBUG
#Preview {
    let service = MockGameService()
    let settings = SettingsDataStore(service: service, defaults: UserDefaults(suiteName: "preview") ?? .standard)
    OnboardingScreen {}
        .environmentObject(settings)
        .environmentObject(QuizCatalogDataStore(service: service))
        .environment(\.sr, settings.converter(for: .cirilica))
        .preferredColorScheme(.dark)
}
#endif
