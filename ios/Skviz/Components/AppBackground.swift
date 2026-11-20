import SwiftUI

/// Pozadina sa sajta: tamnoplava, dva blaga preliva i mustra crteža (upitnik, zvezda, sijalica, olovka, papir).
struct AppBackground: View {
    var body: some View {
        ZStack {
            Theme.background
            RadialGradient(colors: [Color(hex: 0x1B3A5C), .clear], center: .topLeading, startRadius: 0, endRadius: 700)
            RadialGradient(colors: [Color(hex: 0x123047), .clear], center: .bottomTrailing, startRadius: 0, endRadius: 600)
            Image("Pattern")
                .resizable(resizingMode: .tile)
                .accessibilityHidden(true)
        }
        .ignoresSafeArea()
    }
}

extension View {
    /// Pozadina ekrana i ograničena širina sadržaja (iPad).
    func screenBackground(maxWidth: CGFloat = Theme.maxFormWidth) -> some View {
        frame(maxWidth: maxWidth)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background { AppBackground() }
    }
}

#if DEBUG
#Preview {
    Text("Skviz").font(.largeTitle).screenBackground()
}
#endif
