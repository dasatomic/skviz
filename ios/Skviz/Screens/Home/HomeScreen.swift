import SwiftUI

/// Početni ekran: logo, ime i avatar, nova soba ili ulazak kodom.
struct HomeScreen: View {
    @Environment(\.sr) private var sr
    @EnvironmentObject private var navigation: AppNavigation
    @EnvironmentObject private var player: PlayerDataStore
    @EnvironmentObject private var room: RoomDataStore
    @EnvironmentObject private var settings: SettingsDataStore

    @State private var roomCode = ""
    @State private var isShowingIntro = false
    /// Položaj logoa u odnosu na vrh vidljivog dela ScrollView-a: 0 kad sadržaj nije odskrolovan,
    /// negativan kad jeste. Merenje ne zavisi od toga gde je ekran bio pri prvom prikazu.
    @State private var headerY: CGFloat = 0
    @FocusState private var focusedField: Field?

    private enum Field { case name, code }

    /// Slova koja se pojavljuju u kodovima soba (server koristi ABCDEFGHJKLMNPRSTUVZ).
    private static let cyrillicToLatin: [Character: String] = [
        "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E", "Ф": "F", "Х": "H", "Ј": "J", "К": "K",
        "Л": "L", "М": "M", "Н": "N", "П": "P", "Р": "R", "С": "S", "Т": "T", "У": "U", "З": "Z", "И": "I", "О": "O",
    ]

    private var nameIsValid: Bool { !player.profile.trimmedName.isEmpty }
    private var codeIsValid: Bool { roomCode.count == 4 }

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                header

                VStack(alignment: .leading, spacing: 14) {
                    SectionLabel("Kako se zoveš?")
                    TextField("", text: Binding(get: { player.profile.name }, set: player.setName),
                              prompt: Text(sr("Tvoje ime")).foregroundStyle(Color(hex: 0x6D7F92)))
                        .font(.title3.weight(.medium))
                        .textContentType(.givenName)
                        .submitLabel(.done)
                        .focused($focusedField, equals: .name)
                        .padding(14)
                        .background(Theme.field, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                        .overlay {
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .stroke(focusedField == .name ? Theme.accent : .clear, lineWidth: 2)
                        }
                    AvatarPicker(selected: player.profile.avatar, onSelect: player.setAvatar)
                }
                .card()

                Button {
                    Task { await create() }
                } label: {
                    Label(sr("Napravi sobu"), systemImage: "plus.circle.fill")
                }
                .buttonStyle(.primary)
                .disabled(!nameIsValid || room.isJoining)

                VStack(alignment: .leading, spacing: 14) {
                    SectionLabel("Imaš kod sobe?")
                    HStack(spacing: 10) {
                        TextField("", text: $roomCode, prompt: Text(verbatim: "KOD").foregroundStyle(Color(hex: 0x6D7F92)))
                            .textInputAutocapitalization(.characters)
                            .autocorrectionDisabled()
                            .multilineTextAlignment(.center)
                            .font(Theme.display(size: 30, weight: .bold))
                            .tracking(8)
                            .focused($focusedField, equals: .code)
                            .onChange(of: roomCode) { _, value in
                                // Nalepljena cela poruka ili link („…собу: GCTU – https://skviz.rs/?soba=GCTU“) → samo kod.
                                if value.count > 4, let code = RoomLink.code(fromText: value) {
                                    roomCode = code
                                    return
                                }
                                // Kod je uvek latinicom; ukucan ćirilicom (ЗГЛА) postaje ZGLA, kao `kodSobe` na sajtu.
                                let latin = value.uppercased().map { Self.cyrillicToLatin[$0] ?? String($0) }.joined()
                                let cleaned = String(latin.filter { $0.isASCII && $0.isLetter }.prefix(4))
                                if cleaned != value { roomCode = cleaned }
                            }
                            .padding(.vertical, 10)
                            .background(Theme.field, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                            .overlay {
                                RoundedRectangle(cornerRadius: 12, style: .continuous)
                                    .stroke(focusedField == .code ? Theme.accent : .clear, lineWidth: 2)
                            }
                        Button(sr("Uđi")) {
                            Task { await join() }
                        }
                        .buttonStyle(.go)
                        .frame(width: 96)
                        .disabled(!nameIsValid || !codeIsValid || room.isJoining)
                    }
                    if !nameIsValid && (codeIsValid || focusedField == .code) {
                        Text(sr("Prvo upiši svoje ime."))
                            .font(.footnote)
                            .foregroundStyle(Theme.gold)
                    }
                }
                .card()

                if room.isJoining {
                    ProgressView().tint(Theme.neon)
                }

                VStack(spacing: 10) {
                    SectionLabel("Pismo", alignment: .center)
                    ScriptPicker().frame(maxWidth: 280)
                    Button {
                        isShowingIntro = true
                    } label: {
                        Label(sr("Šta je Skviz?"), systemImage: "questionmark.circle")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(Theme.accentLight)
                    }
                    .padding(.top, 6)
                }
                .padding(.top, 4)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 24)
        }
        .scrollDismissesKeyboard(.interactively)
        .screenBackground()
        .overlay(alignment: .top) { compactHeader }
        .toolbar(.hidden, for: .navigationBar)
        .forwardsError(room.error) { room.clearError() }
        .sheet(isPresented: $isShowingIntro) {
            OnboardingScreen { isShowingIntro = false }
                .environment(\.sr, sr)
                .scrollIndicators(.hidden)
                .presentationDragIndicator(.visible)
        }
        // Poziv u sobu: https://skviz.rs/?soba=ABCD (Universal Link) ili skviz://soba/ABCD.
        // Početni ekran ostaje živ ispod sobe, pa link stiže i dok je igrač u drugoj sobi.
        .onOpenURL { url in
            guard let code = RoomLink.code(from: url), code != room.code else { return }
            Task {
                if room.code != nil {
                    await room.leave()
                }
                navigation.popToRoot()
                room.invite(code: code)
            }
        }
        .onChange(of: room.invitedCode) { _, code in
            if code != nil { Task { await acceptInvite() } }
        }
        .task { await acceptInvite() }
    }

    /// Ulazi u sobu iz linka. Bez imena samo upiše kod i traži ime, pa igrač pritisne „Uđi“.
    private func acceptInvite() async {
        guard let code = room.invitedCode else { return }
        room.consumeInvite()
        roomCode = code
        if nameIsValid {
            await join()
        } else {
            focusedField = .name
        }
    }

    private var header: some View {
        VStack(spacing: 4) {
            Image("Logo")
                .resizable()
                .scaledToFit()
                .frame(maxWidth: 240)
                .shadow(color: Theme.neon.opacity(0.35), radius: 20)
                .accessibilityLabel(sr("Skviz"))
                // Pri skrolovanju veliki logo bledi i smanjuje se, a mali se pojavljuje u zaglavlju.
                .scaleEffect(1 - 0.25 * logoProgress, anchor: .top)
                .opacity(1 - logoProgress)
            Text(sr("Kviz znanja za celu porodicu"))
                .foregroundStyle(Theme.muted)
                .opacity(1 - logoProgress)
        }
        .padding(.top, 20)
        // Koliko je sadržaj odskrolovan: položaj logoa u odnosu na vrh ScrollView-a.
        .onGeometryChange(for: CGFloat.self) { proxy in
            proxy.frame(in: .scrollView).minY
        } action: { minY in
            // Zaokruženo na ceo poen, da se ekran ne crta ponovo zbog delića poena.
            let rounded = minY.rounded()
            if rounded != headerY { headerY = rounded }
        }
    }

    /// 0 = veliki logo na vrhu, 1 = logo je prešao u zaglavlje.
    /// Počinje da bledi posle 10 pt skrolovanja, a u zaglavlju je ceo posle još 70 pt.
    private var logoProgress: CGFloat {
        min(1, max(0, (-headerY - 10) / 70))
    }

    /// Zaglavlje sa malim logom: vidi se kad veliki logo odskroluje (kao veliki naslov u iOS-u).
    private var compactHeader: some View {
        Image("Logo")
            .resizable()
            .scaledToFit()
            .frame(height: 30)
            .shadow(color: Theme.neon.opacity(0.35), radius: 8)
            .scaleEffect(0.85 + 0.15 * logoProgress)
            .offset(y: 6 * (1 - logoProgress))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background {
                Rectangle()
                    .fill(.ultraThinMaterial)
                    .overlay { Theme.background2.opacity(0.75) }
                    .overlay(alignment: .bottom) { Rectangle().fill(.black.opacity(0.4)).frame(height: 0.5) }
                    .ignoresSafeArea(edges: .top)
            }
            .opacity(logoProgress)
            // Ukras; dodiri prolaze do sadržaja ispod, a VoiceOver ga ne čita dva puta.
            .allowsHitTesting(false)
            .accessibilityHidden(true)
    }

    private func create() async {
        focusedField = nil
        if await room.create(profile: player.profile, script: settings.script), let code = room.code {
            navigation.push(.room(code: code))
        }
    }

    private func join() async {
        focusedField = nil
        if await room.join(code: roomCode, profile: player.profile), let code = room.code {
            roomCode = ""
            navigation.push(.room(code: code))
        }
    }
}

#if DEBUG
#Preview("Početni ekran") {
    NavigationStack {
        HomeScreen()
    }
    .environmentObject(AppNavigation())
    .environmentObject(PlayerDataStore(defaults: UserDefaults(suiteName: "preview") ?? .standard))
    .environmentObject(RoomDataStore(service: MockGameService(), playerId: "preview-igrac"))
    .environmentObject(SettingsDataStore(service: MockGameService(), defaults: UserDefaults(suiteName: "preview") ?? .standard))
    .environmentObject(QuizCatalogDataStore(service: MockGameService()))
    .environmentObject(ErrorCenter())
    .environment(\.sr, SettingsDataStore(service: MockGameService()).converter(for: .cirilica))
    .preferredColorScheme(.dark)
}
#endif
