import SwiftUI

/// Otkrivanje „spoji pojmove“: tačni parovi, uz oznaku da li je moj par bio dobar i koliko igrača ga je pogodilo.
struct MatchingResult: View {
    let left: [String]
    let right: [String]
    /// Za svaki pojam levo – indeks tačnog para desno.
    let correct: [Int]
    /// Moji parovi (ako sam odgovorio).
    let mine: [Int]?
    /// Za svaki pojam levo – koliko igrača ga je tačno spojilo.
    let hits: [Int]?
    let playerCount: Int

    @Environment(\.sr) private var sr

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            SectionLabel("🔗 Tačni parovi")
            ForEach(left.indices, id: \.self) { index in
                row(index)
            }
        }
    }

    private func row(_ index: Int) -> some View {
        let answer = index < correct.count ? correct[index] : nil
        let myPick = mine.flatMap { index < $0.count ? $0[index] : nil }
        let isRight = myPick != nil && myPick == answer
        let tone: PillTone = mine == nil ? .blue : isRight ? .correct : .wrong

        return HStack(spacing: 10) {
            Image(systemName: mine == nil ? "link" : isRight ? "checkmark" : "xmark")
                .font(.subheadline.weight(.heavy))
                .frame(width: 18)
            VStack(alignment: .leading, spacing: 2) {
                (Text(sr(left[index])).bold() + Text("  →  ") + Text(sr(answer.flatMap { $0 < right.count ? right[$0] : nil } ?? "?")))
                    .font(.subheadline)
                if !isRight, let myPick, myPick < right.count {
                    Text(sr("tvoj par: \(right[myPick])"))
                        .font(.caption)
                        .strikethrough()
                        .opacity(0.85)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            if let hits, index < hits.count {
                Text("\(hits[index])/\(playerCount)")
                    .font(.caption.weight(.heavy))
                    .monospacedDigit()
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(.black.opacity(0.35), in: Capsule())
                    .accessibilityLabel(sr("pogodilo \(hits[index]) od \(playerCount)"))
            }
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background { PillBackground(tone: tone, cornerRadius: 18) }
    }
}

#if DEBUG
#Preview {
    MatchingResult(
        left: ["Botaničar", "Zoolog", "Mikolog"], right: ["gljive", "biljke", "životinje"],
        correct: [1, 2, 0], mine: [1, 0, 2], hits: [2, 1, 1], playerCount: 3
    )
    .padding()
    .screenBackground(maxWidth: Theme.maxGameWidth)
    .preferredColorScheme(.dark)
}
#endif
