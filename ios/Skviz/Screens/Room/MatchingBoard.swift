import SwiftUI

/// „Spoji pojmove“: dodirni pojam levo, pa njegov par desno – spojeni parovi dobiju istu boju,
/// ponovni dodir raskida par. Kad je sve spojeno, „Pošalji parove“. Pravila kao `ekranSpoji` na sajtu.
struct MatchingBoard: View {
    let left: [String]
    let right: [String]
    /// Parovi koji su već poslati (sa servera ili sa ovog telefona); tada je tabla zaključana.
    let sentPairs: [Int]?
    let onSend: ([Int]) -> Void

    @Environment(\.sr) private var sr
    /// `pairs[i]` = indeks pojma desno spojenog sa i-tim levo.
    @State private var pairs: [Int?]
    /// Pojam levo koji čeka par.
    @State private var activeLeft: Int? = 0

    init(left: [String], right: [String], sentPairs: [Int]?, onSend: @escaping ([Int]) -> Void) {
        self.left = left
        self.right = right
        self.sentPairs = sentPairs
        self.onSend = onSend
        _pairs = State(initialValue: Array(repeating: nil, count: left.count))
    }

    /// Boje parova sa sajta (`BOJE_PAROVA`); par nosi boju svog pojma levo.
    static let pairColors: [Color] = [Color(hex: 0xE17055), Color(hex: 0x0984E3), Color(hex: 0x00B894), Color(hex: 0xE1A700), Color(hex: 0xA29BFE)]

    private var isLocked: Bool { sentPairs != nil }
    private var shown: [Int?] { sentPairs.map { $0.map(Optional.some) } ?? pairs }
    private var isComplete: Bool { pairs.allSatisfy { $0 != nil } }

    var body: some View {
        VStack(spacing: 14) {
            HStack(alignment: .top, spacing: 10) {
                VStack(spacing: 10) {
                    ForEach(left.indices, id: \.self) { index in
                        MatchTile(
                            text: left[index],
                            color: shown[index].map { _ in color(for: index) },
                            isActive: !isLocked && activeLeft == index
                        ) { tapLeft(index) }
                    }
                }
                VStack(spacing: 10) {
                    ForEach(right.indices, id: \.self) { index in
                        let owner = shown.firstIndex(of: index)
                        MatchTile(text: right[index], color: owner.map(color(for:)), isActive: false) { tapRight(index) }
                    }
                }
            }
            .disabled(isLocked)
            .opacity(isLocked ? 0.75 : 1)
            .sensoryFeedback(.selection, trigger: pairs)

            if !isLocked {
                if isComplete {
                    Button {
                        onSend(pairs.compactMap { $0 })
                    } label: {
                        Label(sr("Pošalji parove"), systemImage: "checkmark")
                    }
                    .buttonStyle(.go)
                    .transition(.scale.combined(with: .opacity))
                } else {
                    Text(sr("Dodirni pojam levo, pa njegov par desno."))
                        .font(.footnote)
                        .foregroundStyle(Theme.muted)
                }
            }
        }
        .animation(.spring(duration: 0.3), value: pairs)
        .animation(.spring(duration: 0.3), value: isLocked)
    }

    private func color(for leftIndex: Int) -> Color {
        Self.pairColors[leftIndex % Self.pairColors.count]
    }

    private func tapLeft(_ index: Int) {
        pairs[index] = nil
        activeLeft = index
    }

    private func tapRight(_ index: Int) {
        let previousOwner = pairs.firstIndex(of: index)
        if let previousOwner { pairs[previousOwner] = nil }

        if activeLeft == nil || previousOwner == activeLeft {
            // dodir na već spojen pojam desno raskida par; sledeći za spajanje je njegov pojam levo
            activeLeft = previousOwner ?? pairs.firstIndex(of: nil)
        } else if let active = activeLeft {
            pairs[active] = index
            // dalje ide prvi slobodan pojam ispod, pa prvi slobodan od vrha
            let below = pairs.indices.first { $0 > active && pairs[$0] == nil }
            activeLeft = below ?? pairs.firstIndex(of: nil)
        }
    }
}

/// Jedan pojam: plava pilula, aktivan (čeka par) narandžast, spojen u boji para.
private struct MatchTile: View {
    let text: String
    let color: Color?
    let isActive: Bool
    let action: () -> Void

    @Environment(\.sr) private var sr

    var body: some View {
        Button(action: action) {
            Text(sr(text))
                .font(.subheadline.weight(.bold))
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity, minHeight: 56)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background {
                    if let color {
                        let shape = RoundedRectangle(cornerRadius: 16, style: .continuous)
                        shape.fill(color.gradient)
                            .overlay { shape.stroke(.white.opacity(0.8), lineWidth: 2) }
                            .shadow(color: color.opacity(0.6), radius: 8)
                    } else {
                        PillBackground(tone: isActive ? .chosen : .blue, cornerRadius: 16)
                    }
                }
                .scaleEffect(isActive ? 1.03 : 1)
        }
        .buttonStyle(PressableStyle())
        .accessibilityAddTraits(isActive ? .isSelected : [])
    }
}

#if DEBUG
#Preview("Spajanje") {
    MatchingBoard(left: ["Botaničar", "Zoolog", "Mikolog", "Antropolog"], right: ["gljive", "čoveka", "biljke", "životinje"], sentPairs: nil) { _ in }
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}

#Preview("Poslato") {
    MatchingBoard(left: ["Botaničar", "Zoolog", "Mikolog"], right: ["gljive", "biljke", "životinje"], sentPairs: [1, 2, 0]) { _ in }
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}
#endif
