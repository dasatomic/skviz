import SwiftUI

/// Sjajna „Potera“ pilula: odgovori, redovi tabele, slova. Ton određuje boju preliva i okvira.
enum PillTone: Equatable {
    case blue
    /// Izabran odgovor, pre otkrivanja.
    case chosen
    case correct
    case wrong
    /// Prvo mesto na tabli.
    case gold
    /// Odgovor koji nije izabran (zaključano) ili nije tačan (otkriveno).
    case dimmed

    fileprivate var stops: [Gradient.Stop] {
        let colors: [UInt32] = switch self {
        case .blue, .dimmed, .gold: [0x1A4FC4, 0x0A2470, 0x04113D, 0x071A5A]
        case .chosen: [0xFFB238, 0xF08A00, 0xC96A00, 0xE07C00]
        case .correct: [0x4EE07A, 0x1FA847, 0x128336, 0x1C9A40]
        case .wrong: [0xFF5A4F, 0xD32F2F, 0xA51C1C, 0xC62828]
        }
        // Oštar prelaz na sredini daje „staklen“ sjaj kao na sajtu.
        return zip(colors, [0, 0.48, 0.52, 1]).map { Gradient.Stop(color: Color(hex: $0), location: $1) }
    }

    fileprivate var border: Color {
        switch self {
        case .blue, .dimmed: Theme.neon
        case .chosen: Color(hex: 0xFFE08A)
        case .correct: Color(hex: 0xB6FFC9)
        case .wrong: Color(hex: 0xFFB3AD)
        case .gold: Theme.gold
        }
    }

    fileprivate var glow: Color {
        switch self {
        case .blue, .dimmed: Theme.neon.opacity(0.35)
        case .chosen: Color(hex: 0xFFB238).opacity(0.6)
        case .correct: Theme.correct.opacity(0.8)
        case .wrong: Theme.wrong.opacity(0.6)
        case .gold: Theme.gold.opacity(0.55)
        }
    }
}

struct PillBackground: View {
    let tone: PillTone
    /// `nil` = kapsula; broj = zaobljen pravougaonik (dvokolonski odgovori na iPadu).
    var cornerRadius: CGFloat?

    var body: some View {
        let shape = RoundedRectangle(cornerRadius: cornerRadius ?? 999, style: .continuous)
        shape
            .fill(LinearGradient(stops: tone.stops, startPoint: .top, endPoint: .bottom))
            .overlay {
                // gornji odsjaj
                shape
                    .inset(by: 2)
                    .stroke(LinearGradient(colors: [.white.opacity(0.4), .clear], startPoint: .top, endPoint: .center), lineWidth: 1)
            }
            .overlay { shape.stroke(tone.border, lineWidth: 2) }
            .shadow(color: tone.glow, radius: tone == .correct || tone == .gold ? 12 : 6)
            .saturation(tone == .dimmed ? 0.5 : 1)
    }
}

/// Panel pitanja: tamnoplavi preliv sa neonskim okvirom.
struct QuestionPanel<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        let shape = RoundedRectangle(cornerRadius: 18, style: .continuous)
        content
            .multilineTextAlignment(.center)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 18)
            .padding(.horizontal, 20)
            .background {
                shape.fill(LinearGradient(
                    stops: [
                        .init(color: Color(hex: 0x0D2A7A), location: 0),
                        .init(color: Theme.panel, location: 0.55),
                        .init(color: Color(hex: 0x020A26), location: 1),
                    ],
                    startPoint: .top, endPoint: .bottom
                ))
            }
            .overlay { shape.stroke(Theme.neon, lineWidth: 2) }
            .shadow(color: Theme.neon.opacity(0.4), radius: 10)
    }
}

#if DEBUG
#Preview {
    VStack(spacing: 12) {
        QuestionPanel { Text("Koja planeta je najbliža Suncu?").font(.title3.bold()) }
        ForEach([PillTone.blue, .chosen, .correct, .wrong, .gold, .dimmed], id: \.self) { tone in
            Text("\(String(describing: tone))")
                .bold()
                .frame(maxWidth: .infinity, minHeight: 54)
                .background { PillBackground(tone: tone) }
                .opacity(tone == .dimmed ? 0.4 : 1)
        }
    }
    .padding()
    .screenBackground()
    .preferredColorScheme(.dark)
}
#endif
