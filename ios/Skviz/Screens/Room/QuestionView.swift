import SwiftUI

/// Pitanje: četiri odgovora (izbor, uljez) ili „spoji pojmove“. Odgovor se šalje jednom i posle se ne menja.
struct QuestionView: View {
    let state: RoomState
    let serverNow: () -> Double
    let onAnswer: (AnswerValue) -> Void

    var body: some View {
        if let question = state.pitanje {
            QuestionContent(state: state, question: question, serverNow: serverNow, onAnswer: onAnswer)
                // Novo pitanje = nov prikaz, pa se lokalni izbor prethodnog briše.
                .id(question.rb)
        }
    }
}

private struct QuestionContent: View {
    @Environment(\.sr) private var sr
    let state: RoomState
    let question: RoomState.Question
    let serverNow: () -> Double
    let onAnswer: (AnswerValue) -> Void

    /// Odgovor poslat sa ovog telefona, dok server ne potvrdi (`mojOdgovor`).
    @State private var sentAnswer: Int?
    @State private var sentPairs: [Int]?
    @Environment(\.horizontalSizeClass) private var sizeClass

    private var chosen: Int? { state.mojOdgovor?.index ?? sentAnswer }
    private var chosenPairs: [Int]? { state.mojOdgovor?.pairs ?? sentPairs }
    private var questionScript: ScriptConverter { question.jezik == "en" ? .latin : sr }

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                QuestionHeader(question: question)
                GameTimer(start: question.pocetak, duration: question.trajanje, serverNow: serverNow)

                if question.vrsta == "uljez" {
                    KindBadge(text: "🕵️ Izbaci uljeza")
                } else if question.isMatching {
                    KindBadge(text: "🔗 Spoj pojmove")
                }

                QuestionPanel {
                    Text(sr.content(question.tekst, language: question.jezik))
                        .font(.title3.weight(.bold))
                        .fixedSize(horizontal: false, vertical: true)
                }
                .environment(\.sr, questionScript)

                if question.isMultipleChoice, let answers = question.odgovori {
                    AnswerGrid(answers: answers, twoColumns: sizeClass == .regular) { index in
                        chosen == nil ? .blue : chosen == index ? .chosen : .dimmed
                    } onTap: { index in
                        guard chosen == nil else { return }
                        sentAnswer = index
                        onAnswer(.index(index))
                    }
                    .sensoryFeedback(.impact(weight: .medium), trigger: sentAnswer)
                    // Kviz na engleskom se ne preslovljava (na sajtu `lang="en"`).
                    .environment(\.sr, questionScript)
                } else if question.isMatching, let left = question.levo, let right = question.desno {
                    MatchingBoard(left: left, right: right, sentPairs: chosenPairs) { pairs in
                        guard chosenPairs == nil else { return }
                        sentPairs = pairs
                        onAnswer(.pairs(pairs))
                    }
                    .environment(\.sr, questionScript)
                } else {
                    // Vrsta pitanja koju ova verzija ne poznaje; server posle isteka vremena prelazi na otkrivanje.
                    Text(sr("Ova vrsta pitanja još ne može da se igra u aplikaciji. Sačekaj sledeće pitanje."))
                        .foregroundStyle(Theme.muted)
                        .card()
                }

                AnsweredStatus(state: state, iAnswered: chosen != nil || chosenPairs != nil, isMatching: question.isMatching)
                    .padding(.top, 4)
            }
            .padding(.bottom, 24)
        }
    }
}

/// Mreža odgovora: jedna kolona na telefonu, dve na iPadu (kao na sajtu iznad 640 px).
struct AnswerGrid: View {
    let answers: [String]
    let twoColumns: Bool
    let tone: (Int) -> PillTone
    var votes: [Int]? = nil
    var onTap: ((Int) -> Void)? = nil

    var body: some View {
        let columns = Array(repeating: GridItem(.flexible(), spacing: 10), count: twoColumns ? 2 : 1)
        let total = max(1, votes?.reduce(0, +) ?? 0)
        LazyVGrid(columns: columns, spacing: 10) {
            ForEach(Array(answers.enumerated()), id: \.offset) { index, answer in
                AnswerButton(
                    index: index,
                    text: answer,
                    tone: tone(index),
                    rounded: twoColumns,
                    votes: votes.flatMap { index < $0.count ? $0[index] : nil },
                    share: votes.flatMap { index < $0.count ? Double($0[index]) / Double(total) : nil }
                ) {
                    onTap?(index)
                }
                .disabled(onTap == nil)
            }
        }
    }
}

/// Jedan odgovor: sjajna pilula sa zlatnim slovom (A:–D:), brojem glasova i trakom udela.
struct AnswerButton: View {
    @Environment(\.sr) private var sr
    let index: Int
    let text: String
    let tone: PillTone
    var rounded = false
    var votes: Int?
    var share: Double?
    let action: () -> Void

    @State private var appeared = false

    private var letter: String { sr.answerLetters[min(index, 3)] }
    private var isHighlighted: Bool { tone == .chosen || tone == .correct || tone == .wrong }

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Text("\(letter):")
                    .font(Theme.display(.title3))
                    .foregroundStyle(isHighlighted ? .white : Theme.gold)
                    .shadow(color: isHighlighted ? .clear : Theme.gold.opacity(0.6), radius: 5)
                Text(sr(text))
                    .font(.body.weight(.bold))
                    .foregroundStyle(.white)
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)
                if let votes, votes > 0 {
                    Text("\(votes)")
                        .font(.subheadline.weight(.heavy))
                        .monospacedDigit()
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(.black.opacity(0.35), in: Capsule())
                        .accessibilityLabel(sr("\(votes) glasova"))
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 14)
            .frame(maxWidth: .infinity, minHeight: 58)
            .background { PillBackground(tone: tone, cornerRadius: rounded ? 22 : nil) }
            .overlay(alignment: .bottomLeading) {
                if let share, share > 0 {
                    GeometryReader { proxy in
                        Rectangle()
                            .fill(.white.opacity(0.75))
                            .frame(width: proxy.size.width * share, height: 4)
                            .frame(maxHeight: .infinity, alignment: .bottom)
                    }
                    .clipShape(RoundedRectangle(cornerRadius: rounded ? 22 : 999, style: .continuous))
                    .allowsHitTesting(false)
                }
            }
            .opacity(tone == .dimmed ? 0.45 : 1)
            .scaleEffect(tone == .correct ? 1.03 : 1)
            .offset(y: appeared ? 0 : 16)
            .opacity(appeared ? 1 : 0)
        }
        .buttonStyle(PressableStyle())
        .animation(.spring(duration: 0.35), value: tone)
        .onAppear {
            withAnimation(.easeOut(duration: 0.35).delay(0.05 * Double(index + 1))) { appeared = true }
        }
        .accessibilityLabel("\(letter): \(sr(text))")
        .accessibilityAddTraits(tone == .chosen ? .isSelected : [])
    }
}

/// Dugme koje se malo smanji dok je pritisnuto.
struct PressableStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}

/// Gornji red pitanja: redni broj, težina i oblast (znački kao na sajtu).
struct QuestionHeader: View {
    @Environment(\.sr) private var sr
    let question: RoomState.Question

    var body: some View {
        HStack(spacing: 6) {
            Chip(text: "\(question.rb) / \(question.ukupno)")
            if let difficulty = question.tezina {
                Chip(text: String(repeating: "★", count: difficulty) + String(repeating: "☆", count: max(0, 3 - difficulty)), color: Theme.gold)
                    .accessibilityLabel(sr("Težina \(difficulty) od 3"))
            }
            if let area = question.oblast {
                Chip(text: "\(area.ikona ?? "") \(area.naziv)")
                    .lineLimit(1)
            }
            Spacer(minLength: 0)
        }
    }
}

/// Mala značka (pilula na tamnoj podlozi).
struct Chip: View {
    @Environment(\.sr) private var sr
    let text: String
    var color: Color = Theme.text

    var body: some View {
        Text(sr(text))
            .font(.footnote.weight(.semibold))
            .foregroundStyle(color)
            .padding(.horizontal, 11)
            .padding(.vertical, 4)
            .background(Theme.field, in: Capsule())
    }
}

/// Zlatna oznaka posebne vrste pitanja.
struct KindBadge: View {
    @Environment(\.sr) private var sr
    let text: String

    var body: some View {
        Text(sr(text))
            .font(.footnote.weight(.bold))
            .foregroundStyle(Color(hex: 0x2D1B00))
            .padding(.horizontal, 14)
            .padding(.vertical, 5)
            .background(Theme.gold, in: Capsule())
            .shadow(color: Theme.gold.opacity(0.5), radius: 8)
    }
}

/// Ko je već odgovorio: do 5 igrača avatari sa kvačicom, preko 5 samo brojač (kao na sajtu).
struct AnsweredStatus: View {
    @Environment(\.sr) private var sr
    let state: RoomState
    let iAnswered: Bool
    var isMatching = false

    var body: some View {
        let answered = Set(state.odgovorili ?? [])
        VStack(spacing: 10) {
            if iAnswered {
                Label(sr(isMatching ? "Parovi poslati – čekamo ostale" : "Odgovor je poslat – čekamo ostale"), systemImage: "checkmark.circle.fill")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(Theme.correctText)
            }
            if state.igraci.count <= 5 {
                HStack(spacing: 14) {
                    ForEach(state.igraci) { player in
                        PlayerAvatar(player: player, size: 40, hasAnswered: answered.contains(player.id))
                    }
                }
                .animation(.spring(duration: 0.3), value: answered)
            } else {
                Text(sr("\(answered.count) / \(state.igraci.count) odgovorilo"))
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(Theme.muted)
            }
        }
        .frame(maxWidth: .infinity)
    }
}

#if DEBUG
#Preview("Pitanje") {
    QuestionView(state: .preview(.pitanje), serverNow: { 1_700_000_005_000 }) { _ in }
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}

#Preview("Spoji pojmove") {
    QuestionView(state: .preview(.pitanje, matching: true), serverNow: { 1_700_000_005_000 }) { _ in }
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}
#endif
