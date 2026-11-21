import SwiftUI

/// Najava kruga u stilu „Potere“. Server sam prelazi na prvo pitanje posle 6 s.
struct IntroView: View {
    @Environment(\.sr) private var sr
    let state: RoomState
    let serverNow: () -> Double

    @State private var appeared = false

    private var isWords: Bool { state.uvod?.vrsta == "reci" }

    var body: some View {
        VStack(spacing: 18) {
            Spacer()
            Text(isWords ? "🔤" : "❓")
                .font(.system(size: 72))
                .frame(width: 140, height: 140)
                .background {
                    Circle().fill(RadialGradient(
                        colors: [Theme.showBlue1, Theme.showBlue3],
                        center: UnitPoint(x: 0.5, y: 0.35), startRadius: 0, endRadius: 90
                    ))
                }
                .overlay { Circle().stroke(Theme.neon, lineWidth: 3) }
                .shadow(color: Theme.neon.opacity(0.55), radius: 20)
                .rotation3DEffect(.degrees(appeared ? 0 : 180), axis: (x: 0, y: 1, z: 0))
                .scaleEffect(appeared ? 1 : 0.6)

            VStack(spacing: 6) {
                Text(sr("Krug \(state.uvod?.broj ?? 1)"))
                    .font(.headline)
                    .foregroundStyle(Theme.accentLight)
                Text(sr(isWords ? "NAJDUŽA REČ" : "PITANJA"))
                    .font(Theme.display(size: 46))
                    .tracking(1)
                    .neonGlow(radius: 14)
                    .scaleEffect(appeared ? 1 : 1.4)
                    .opacity(appeared ? 1 : 0)
            }

            if !isWords {
                Text(sr("\(state.uvod?.brojPitanja ?? state.podesavanja.brojPitanja) pitanja · \(state.podesavanja.vreme) s za odgovor\nBrži tačan odgovor donosi više poena."))
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Theme.muted)
                    .opacity(appeared ? 1 : 0)
            }
            Spacer()
            if let deadline = state.rokDo {
                TimelineView(.periodic(from: .now, by: 0.25)) { _ in
                    HStack(spacing: 10) {
                        Text(sr("Počinje za")).foregroundStyle(Theme.muted)
                        DigitalClock(seconds: max(0, Int(ceil((deadline - serverNow()) / 1000))))
                    }
                }
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.bottom, 24)
        .onAppear {
            withAnimation(.spring(duration: 0.9, bounce: 0.35)) { appeared = true }
        }
    }
}

#if DEBUG
#Preview {
    IntroView(state: .preview(.uvod)) { Date().timeIntervalSince1970 * 1000 }
        .padding()
        .screenBackground()
        .preferredColorScheme(.dark)
}
#endif
