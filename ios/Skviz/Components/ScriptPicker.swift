import SwiftUI

/// Izbor pisma uređaja: Ћирилица | Latinica. Svako dugme je napisano svojim pismom.
struct ScriptPicker: View {
    @EnvironmentObject private var settings: SettingsDataStore

    var body: some View {
        HStack(spacing: 6) {
            ForEach(Script.allCases, id: \.self) { script in
                let isSelected = settings.script == script
                Button {
                    withAnimation(.easeOut(duration: 0.2)) { settings.setScript(script) }
                } label: {
                    Text(verbatim: script.title)
                        .font(.subheadline.weight(.semibold))
                        .frame(maxWidth: .infinity, minHeight: 34)
                        .foregroundStyle(isSelected ? .white : Theme.accentLight)
                        .background(isSelected ? Theme.accent : .clear, in: Capsule())
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(isSelected ? .isSelected : [])
            }
        }
        .padding(4)
        .background(Theme.field, in: Capsule())
        .sensoryFeedback(.selection, trigger: settings.script)
    }
}

#if DEBUG
#Preview {
    ScriptPicker()
        .padding()
        .screenBackground()
        .environmentObject(SettingsDataStore(service: MockGameService(), defaults: UserDefaults(suiteName: "preview") ?? .standard))
        .preferredColorScheme(.dark)
}
#endif
