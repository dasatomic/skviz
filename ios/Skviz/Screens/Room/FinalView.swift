import SwiftUI

/// Kraj partije: podijum za prva tri mesta, konfete i ostatak poretka. Vođa vraća sve u lobi.
struct FinalView: View {
    @Environment(\.sr) private var sr
    let state: RoomState
    let onNewGame: () -> Void

    private var ranks: [RoomState.Rank] { state.konacno ?? [] }
    private var iWon: Bool { ranks.first?.id == state.ja }

    var body: some View {
        ZStack {
            VStack(spacing: 14) {
                Text(sr(iWon ? "POBEDIO SI!" : "KRAJ IGRE"))
                    .font(Theme.display(size: 40))
                    .tracking(1)
                    .foregroundStyle(iWon ? Theme.gold : .white)
                    .shadow(color: (iWon ? Theme.gold : Theme.neon).opacity(0.6), radius: 14)
                    .padding(.top, 8)

                Podium(ranks: Array(ranks.prefix(3)), state: state)

                if ranks.count > 3 {
                    ScrollView {
                        RankingBoard(ranks: Array(ranks.dropFirst(3)), state: state, startPlace: 4)
                            .padding(.vertical, 4)
                    }
                    // Skrol do ivica ekrana (spoljni razmak vraćen kao margina sadržaja), da ne seče sjaj redova.
                    .padding(.horizontal, -Theme.screenMargin)
                    .scrollMargins()
                } else {
                    Spacer(minLength: 0)
                }

                if state.isHost {
                    Button(action: onNewGame) {
                        Label(sr("Nova igra"), systemImage: "arrow.counterclockwise")
                    }
                    .buttonStyle(.go)
                } else {
                    Text(sr("Vođa može da pokrene novu igru.")).foregroundStyle(Theme.muted)
                }
            }
            .padding(.bottom, 16)

            ConfettiView()
        }
        .sensoryFeedback(.success, trigger: iWon) { _, new in new }
    }
}

/// Podijum: 2. mesto levo, 1. u sredini, 3. desno. Stubovi rastu redom 3 → 2 → 1, kao na sajtu.
struct Podium: View {
    @Environment(\.sr) private var sr
    let ranks: [RoomState.Rank]
    let state: RoomState

    @State private var grown = false

    var body: some View {
        // redosled prikaza: 2, 1, 3
        let order = [1, 0, 2].filter { $0 < ranks.count }
        HStack(alignment: .bottom, spacing: 10) {
            ForEach(order, id: \.self) { index in
                if let player = state.player(ranks[index].id) {
                    column(place: index + 1, player: player, points: ranks[index].poeni)
                }
            }
        }
        .frame(height: 300, alignment: .bottom)
        .onAppear { grown = true }
    }

    private func column(place: Int, player: RoomState.Player, points: Int) -> some View {
        let style = PodiumStyle(place: place)
        return VStack(spacing: 4) {
            Text(player.avatar)
                .font(.system(size: place == 1 ? 52 : 42))
                .phaseAnimator([0, -8]) { view, offset in
                    view.offset(y: grown ? offset : 0)
                } animation: { _ in .easeInOut(duration: 0.9) }
            Text(sr(player.ime))
                .font(.subheadline.weight(.bold))
                .lineLimit(1)
            Text("\(points)")
                .font(.caption.weight(.bold))
                .monospacedDigit()
                .foregroundStyle(Theme.muted)
            Text("\(place)")
                .font(Theme.display(size: 40))
                .foregroundStyle(style.digit)
                .frame(maxWidth: .infinity)
                .frame(height: grown ? style.height : 0, alignment: .top)
                .padding(.top, grown ? 8 : 0)
                .clipped()
                .background {
                    UnevenRoundedRectangle(topLeadingRadius: 14, topTrailingRadius: 14, style: .continuous)
                        .fill(LinearGradient(colors: style.colors, startPoint: .top, endPoint: .bottom))
                        .overlay {
                            UnevenRoundedRectangle(topLeadingRadius: 14, topTrailingRadius: 14, style: .continuous)
                                .stroke(style.border, lineWidth: 2)
                        }
                        .shadow(color: style.glow, radius: 14)
                }
                .animation(.spring(duration: 1.1, bounce: 0.35).delay(style.delay), value: grown)
        }
        .frame(maxWidth: 160)
        .opacity(grown ? 1 : 0)
        .animation(.easeOut(duration: 0.5).delay(style.delay + 0.5), value: grown)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(sr("\(place). mesto, \(player.ime), \(points) poena"))
    }
}

private struct PodiumStyle {
    let height: CGFloat
    let colors: [Color]
    let border: Color
    let glow: Color
    let digit: Color
    let delay: Double

    init(place: Int) {
        switch place {
        case 1:
            self.init(height: 170, colors: [Color(hex: 0xFFD666), Color(hex: 0xE1A000)], border: Color(hex: 0xFFF1B8),
                      glow: Theme.gold.opacity(0.55), digit: Color(hex: 0x5B3D00), delay: 1.2)
        case 2:
            self.init(height: 125, colors: [Color(hex: 0x4D8CFF), Color(hex: 0x1A3FA8)], border: Theme.neon,
                      glow: Theme.neon.opacity(0.4), digit: .white, delay: 0.6)
        default:
            self.init(height: 90, colors: [Color(hex: 0x2F6BDF), Color(hex: 0x0E2A7A)], border: Theme.neon.opacity(0.67),
                      glow: Theme.neon.opacity(0.27), digit: .white, delay: 0.1)
        }
    }

    private init(height: CGFloat, colors: [Color], border: Color, glow: Color, digit: Color, delay: Double) {
        self.height = height
        self.colors = colors
        self.border = border
        self.glow = glow
        self.digit = digit
        self.delay = delay
    }
}

#if DEBUG
#Preview("Pobeda") {
    FinalView(state: .preview(.kraj)) {}
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}

#Preview("Igrač") {
    FinalView(state: .preview(.kraj, isHost: false)) {}
        .padding()
        .screenBackground(maxWidth: Theme.maxGameWidth)
        .preferredColorScheme(.dark)
}
#endif
