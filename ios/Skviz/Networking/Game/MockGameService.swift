#if DEBUG
import Foundation

/// Mock za preview-e i rad bez servera. Uvek vraća isto stanje sobe; akcije ne menjaju ništa.
struct MockGameService: GameService {
    var state: RoomState = .preview(.lobi)
    var quizzes: [Quiz] = Quiz.previewList

    func fetchQuizzes() async throws -> [Quiz] { quizzes }

    func createRoom(playerId: String, profile: PlayerProfile, script: Script) async throws -> String { state.kod }

    func joinRoom(code: String, playerId: String, profile: PlayerProfile) async throws -> String { code }

    func fetchState(code: String, playerId: String, knownVersion: Int?) async throws -> RoomState {
        if knownVersion == state.verzija {
            // Kao pravi server: bez promene, zahtev čeka (ovde dok ga `.task` ne otkaže).
            try await Task.sleep(for: .seconds(3600))
        }
        return state
    }

    func send(_ action: RoomAction, code: String, playerId: String) async throws {}

    func fetchScriptRules() async throws -> String {
        throw NetworkError.noConnection
    }
}

extension Quiz {
    static let previewList: [Quiz] = [
        Quiz(id: "opste", naziv: "Opšte znanje", ikona: "🌍", boja: "#e17055", opis: nil, broj: 2208, oblast: nil, razred: nil, kategorija: nil, zadaci: nil),
        Quiz(id: "zabava", naziv: "Filmovi i igrice", ikona: "🎮", boja: nil, opis: nil, broj: 258, oblast: nil, razred: nil, kategorija: false, zadaci: false),
        Quiz(id: "biologija", naziv: "Biologija", ikona: "🧬", boja: nil, opis: nil, broj: 168, oblast: "biologija", razred: nil, kategorija: false, zadaci: false),
        Quiz(id: "razred5-biologija", naziv: "5. razred · Biologija", ikona: "🌱", boja: nil, opis: nil, broj: 626, oblast: "biologija", razred: 5, kategorija: false, zadaci: false),
    ]
}

extension RoomState {
    /// Stanje sobe sa četiri igrača u zadatoj fazi. Ovaj telefon je vođa.
    /// `matching: true` daje pitanje „spoji pojmove“ (u otkrivanju: jedan od tri para tačan).
    static func preview(_ phase: Phase, isHost: Bool = true, matching: Bool = false) -> RoomState {
        let players = [
            Player(id: "a1", ime: "Mila", avatar: "🦊", boja: "#ff7675", poeni: 1450, niz: 2, povezan: true),
            Player(id: "b2", ime: "Tata", avatar: "🐼", boja: "#74b9ff", poeni: 980, niz: 0, povezan: true),
            Player(id: "c3", ime: "Baka", avatar: "🦉", boja: "#55efc4", poeni: 620, niz: 1, povezan: true),
            Player(id: "d4", ime: "Luka", avatar: "🚀", boja: "hsl(157 65% 68%)", poeni: 300, niz: 0, povezan: false),
        ]
        let revealed = phase == .otkrivanje
        let question = matching
            ? Question(
                rb: 4, ukupno: 15,
                tekst: "Spoji naučnika sa onim što proučava",
                vrsta: "spoji",
                odgovori: nil,
                levo: ["Botaničar", "Zoolog", "Mikolog"],
                desno: ["gljive", "biljke", "životinje"],
                tezina: 1,
                oblast: Question.Area(naziv: "5. razred · Biologija", ikona: "🌱", boja: nil),
                jezik: nil,
                pocetak: 1_700_000_000_000, trajanje: 35_000,
                tacan: revealed ? .pairs([1, 2, 0]) : nil,
                zanimljivost: revealed ? "Mikrobiolozi proučavaju mikroorganizme, a ekolozi odnose živih bića i sredine." : nil,
                objasnjenje: nil
            )
            : Question(
                rb: 3, ukupno: 15,
                tekst: "Koja planeta je najbliža Suncu?",
                vrsta: "izbor",
                odgovori: ["Venera", "Merkur", "Mars", "Zemlja"],
                levo: nil, desno: nil,
                tezina: 1,
                oblast: Question.Area(naziv: "Geografija", ikona: "🌍", boja: "#00b894"),
                jezik: nil,
                pocetak: 1_700_000_000_000, trajanje: 20_000,
                tacan: revealed ? .index(1) : nil,
                zanimljivost: revealed ? "Iako je najbliži Suncu, Merkur nije najtoplija planeta – to je Venera, zbog guste atmosfere." : nil,
                objasnjenje: nil
            )
        let gains: [String: Gain] = matching
            ? [
                "a1": Gain(poeni: 230, bonus: 0, tacno: false, niz: 0, bez: nil, pogodjeno: 1, od: 3),
                "b2": Gain(poeni: 700, bonus: 0, tacno: true, niz: 1, bez: nil, pogodjeno: 3, od: 3),
                "c3": Gain(poeni: 0, bonus: 0, tacno: false, niz: 0, bez: nil, pogodjeno: 0, od: 3),
                "d4": Gain(poeni: 0, bonus: 0, tacno: false, niz: 0, bez: true, pogodjeno: nil, od: nil),
            ]
            : [
                "a1": Gain(poeni: 850, bonus: 100, tacno: true, niz: 3, bez: nil, pogodjeno: nil, od: nil),
                "b2": Gain(poeni: 0, bonus: 0, tacno: false, niz: 0, bez: nil, pogodjeno: nil, od: nil),
                "c3": Gain(poeni: 620, bonus: 0, tacno: true, niz: 1, bez: nil, pogodjeno: nil, od: nil),
                "d4": Gain(poeni: 0, bonus: 0, tacno: false, niz: 0, bez: true, pogodjeno: nil, od: nil),
            ]
        let ranks = [Rank(id: "a1", poeni: 1450), Rank(id: "b2", poeni: 980), Rank(id: "c3", poeni: 620), Rank(id: "d4", poeni: 300)]
        return RoomState(
            kod: "KVIZ", verzija: 7, faza: phase,
            domacin: isHost ? "a1" : "b2", ja: "a1",
            igraci: players,
            podesavanja: Settings(kviz: "opste", brojPitanja: 15, vreme: 20, krugovi: "pitanja", pismo: "cirilica"),
            sada: 1_700_000_005_000, rokDo: nil,
            uvod: phase == .uvod ? Intro(vrsta: "pitanja", broj: 1, brojPitanja: 15) : nil,
            pitanje: phase == .pitanje || revealed ? question : nil,
            odgovorili: ["b2", "c3"],
            mojOdgovor: revealed ? (matching ? .pairs([1, 0, 2]) : .index(1)) : nil,
            raspodela: revealed ? (matching ? [2, 1, 1] : [0, 2, 1, 0]) : nil,
            dobitak: revealed ? gains : nil,
            tabela: phase == .tabela ? Scoreboard(pre: ranks.reversed(), sada: ranks, poslednja: true) : nil,
            konacno: phase == .kraj ? ranks : nil
        )
    }
}
#endif
