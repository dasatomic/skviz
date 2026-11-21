import Foundation

/// Stanje sobe kako ga vidi jedan igrač (`soba.pogled(id)` u `lib/soba.js`).
/// Stiže iz `GET /api/stanje`. Polja zavise od faze, pa su opciona.
struct RoomState: Decodable, Equatable, Sendable {
    let kod: String
    let verzija: Int
    let faza: Phase
    /// Javni id vođe igre.
    let domacin: String?
    /// Javni id ovog telefona. Klijent se prepoznaje po njemu, ne po tajnom id-ju.
    let ja: String
    let igraci: [Player]
    let podesavanja: Settings
    /// Vreme servera u trenutku slanja (ms od 1970). Služi da tajmer ne zavisi od sata telefona.
    let sada: Double
    let rokDo: Double?

    let uvod: Intro?
    let pitanje: Question?
    let odgovorili: [String]?
    let mojOdgovor: AnswerValue?
    let raspodela: [Int]?
    let dobitak: [String: Gain]?
    let tabela: Scoreboard?
    let konacno: [Rank]?

    var isHost: Bool { domacin == ja }
    var me: Player? { igraci.first { $0.id == ja } }

    func player(_ id: String) -> Player? {
        igraci.first { $0.id == id }
    }
}

extension RoomState {
    enum Phase: Equatable, Sendable, Decodable {
        case lobi, uvod, pitanje, otkrivanje, reci, reciOtkrivanje, tabela, kraj
        /// Faza koju ova verzija aplikacije ne poznaje (server je noviji).
        case unknown(String)

        init(from decoder: Decoder) throws {
            let raw = try decoder.singleValueContainer().decode(String.self)
            switch raw {
            case "lobi": self = .lobi
            case "uvod": self = .uvod
            case "pitanje": self = .pitanje
            case "otkrivanje": self = .otkrivanje
            case "reci": self = .reci
            case "reci-otkrivanje": self = .reciOtkrivanje
            case "tabela": self = .tabela
            case "kraj": self = .kraj
            default: self = .unknown(raw)
            }
        }

        /// Naziv faze za `dalje` – server zanemaruje „Dalje“ ako se faza u međuvremenu promenila.
        var rawValue: String {
            switch self {
            case .lobi: "lobi"
            case .uvod: "uvod"
            case .pitanje: "pitanje"
            case .otkrivanje: "otkrivanje"
            case .reci: "reci"
            case .reciOtkrivanje: "reci-otkrivanje"
            case .tabela: "tabela"
            case .kraj: "kraj"
            case .unknown(let raw): raw
            }
        }
    }

    struct Player: Decodable, Equatable, Identifiable, Sendable {
        let id: String
        let ime: String
        let avatar: String
        let boja: String?
        let poeni: Int
        let niz: Int?
        let povezan: Bool?
    }

    struct Settings: Decodable, Equatable, Sendable {
        let kviz: String
        let brojPitanja: Int
        let vreme: Int
        let krugovi: String
        /// Pismo sobe (`cirilica` ili `latinica`); bira ga vođa i važi za sve u sobi.
        let pismo: String?
    }

    struct Intro: Decodable, Equatable, Sendable {
        /// `pitanja` ili `reci`.
        let vrsta: String
        let broj: Int
        let brojPitanja: Int?
    }

    struct Question: Decodable, Equatable, Sendable {
        struct Area: Decodable, Equatable, Sendable {
            let naziv: String
            let ikona: String?
            let boja: String?
        }

        let rb: Int
        let ukupno: Int
        let tekst: String
        /// `izbor`, `uljez` ili `spoji`.
        let vrsta: String
        let odgovori: [String]?
        /// „Spoji pojmove“: pojmovi levo i desno, svaka kolona izmešana posebno.
        let levo: [String]?
        let desno: [String]?
        let tezina: Int?
        let oblast: Area?
        /// Jezik pitanja (`en` za kvizove na engleskom); `nil` je srpski.
        let jezik: String?
        /// Početak pitanja i trajanje, u ms po satu servera.
        let pocetak: Double
        let trajanje: Double
        // samo u fazi „otkrivanje“
        let tacan: AnswerValue?
        let zanimljivost: String?
        let objasnjenje: String?

        var isMultipleChoice: Bool { vrsta != "spoji" && (odgovori?.count ?? 0) == 4 }

        /// „Spoji pojmove“ sa ispravnim podacima: isti broj pojmova levo i desno.
        var isMatching: Bool {
            guard vrsta == "spoji", let levo, let desno else { return false }
            return !levo.isEmpty && levo.count == desno.count
        }
    }

    /// Poeni jednog igrača za poslednje pitanje.
    struct Gain: Decodable, Equatable, Sendable {
        let poeni: Int
        let bonus: Int?
        let tacno: Bool
        /// Niz tačnih odgovora zaredom (od trećeg donosi bonus).
        let niz: Int?
        let bez: Bool?
        /// „Spoji pojmove“: broj tačnih parova od ukupno `od`.
        let pogodjeno: Int?
        let od: Int?
    }

    struct Rank: Decodable, Equatable, Sendable {
        let id: String
        let poeni: Int
    }

    struct Scoreboard: Decodable, Equatable, Sendable {
        /// Poredak pre ovog kruga – za strelice gore/dole.
        let pre: [Rank]?
        let sada: [Rank]
        let poslednja: Bool?
    }
}

/// Odgovor je indeks (izbor, uljez) ili niz indeksa (spoji pojmove: za svaki pojam levo, indeks para desno).
enum AnswerValue: Codable, Equatable, Sendable {
    case index(Int)
    case pairs([Int])

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let index = try? container.decode(Int.self) {
            self = .index(index)
        } else {
            self = .pairs(try container.decode([Int].self))
        }
    }

    /// Server prima isti oblik u polju `izbor`: broj ili niz brojeva.
    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .index(let value): try container.encode(value)
        case .pairs(let values): try container.encode(values)
        }
    }

    var index: Int? {
        if case .index(let value) = self { value } else { nil }
    }

    var pairs: [Int]? {
        if case .pairs(let values) = self { values } else { nil }
    }
}
