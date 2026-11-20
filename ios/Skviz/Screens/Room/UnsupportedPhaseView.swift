import SwiftUI

/// Faza koju aplikacija još ne prikazuje (npr. „Najduža reč“, ako ju je uključio vođa sa sajta).
struct UnsupportedPhaseView: View {
    @Environment(\.sr) private var sr
    let isHost: Bool
    let onNext: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Spacer()
            Text("🔤")
                .font(.system(size: 64))
            Text(sr("Ovaj deo igre još nije u aplikaciji"))
                .font(.title3.weight(.bold))
                .multilineTextAlignment(.center)
            (Text(sr("Igraj ga na ")) + Text(verbatim: "skviz.rs") + Text(sr(" ili sačekaj da se igra nastavi.")))
                .foregroundStyle(Theme.muted)
                .multilineTextAlignment(.center)
            Spacer()
            if isHost {
                Button(sr("Preskoči"), action: onNext).buttonStyle(.primary)
            } else {
                WaitingDots()
            }
        }
        .padding(.bottom, 24)
    }
}

#if DEBUG
#Preview("Vođa") {
    UnsupportedPhaseView(isHost: true) {}
        .padding()
        .screenBackground()
        .preferredColorScheme(.dark)
}

#Preview("Igrač") {
    UnsupportedPhaseView(isHost: false) {}
        .padding()
        .screenBackground()
        .preferredColorScheme(.dark)
}
#endif
