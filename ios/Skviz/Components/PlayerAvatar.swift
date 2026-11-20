import SwiftUI

/// Avatar igrača u krugu sa okvirom u boji koju je dodelio server, uz krunu vođe i kvačicu za odgovor.
struct PlayerAvatar: View {
    let player: RoomState.Player
    var size: CGFloat = 56
    var isHost = false
    var hasAnswered = false

    var body: some View {
        Text(player.avatar)
            .font(.system(size: size * 0.55))
            .frame(width: size, height: size)
            .background(Theme.field, in: Circle())
            .overlay { Circle().stroke(Color(css: player.boja) ?? Theme.accent, lineWidth: max(2, size / 22)) }
            .overlay(alignment: .top) {
                if isHost {
                    Text("👑")
                        .font(.system(size: size * 0.32))
                        .offset(y: -size * 0.24)
                }
            }
            .overlay(alignment: .bottomTrailing) {
                if hasAnswered {
                    Image(systemName: "checkmark")
                        .font(.system(size: size * 0.2, weight: .heavy))
                        .foregroundStyle(.white)
                        .frame(width: size * 0.4, height: size * 0.4)
                        .background(Theme.correct, in: Circle())
                        .overlay { Circle().stroke(Theme.card, lineWidth: 2) }
                        .offset(x: 2, y: 2)
                        .transition(.scale.combined(with: .opacity))
                }
            }
            .opacity(player.povezan == false ? 0.4 : 1)
    }
}

/// Avatar sa imenom ispod (lobi, „ko je odgovorio“).
struct PlayerTile: View {
    @Environment(\.sr) private var sr
    let player: RoomState.Player
    var isHost = false
    var isMe = false
    var hasAnswered = false
    var size: CGFloat = 56

    var body: some View {
        VStack(spacing: 6) {
            PlayerAvatar(player: player, size: size, isHost: isHost, hasAnswered: hasAnswered)
            Text(sr(isMe ? "\(player.ime) (ti)" : player.ime))
                .font(.caption.weight(isMe ? .bold : .medium))
                .lineLimit(1)
                .truncationMode(.tail)
        }
        .frame(width: size + 26)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(sr([player.ime, isHost ? "vođa" : nil, hasAnswered ? "odgovorio" : nil].compactMap { $0 }.joined(separator: ", ")))
    }
}

#if DEBUG
#Preview {
    let state = RoomState.preview(.lobi)
    HStack(spacing: 16) {
        PlayerTile(player: state.igraci[0], isHost: true, isMe: true)
        PlayerTile(player: state.igraci[1], hasAnswered: true)
    }
    .padding(30)
    .screenBackground()
    .preferredColorScheme(.dark)
}
#endif
