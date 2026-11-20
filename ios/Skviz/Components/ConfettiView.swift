import SwiftUI

/// Konfete za kraj partije (kao `#konfete` na sajtu). Padaju nekoliko sekundi i nestanu; ne primaju dodire.
struct ConfettiView: View {
    private struct Piece {
        let x: Double
        let delay: Double
        let speed: Double
        let sway: Double
        let spin: Double
        let size: CGSize
        let color: Color
    }

    private let duration: Double = 5
    private let pieces: [Piece]
    @State private var start = Date()
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    init(count: Int = 90) {
        let colors = [Theme.gold, Theme.neon, Theme.correct, Color(hex: 0xFF7675), Color(hex: 0xA29BFE), Color(hex: 0xFD79A8)]
        pieces = (0..<count).map { index in
            Piece(
                x: .random(in: 0...1),
                delay: .random(in: 0...1.2),
                speed: .random(in: 0.25...0.45),
                sway: .random(in: 10...40),
                spin: .random(in: 2...8),
                size: CGSize(width: .random(in: 6...11), height: .random(in: 10...16)),
                color: colors[index % colors.count]
            )
        }
    }

    var body: some View {
        if !reduceMotion {
            TimelineView(.animation) { timeline in
                let elapsed = timeline.date.timeIntervalSince(start)
                Canvas { context, size in
                    guard elapsed < duration + 1.5 else { return }
                    for piece in pieces {
                        let t = elapsed - piece.delay
                        guard t > 0 else { continue }
                        let y = -20 + t * piece.speed * size.height
                        guard y < size.height + 20 else { continue }
                        let x = piece.x * size.width + sin(t * 3 + piece.x * 10) * piece.sway
                        var copy = context
                        copy.translateBy(x: x, y: y)
                        copy.rotate(by: .radians(t * piece.spin))
                        copy.opacity = min(1, max(0, duration + 1 - elapsed))
                        let rect = CGRect(origin: CGPoint(x: -piece.size.width / 2, y: -piece.size.height / 2), size: piece.size)
                        copy.fill(Path(roundedRect: rect, cornerRadius: 2), with: .color(piece.color))
                    }
                }
            }
            .allowsHitTesting(false)
            .accessibilityHidden(true)
            .ignoresSafeArea()
        }
    }
}

#if DEBUG
#Preview {
    ConfettiView().screenBackground()
}
#endif
