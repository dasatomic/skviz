import SwiftUI

/// Vizuelni jezik sajta (`public/style.css`): okvir u stilu Telegrama (tamna tema, mustra, mehurići)
/// i igra u stilu „Potere“ (neonsko plave pilule, zlatna slova, digitalni sat, tabla).
enum Theme {
    // Telegram okvir
    static let background = Color(hex: 0x0E1621)     // --poz
    static let background2 = Color(hex: 0x17212B)    // --poz2
    static let card = Color(hex: 0x182533)           // --kartica
    static let cardSelected = Color(hex: 0x2B5278)   // --kartica2
    static let field = Color(hex: 0x242F3D)          // --polje
    static let text = Color(hex: 0xF5F7FA)           // --tekst
    static let muted = Color(hex: 0x8FA3B8)          // --blago
    static let accent = Color(hex: 0x3390EC)         // --akcent
    static let accentLight = Color(hex: 0x6AB3F3)    // --akcent2
    static let line = Color.white.opacity(0.07)      // --linija

    // Potera igra
    static let gold = Color(hex: 0xFFC93C)           // --istaknuto
    static let neon = Color(hex: 0x5CC8FF)           // --neon
    static let showBlue1 = Color(hex: 0x1A4FC4)      // --pt1
    static let showBlue2 = Color(hex: 0x0A2470)      // --pt2
    static let showBlue3 = Color(hex: 0x04113D)      // --pt3
    static let panel = Color(hex: 0x061440)          // --panel
    static let correct = Color(hex: 0x2FBF5B)        // --dobro
    static let correctText = Color(hex: 0x5CE68A)
    static let wrong = Color(hex: 0xE53935)          // --lose
    static let wrongText = Color(hex: 0xFF6B61)
    static let urgent = Color(hex: 0xFF5A4F)

    /// Telegram mehurić: tri zaobljena ugla i oštriji donji levi.
    static let bubble = UnevenRoundedRectangle(
        topLeadingRadius: 14, bottomLeadingRadius: 4, bottomTrailingRadius: 14, topTrailingRadius: 14, style: .continuous
    )
    static let radius: CGFloat = 14

    /// Na iPadu sadržaj ne sme da se razvuče preko celog ekrana.
    static let maxFormWidth: CGFloat = 560
    static let maxGameWidth: CGFloat = 820
    /// Razmak sadržaja od ivice ekrana u sobi.
    static let screenMargin: CGFloat = 16

    /// Kondenzovani masni font za brojeve, kod sobe i naslove igre (na sajtu Roboto Condensed).
    static func display(_ style: Font.TextStyle, weight: Font.Weight = .heavy) -> Font {
        .system(style).weight(weight).width(.condensed)
    }

    /// Ista porodica, fiksne veličine – za ukrasne elemente (kod sobe, veliki brojevi).
    static func display(size: CGFloat, weight: Font.Weight = .heavy) -> Font {
        .system(size: size, weight: weight).width(.condensed)
    }
}

extension View {
    /// Kartica = Telegram mehurić (dolazna poruka).
    func card(padding: CGFloat = 16) -> some View {
        self.padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.card, in: Theme.bubble)
            .shadow(color: .black.opacity(0.35), radius: 1, y: 1)
    }

    /// Zlatni sjaj (kod sobe, poeni, broj sekundi).
    func goldGlow(radius: CGFloat = 9) -> some View {
        foregroundStyle(Theme.gold)
            .shadow(color: Theme.gold.opacity(0.5), radius: radius)
    }

    /// Neonski sjaj naslova igre.
    func neonGlow(radius: CGFloat = 10) -> some View {
        shadow(color: Theme.neon.opacity(0.6), radius: radius)
    }
}

/// Mali natpis odeljka (velika slova, svetloplavo), kao `.odeljak` na sajtu.
struct SectionLabel: View {
    @Environment(\.sr) private var sr
    let text: String
    var alignment: Alignment = .leading

    init(_ text: String, alignment: Alignment = .leading) {
        self.text = text
        self.alignment = alignment
    }

    var body: some View {
        Text(sr(text).uppercased())
            .font(.caption.weight(.bold))
            .tracking(1)
            .foregroundStyle(Theme.accentLight)
            .frame(maxWidth: .infinity, alignment: alignment)
    }
}

/// Glavna dugmad. `.primary` (plavo), `.go` (zeleno, „Pokreni“), `.secondary` (sivo).
struct SkvizButtonStyle: ButtonStyle {
    enum Kind { case primary, go, secondary }

    let kind: Kind
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .frame(maxWidth: .infinity, minHeight: 52)
            .padding(.horizontal, 16)
            .foregroundStyle(kind == .secondary ? Theme.accentLight : .white)
            .background(background, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
            .opacity(isEnabled ? 1 : 0.45)
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }

    private var background: Color {
        switch kind {
        case .primary: Theme.accent
        case .go: Theme.correct
        case .secondary: Theme.field
        }
    }
}

extension ButtonStyle where Self == SkvizButtonStyle {
    static var primary: SkvizButtonStyle { SkvizButtonStyle(kind: .primary) }
    static var go: SkvizButtonStyle { SkvizButtonStyle(kind: .go) }
    static var secondary: SkvizButtonStyle { SkvizButtonStyle(kind: .secondary) }
}
