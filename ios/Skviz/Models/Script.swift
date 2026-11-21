import Foundation

/// Pismo prikaza. Podrazumevano je ćirilica, kao na sajtu; kod i podaci sa servera su na latinici.
enum Script: String, CaseIterable, Sendable {
    case cirilica
    case latinica

    /// Naziv u svom pismu (dugme izbora uvek pokazuje oba pisma ispravno).
    var title: String {
        switch self {
        case .cirilica: "Ћирилица"
        case .latinica: "Latinica"
        }
    }

    init(server value: String?) {
        self = value == "latinica" ? .latinica : .cirilica
    }
}
