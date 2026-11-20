import SwiftUI

/// Avatari sa sajta u okruglim dugmićima; izabrani je plav i malo veći.
struct AvatarPicker: View {
    let selected: String
    let onSelect: (String) -> Void

    // Šest u redu: krug je dovoljno veći od emojija i lak za tap.
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 10), count: 6)

    var body: some View {
        LazyVGrid(columns: columns, spacing: 10) {
            ForEach(PlayerProfile.avatars, id: \.self) { avatar in
                let isSelected = avatar == selected
                Button {
                    onSelect(avatar)
                } label: {
                    // Krug zauzima celu širinu ćelije (na iPadu najviše 60 pt), emoji je u sredini.
                    Circle()
                        .fill(isSelected ? Theme.accent : Theme.field)
                        .aspectRatio(1, contentMode: .fit)
                        .frame(maxWidth: 60)
                        .overlay { Text(avatar).font(.title) }
                        .overlay { Circle().stroke(Theme.accent.opacity(isSelected ? 0.35 : 0), lineWidth: 3).padding(-3) }
                        .scaleEffect(isSelected ? 1.1 : 1)
                        .animation(.spring(duration: 0.25), value: isSelected)
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(isSelected ? .isSelected : [])
            }
        }
        .sensoryFeedback(.selection, trigger: selected)
    }
}

#if DEBUG
#Preview {
    AvatarPicker(selected: "🦊") { _ in }
        .card()
        .padding()
        .screenBackground()
        .preferredColorScheme(.dark)
}
#endif
