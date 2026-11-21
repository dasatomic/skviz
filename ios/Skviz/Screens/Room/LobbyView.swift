import SwiftUI

/// Lobi: kod sobe, igrači i – za vođu – izbor kviza, podešavanja i „Pokreni“.
struct LobbyView: View {
    @Environment(\.sr) private var sr
    let state: RoomState

    @EnvironmentObject private var room: RoomDataStore
    @EnvironmentObject private var catalog: QuizCatalogDataStore
    @State private var isPickingQuiz = false
    @State private var isStarting = false

    private static let questionCounts = [5, 10, 15, 20, 25]
    private static let timeLimits = [10, 15, 20, 30, 45, 60]

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                roomCode
                players
                if state.isHost {
                    hostSettings
                } else {
                    waiting
                }
            }
            .padding(.bottom, 24)
        }
        .task {
            if catalog.quizzes.isEmpty { await catalog.load() }
        }
        .sheet(isPresented: $isPickingQuiz) {
            QuizPickerView(selectedId: state.podesavanja.kviz) { choice in
                isPickingQuiz = false
                Task { await room.send(.updateSettings(SettingsPatch(kviz: choice.id))) }
            }
            // Standardni iOS list: pola ekrana, povlači se do vrha, ručica za povlačenje.
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
            .environment(\.sr, sr)
            .scrollIndicators(.hidden)
        }
    }

    private var roomCode: some View {
        VStack(spacing: 6) {
            SectionLabel("Kod sobe", alignment: .center)
            Text(state.kod)
                .font(Theme.display(size: 56))
                .tracking(10)
                .goldGlow(radius: 14)
                .textSelection(.enabled)
                .accessibilityLabel(sr("Kod sobe") + " " + state.kod.map(String.init).joined(separator: " "))
            // Adresa i kod sobe ostaju latinicom (na sajtu `.adresa` i `.kod-sobe`).
            (Text(sr("Ostali ulaze u aplikaciji ili na ")) + Text(verbatim: "skviz.rs"))
                .font(.footnote)
                .foregroundStyle(Theme.accentLight)
            // Link sa kodom: otvara aplikaciju (ako je instalirana) ili sajt sa već upisanim kodom.
            ShareLink(item: sr("Uđi u moju Skviz sobu: ") + "\(state.kod)\n\(RoomLink.url(for: state.kod).absoluteString)") {
                Label(sr("Pozovi"), systemImage: "square.and.arrow.up")
                    .font(.subheadline.weight(.semibold))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Theme.field, in: Capsule())
            }
            .padding(.top, 4)
        }
        .frame(maxWidth: .infinity)
        .card(padding: 18)
    }

    private var players: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionLabel("Igrači · \(state.igraci.count)")
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 82), spacing: 8)], spacing: 16) {
                ForEach(state.igraci) { player in
                    PlayerTile(player: player, isHost: player.id == state.domacin, isMe: player.id == state.ja)
                        .transition(.scale.combined(with: .opacity))
                }
            }
            .padding(.top, 8)
            .animation(.spring(duration: 0.4), value: state.igraci.map(\.id))
        }
        .card()
    }

    private var waiting: some View {
        VStack(spacing: 10) {
            WaitingDots()
            Text(sr("Čekamo da vođa pokrene igru"))
                .foregroundStyle(Theme.muted)
            if !catalog.quizzes.isEmpty {
                Text(sr("\(catalog.title(for: state.podesavanja.kviz)) · \(state.podesavanja.brojPitanja) pitanja"))
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(Theme.accentLight)
            }
        }
        .padding(.top, 12)
    }

    private var hostSettings: some View {
        VStack(spacing: 14) {
            Button {
                isPickingQuiz = true
            } label: {
                HStack(spacing: 12) {
                    QuizIcon(icon: choice?.icon ?? "🌍", color: choice?.color)
                    VStack(alignment: .leading, spacing: 2) {
                        SectionLabel("Kviz")
                        Text(sr(catalog.title(for: state.podesavanja.kviz)))
                            .font(.headline)
                            .foregroundStyle(Theme.text)
                            .multilineTextAlignment(.leading)
                        if let count = choice?.questionCount {
                            Text(sr("\(count) pitanja u bazi"))
                                .font(.caption)
                                .foregroundStyle(Theme.muted)
                        }
                    }
                    Spacer()
                    Text(sr("Promeni"))
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(Theme.accentLight)
                }
                .card()
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 10) {
                SectionLabel("Broj pitanja")
                ChipPicker(values: Self.questionCounts, selected: state.podesavanja.brojPitanja, label: { "\($0)" }) { value in
                    Task { await room.send(.updateSettings(SettingsPatch(brojPitanja: value))) }
                }
                SectionLabel("Vreme za odgovor").padding(.top, 6)
                ChipPicker(values: Self.timeLimits, selected: state.podesavanja.vreme, label: { "\($0) s" }) { value in
                    Task { await room.send(.updateSettings(SettingsPatch(vreme: value))) }
                }
                // Pismo sobe važi za sve igrače u njoj, i u aplikaciji i na sajtu.
                SectionLabel("Pismo").padding(.top, 6)
                HStack(spacing: 8) {
                    ForEach(Script.allCases, id: \.self) { script in
                        let isSelected = Script(server: state.podesavanja.pismo) == script
                        Button {
                            Task { await room.send(.updateSettings(SettingsPatch(pismo: script.rawValue))) }
                        } label: {
                            Text(verbatim: script.title)
                                .font(.subheadline.weight(.semibold))
                                .frame(maxWidth: .infinity, minHeight: 36)
                                .foregroundStyle(isSelected ? .white : Theme.text)
                                .background(isSelected ? Theme.accent : Theme.field, in: Capsule())
                        }
                        .buttonStyle(.plain)
                        .accessibilityAddTraits(isSelected ? .isSelected : [])
                    }
                }
            }
            .card()

            Button {
                isStarting = true
                Task {
                    await room.start()
                    isStarting = false
                }
            } label: {
                Label(sr("Pokreni"), systemImage: "play.fill")
            }
            .buttonStyle(.go)
            .disabled(isStarting)
            .sensoryFeedback(.impact(weight: .medium), trigger: isStarting) { _, new in new }
        }
    }

    private var choice: QuizSection.Choice? {
        catalog.sections.lazy.flatMap(\.choices).first { $0.id == state.podesavanja.kviz }
    }
}

/// Izbor jedne vrednosti od nekoliko (broj pitanja, vreme) – čipovi umesto menija, lakše za decu.
struct ChipPicker: View {
    let values: [Int]
    let selected: Int
    let label: (Int) -> String
    let onSelect: (Int) -> Void

    var body: some View {
        HStack(spacing: 8) {
            ForEach(values, id: \.self) { value in
                let isSelected = value == selected
                Button {
                    onSelect(value)
                } label: {
                    Text(label(value))
                        .font(.subheadline.weight(.semibold))
                        .monospacedDigit()
                        .frame(maxWidth: .infinity, minHeight: 36)
                        .foregroundStyle(isSelected ? .white : Theme.text)
                        .background(isSelected ? Theme.accent : Theme.field, in: Capsule())
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(isSelected ? .isSelected : [])
            }
        }
        .sensoryFeedback(.selection, trigger: selected)
    }
}

/// Ikona kviza u krugu u boji kviza (kao `.kviz .ik` na sajtu).
struct QuizIcon: View {
    let icon: String
    let color: String?
    var size: CGFloat = 46

    var body: some View {
        Text(icon)
            .font(.system(size: size * 0.5))
            .frame(width: size, height: size)
            .background((Color(css: color) ?? Theme.cardSelected).opacity(0.85), in: Circle())
    }
}

/// Tri tačke koje pulsiraju dok se čeka vođa.
struct WaitingDots: View {
    var body: some View {
        HStack(spacing: 8) {
            ForEach(0..<3) { index in
                Circle()
                    .fill(Theme.neon)
                    .frame(width: 10, height: 10)
                    .phaseAnimator([0.3, 1]) { dot, opacity in
                        dot.opacity(opacity)
                    } animation: { _ in .easeInOut(duration: 0.6).delay(Double(index) * 0.2) }
            }
        }
        .accessibilityHidden(true)
    }
}

#if DEBUG
#Preview("Vođa") {
    LobbyView(state: .preview(.lobi))
        .padding(.horizontal)
        .screenBackground()
        .environmentObject(RoomDataStore(service: MockGameService(), playerId: "preview-igrac"))
        .environmentObject(QuizCatalogDataStore(service: MockGameService()))
        .preferredColorScheme(.dark)
}

#Preview("Igrač") {
    LobbyView(state: .preview(.lobi, isHost: false))
        .padding(.horizontal)
        .screenBackground()
        .environmentObject(RoomDataStore(service: MockGameService(), playerId: "preview-igrac"))
        .environmentObject(QuizCatalogDataStore(service: MockGameService()))
        .preferredColorScheme(.dark)
}
#endif
