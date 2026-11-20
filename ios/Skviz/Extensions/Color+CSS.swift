import SwiftUI

extension Color {
    init(hex: UInt32) {
        self.init(
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255
        )
    }

    /// Boja u CSS zapisu koji šalje server: `#ff7675`, `#fff` ili `hsl(157 65% 68%)` (boje igrača, kvizova).
    /// Nepoznat zapis daje `nil`, pa ekran bira podrazumevanu boju.
    init?(css: String?) {
        guard let value = css?.trimmingCharacters(in: .whitespaces).lowercased(), !value.isEmpty else { return nil }

        if value.hasPrefix("#") {
            var digits = String(value.dropFirst())
            if digits.count == 3 {
                digits = digits.map { "\($0)\($0)" }.joined()
            }
            guard digits.count == 6, let number = UInt32(digits, radix: 16) else { return nil }
            self.init(hex: number)
            return
        }

        if value.hasPrefix("hsl(") {
            let numbers = value.dropFirst(4).dropLast()
                .split(whereSeparator: { " ,%".contains($0) })
                .compactMap { Double($0) }
            guard numbers.count >= 3 else { return nil }
            // HSL → HSB (SwiftUI nema HSL)
            let hue = numbers[0].truncatingRemainder(dividingBy: 360) / 360
            let saturation = numbers[1] / 100
            let lightness = numbers[2] / 100
            let brightness = lightness + saturation * min(lightness, 1 - lightness)
            let hsbSaturation = brightness == 0 ? 0 : 2 * (1 - lightness / brightness)
            self.init(hue: hue, saturation: hsbSaturation, brightness: brightness)
            return
        }
        return nil
    }
}
