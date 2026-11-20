import SwiftUI

/// Tabela posle kruga: „Potera“ tabla, redovi kao neonske pilule. Vođa nastavlja.
struct ScoreboardView: View {
    @Environment(\.sr) private var sr
    let state: RoomState
    let onNext: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Text(sr("TABELA"))
                .font(Theme.display(size: 42))
                .tracking(1)
                .neonGlow(radius: 14)
                .padding(.top, 8)
            ScrollView {
                RankingBoard(ranks: state.tabela?.sada ?? [], previous: state.tabela?.pre, state: state)
                    .padding(.vertical, 6)
            }
            if state.isHost {
                Button(sr(state.tabela?.poslednja == true ? "Konačni rezultat" : "Sledeći krug"), action: onNext)
                    .buttonStyle(.primary)
            } else {
                Text(sr("Vođa nastavlja igru…")).foregroundStyle(Theme.muted)
            }
        }
        .padding(.bottom, 16)
    }
}

/// Redovi tabele: mesto, avatar, ime, strelica pomaka i poeni; traka u boji igrača raste do njegovog udela.
struct RankingBoard: View {
    @Environment(\.sr) private var sr
    let ranks: [RoomState.Rank]
    var previous: [RoomState.Rank]?
    let state: RoomState
    var startPlace = 1

    @State private var filled = false

    var body: some View {
        let best = max(1, ranks.first?.poeni ?? 1)
        VStack(spacing: 10) {
            ForEach(Array(ranks.enumerated()), id: \.element.id) { offset, rank in
                if let player = state.player(rank.id) {
                    let place = startPlace + offset
                    row(place: place, player: player, points: rank.poeni, share: Double(rank.poeni) / Double(best))
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
        }
        .onAppear {
            withAnimation(.easeOut(duration: 1.4).delay(0.2)) { filled = true }
        }
    }

    private func row(place: Int, player: RoomState.Player, points: Int, share: Double) -> some View {
        HStack(spacing: 10) {
            Text("\(place)")
                .font(Theme.display(.title3))
                .goldGlow(radius: 4)
                .frame(width: 28)
            Text(player.avatar).font(.title2)
            Text(sr(player.id == state.ja ? "\(player.ime) (ti)" : player.ime))
                .font(.body.weight(.bold))
                .lineLimit(1)
                .frame(maxWidth: .infinity, alignment: .leading)
            movement(for: player.id, place: place)
            Text("\(points)")
                .font(Theme.display(.title3))
                .monospacedDigit()
                .padding(.horizontal, 12)
                .padding(.vertical, 2)
                .background(.black.opacity(0.6), in: Capsule())
        }
        .padding(.horizontal, 16)
        .frame(minHeight: 54)
        .background {
            ZStack(alignment: .leading) {
                PillBackground(tone: place == 1 ? .gold : .blue)
                GeometryReader { proxy in
                    Rectangle()
                        .fill(Color(css: player.boja) ?? Theme.neon)
                        .opacity(0.3)
                        .frame(width: proxy.size.width * (filled ? share : 0))
                }
                .clipShape(Capsule())
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(sr("\(place). mesto, \(player.ime), \(points) poena"))
    }

    @ViewBuilder
    private func movement(for id: String, place: Int) -> some View {
        if let previous, let before = previous.firstIndex(where: { $0.id == id }).map({ $0 + 1 }), before != place {
            Image(systemName: before > place ? "arrowtriangle.up.fill" : "arrowtriangle.down.fill")
                .font(.caption)
                .foregroundStyle(before > place ? Theme.correctText : Theme.wrongText)
        }
    }
}

#if DEBUG
#Preview {
    ScoreboardView(state: .preview(.tabela)) {}
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}
#endif
