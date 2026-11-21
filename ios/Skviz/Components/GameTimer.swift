import SwiftUI

/// Digitalni sat iz „Potere“: crna kućica, zlatne cifre, neonski okvir. Poslednjih 5 s crveno pulsira.
struct DigitalClock: View {
    @Environment(\.sr) private var sr
    let seconds: Int

    private var isUrgent: Bool { seconds <= 5 }

    var body: some View {
        Text("\(seconds)")
            .font(Theme.display(size: 22))
            .monospacedDigit()
            .foregroundStyle(isUrgent ? Theme.urgent : Theme.gold)
            .shadow(color: (isUrgent ? Theme.urgent : Theme.gold).opacity(0.7), radius: 6)
            .frame(minWidth: 44)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(.black, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .stroke(isUrgent ? Theme.urgent : Theme.neon.opacity(0.55), lineWidth: 2)
            }
            .shadow(color: Theme.neon.opacity(0.3), radius: 6)
            .phaseAnimator(isUrgent ? [1, 0.55] : [1]) { view, opacity in
                view.opacity(opacity)
            } animation: { _ in .easeInOut(duration: 0.5) }
            .accessibilityLabel(sr("Preostalo \(seconds) sekundi"))
    }
}

/// Traka preostalog vremena: preliv od plave do neonske, sa sjajem.
struct TimeBar: View {
    let fraction: Double

    var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .leading) {
                Capsule().fill(Theme.showBlue3)
                    .overlay { Capsule().stroke(Theme.neon.opacity(0.27), lineWidth: 1) }
                Capsule()
                    .fill(LinearGradient(colors: [Theme.showBlue1, Theme.neon], startPoint: .leading, endPoint: .trailing))
                    .frame(width: max(0, proxy.size.width * fraction))
                    .shadow(color: Theme.neon, radius: 5)
            }
        }
        .frame(height: 8)
        .accessibilityHidden(true)
    }
}

/// Sat i traka zajedno, po satu servera (`pocetak` + `trajanje`).
struct GameTimer: View {
    let start: Double
    let duration: Double
    let serverNow: () -> Double

    var body: some View {
        TimelineView(.periodic(from: .now, by: 0.1)) { _ in
            let remaining = max(0, start + duration - serverNow())
            HStack(spacing: 12) {
                TimeBar(fraction: duration > 0 ? remaining / duration : 0)
                DigitalClock(seconds: Int(ceil(remaining / 1000)))
            }
        }
    }
}

#if DEBUG
#Preview {
    let now = Date().timeIntervalSince1970 * 1000
    VStack(spacing: 20) {
        GameTimer(start: now, duration: 20_000) { Date().timeIntervalSince1970 * 1000 }
        HStack { DigitalClock(seconds: 14); DigitalClock(seconds: 4) }
    }
    .padding()
    .screenBackground()
    .preferredColorScheme(.dark)
}
#endif
