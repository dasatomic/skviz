import SwiftUI

/// Soba u pismu koje je izabrao vođa (`podesavanja.pismo`); van sobe važi pismo uređaja.
struct RoomScreen: View {
    let code: String

    @EnvironmentObject private var room: RoomDataStore
    @EnvironmentObject private var settings: SettingsDataStore

    var body: some View {
        RoomContent(code: code)
            .environment(\.sr, settings.converter(for: room.state.map { Script(server: $0.podesavanja.pismo) }))
    }
}

/// Soba: prikaz bira faza koju šalje server (lobi → uvod → pitanje/otkrivanje ×N → tabela → kraj).
private struct RoomContent: View {
    @Environment(\.sr) private var sr
    let code: String

    @EnvironmentObject private var navigation: AppNavigation
    @EnvironmentObject private var room: RoomDataStore
    @State private var isConfirmingLeave = false

    var body: some View {
        content
            .padding(.top, 8)
            .screenBackground(maxWidth: Theme.maxGameWidth)
            .navigationBarBackButtonHidden()
            .navigationBarTitleDisplayMode(.inline)
            // Gornja traka = zaglavlje Telegram razgovora.
            .toolbarBackground(Theme.background2.opacity(0.92), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button {
                        isConfirmingLeave = true
                    } label: {
                        Image(systemName: "xmark")
                            .font(.body.weight(.semibold))
                            .foregroundStyle(Theme.muted)
                    }
                    .accessibilityLabel(sr("Izađi iz sobe"))
                }
                ToolbarItem(placement: .principal) {
                    HStack(spacing: 6) {
                        Text(sr("Soba")).foregroundStyle(Theme.muted)
                        Text(code)
                            .font(Theme.display(.headline))
                            .tracking(2)
                            .foregroundStyle(Theme.gold)
                    }
                    .accessibilityElement(children: .combine)
                }
                if let state = room.state, state.isHost {
                    ToolbarItem(placement: .topBarTrailing) {
                        // Bez sopstvene kapsule: na iOS 26 traka ga već stavlja u „liquid glass“ kapsulu.
                        Text(sr("👑 vođa"))
                            .font(.caption.weight(.semibold))
                            .padding(.horizontal, 4)
                    }
                }
            }
            .confirmationDialog(sr("Izađi iz sobe?"), isPresented: $isConfirmingLeave, titleVisibility: .visible) {
                Button(sr("Izađi"), role: .destructive) {
                    Task { await leave() }
                }
            } message: {
                Text(sr("Ostali nastavljaju igru bez tebe."))
            }
            // Praćenje stanja traje dok je ekran prikazan; `.task` ga otkazuje pri izlasku.
            .task(id: code) { await room.observe() }
            .forwardsError(room.error) { room.clearError() }
    }

    @ViewBuilder
    private var content: some View {
        if room.isClosed {
            ContentUnavailableView {
                Label(sr("Soba je zatvorena"), systemImage: "door.left.hand.closed")
            } description: {
                Text(sr("Soba više ne postoji. Napravi novu ili uđi u drugu."))
            } actions: {
                Button(sr("Nazad na početak")) { Task { await leave() } }
                    .buttonStyle(.primary)
                    .frame(maxWidth: 260)
            }
            .padding(.horizontal, Theme.screenMargin)
        } else if let state = room.state {
            phaseView(state)
                .id(state.faza.rawValue)
                .transition(.asymmetric(insertion: .opacity.combined(with: .move(edge: .trailing)), removal: .opacity))
                .animation(.easeOut(duration: 0.3), value: state.faza)
        } else {
            VStack(spacing: 12) {
                ProgressView().tint(Theme.neon)
                Text(sr("Povezivanje…")).foregroundStyle(Theme.muted)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    @ViewBuilder
    private func phaseView(_ state: RoomState) -> some View {
        let next = { Task { await room.send(.next(phase: state.faza.rawValue)) } }
        switch state.faza {
        case .lobi:
            LobbyView(state: state)
                .scrollMargins()
        case .uvod:
            IntroView(state: state, serverNow: { room.serverNow })
                .padding(.horizontal, Theme.screenMargin)
        case .pitanje:
            QuestionView(state: state, serverNow: { room.serverNow }) { answer in
                Task { await room.send(.answer(answer)) }
            }
            .scrollMargins()
        case .otkrivanje:
            RevealView(state: state) { _ = next() }
                .scrollMargins()
        case .tabela:
            ScoreboardView(state: state) { _ = next() }
                .scrollMargins()
        case .kraj:
            FinalView(state: state) {
                Task { await room.send(.backToLobby) }
            }
            .padding(.horizontal, Theme.screenMargin)
        case .reci, .reciOtkrivanje, .unknown:
            UnsupportedPhaseView(isHost: state.isHost) { _ = next() }
                .padding(.horizontal, Theme.screenMargin)
        }
    }

    private func leave() async {
        await room.leave()
        navigation.popToRoot()
    }
}

#if DEBUG
#Preview("Pitanje") {
    NavigationStack {
        RoomScreen(code: "KVIZ")
    }
    .environmentObject(AppNavigation())
    .environmentObject(SettingsDataStore(service: MockGameService()))
    .environmentObject(RoomDataStore(service: MockGameService(state: .preview(.pitanje)), playerId: "preview-igrac"))
    .environmentObject(QuizCatalogDataStore(service: MockGameService()))
    .environmentObject(ErrorCenter())
    .preferredColorScheme(.dark)
}

#Preview("Povezivanje") {
    NavigationStack {
        RoomScreen(code: "KVIZ")
    }
    .environmentObject(AppNavigation())
    .environmentObject(SettingsDataStore(service: MockGameService()))
    .environmentObject(RoomDataStore(service: MockGameService(), playerId: "preview-igrac"))
    .environmentObject(QuizCatalogDataStore(service: MockGameService()))
    .environmentObject(ErrorCenter())
    .preferredColorScheme(.dark)
}
#endif

extension View {
    /// Razmak od ivice ekrana za faze koje se skroluju: margina ide sadržaju, a ne `ScrollView`-u,
    /// da skrol ostane širok koliko ekran i ne seče sjaj i uvećanje kapsula.
    func scrollMargins() -> some View {
        contentMargins(.horizontal, Theme.screenMargin, for: .scrollContent)
    }
}
