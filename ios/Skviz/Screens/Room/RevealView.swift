import SwiftUI

/// Otkrivanje: moj rezultat, tačan odgovor sa glasovima, zanimljivost i poeni svih. Vođa nastavlja.
struct RevealView: View {
    @Environment(\.sr) private var sr
    let state: RoomState
    let onNext: () -> Void

    @Environment(\.horizontalSizeClass) private var sizeClass
    @State private var appeared = false

    private var myGain: RoomState.Gain? { state.dobitak?[state.ja] }

    var body: some View {
        if let question = state.pitanje {
            ScrollView {
                VStack(spacing: 14) {
                    QuestionHeader(question: question)
                    ResultBanner(gain: myGain)
                        .scaleEffect(appeared ? 1 : 0.7)
                        .opacity(appeared ? 1 : 0)

                    // Pitanje, odgovori i zanimljivost kviza na engleskom ostaju latinicom (na sajtu `lang="en"`).
                    Group {
                        QuestionPanel {
                            Text(sr.content(question.tekst, language: question.jezik))
                                .font(.headline)
                                .fixedSize(horizontal: false, vertical: true)
                        }

                        if let answers = question.odgovori, question.isMultipleChoice {
                            AnswerGrid(
                                answers: answers,
                                twoColumns: sizeClass == .regular,
                                tone: { tone(for: $0, correct: question.tacan?.index) },
                                votes: state.raspodela
                            )
                        } else if question.isMatching, let left = question.levo, let right = question.desno, let correct = question.tacan?.pairs {
                            MatchingResult(
                                left: left, right: right, correct: correct,
                                mine: state.mojOdgovor?.pairs, hits: state.raspodela, playerCount: state.igraci.count
                            )
                        }

                        if let text = nonEmpty(question.objasnjenje) ?? nonEmpty(question.zanimljivost) {
                            FunFact(text: text)
                        }
                    }
                    .environment(\.sr, question.jezik == "en" ? .latin : sr)

                    PointsList(state: state)

                    if state.isHost {
                        Button(sr(question.rb < question.ukupno ? "Sledeće pitanje" : "Rezultati"), action: onNext)
                            .buttonStyle(.primary)
                    } else {
                        Text(sr("Vođa nastavlja igru…"))
                            .foregroundStyle(Theme.muted)
                    }
                }
                .padding(.bottom, 24)
            }
            .sensoryFeedback(trigger: appeared) { _, _ in
                guard let myGain, myGain.bez != true else { return nil }
                if myGain.tacno { return .success }
                return (myGain.pogodjeno ?? 0) > 0 ? .warning : .error
            }
            .onAppear {
                withAnimation(.spring(duration: 0.5, bounce: 0.4)) { appeared = true }
            }
        }
    }

    private func tone(for index: Int, correct: Int?) -> PillTone {
        if index == correct { return .correct }
        if index == state.mojOdgovor?.index { return .wrong }
        return .dimmed
    }

    private func nonEmpty(_ text: String?) -> String? {
        guard let text, !text.isEmpty else { return nil }
        return text
    }
}

/// „Tačno! +850“ / „Netačno“ / „Bez odgovora“, sa bonusom za niz tačnih.
/// Za „spoji pojmove“: „Sve tačno!“ ili „Pogođeno 3 od 4“ (poeni srazmerni tačnim parovima).
struct ResultBanner: View {
    @Environment(\.sr) private var sr
    let gain: RoomState.Gain?

    var body: some View {
        if let gain {
            VStack(spacing: 2) {
                HStack(alignment: .firstTextBaseline, spacing: 12) {
                    Text(sr(title(gain)))
                        .font(Theme.display(size: 34))
                        .foregroundStyle(color(gain))
                        .shadow(color: color(gain).opacity(0.55), radius: 10)
                    if gain.poeni > 0 {
                        Text("+\(gain.poeni)")
                            .font(Theme.display(size: 30))
                            .monospacedDigit()
                            .goldGlow()
                    }
                }
                if let bonus = gain.bonus, bonus > 0 {
                    Text(sr("🔥 \(gain.niz ?? 3) zaredom · +\(bonus) bonus"))
                        .font(.subheadline.weight(.bold))
                        .foregroundStyle(Theme.gold)
                }
            }
            .frame(maxWidth: .infinity)
            .accessibilityElement(children: .combine)
        }
    }

    private func title(_ gain: RoomState.Gain) -> String {
        if gain.bez == true { return "Bez odgovora" }
        if let hit = gain.pogodjeno, let total = gain.od {
            if gain.tacno { return "Sve tačno!" }
            return hit > 0 ? "Pogođeno \(hit) od \(total)" : "Netačno"
        }
        return gain.tacno ? "Tačno!" : "Netačno"
    }

    private func color(_ gain: RoomState.Gain) -> Color {
        if gain.bez == true { return Theme.muted }
        if gain.tacno { return Theme.correctText }
        // delimično tačni parovi – zlatno, kao `.rezultat.delimicno` na sajtu
        if let hit = gain.pogodjeno, hit > 0 { return Theme.gold }
        return Theme.wrongText
    }
}

/// Zanimljivost kao Telegram citat: traka levo i naslov u boji.
struct FunFact: View {
    @Environment(\.sr) private var sr
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            RoundedRectangle(cornerRadius: 2)
                .fill(Theme.accentLight)
                .frame(width: 3)
            VStack(alignment: .leading, spacing: 6) {
                Text(sr("Da li si znao?"))
                    .font(.headline)
                    .foregroundStyle(Theme.accentLight)
                Text(sr(text))
                    .lineSpacing(3)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .card()
    }
}

/// Poeni svih igrača za ovo pitanje (do 8 redova, ostali sažeto).
struct PointsList: View {
    @Environment(\.sr) private var sr
    let state: RoomState

    private var rows: [(player: RoomState.Player, gain: RoomState.Gain)] {
        state.igraci
            .compactMap { player in state.dobitak?[player.id].map { (player, $0) } }
            .sorted { ($0.gain.poeni + ($0.gain.bonus ?? 0)) > ($1.gain.poeni + ($1.gain.bonus ?? 0)) }
    }

    var body: some View {
        let all = rows
        if all.count > 1 {
            VStack(alignment: .leading, spacing: 0) {
                SectionLabel("Poeni za ovo pitanje").padding(.bottom, 6)
                ForEach(Array(all.prefix(8).enumerated()), id: \.element.player.id) { index, row in
                    HStack(spacing: 10) {
                        PlayerAvatar(player: row.player, size: 32)
                        Text(sr(row.player.ime))
                            .fontWeight(row.player.id == state.ja ? .bold : .medium)
                            .lineLimit(1)
                        Spacer()
                        let total = row.gain.poeni + (row.gain.bonus ?? 0)
                        Text(total > 0 ? "+\(total)" : row.gain.bez == true ? "⏰" : "–")
                            .font(.body.weight(.bold))
                            .monospacedDigit()
                            .foregroundStyle(total > 0 ? Theme.correctText : Theme.muted)
                    }
                    .padding(.vertical, 7)
                    if index < min(all.count, 8) - 1 {
                        Divider().overlay(Theme.line)
                    }
                }
                if all.count > 8 {
                    Text(sr("i još \(all.count - 8)"))
                        .font(.footnote)
                        .foregroundStyle(Theme.muted)
                        .padding(.top, 6)
                }
            }
            .card()
        }
    }
}

#if DEBUG
#Preview("Vođa") {
    RevealView(state: .preview(.otkrivanje)) {}
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}

#Preview("Spoji pojmove") {
    RevealView(state: .preview(.otkrivanje, matching: true)) {}
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}

#Preview("Igrač") {
    RevealView(state: .preview(.otkrivanje, isHost: false)) {}
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}
#endif
