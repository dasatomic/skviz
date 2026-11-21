import Foundation

/// Niz koji preskače elemente koji ne mogu da se dekodiraju, umesto da obori ceo odgovor.
///
/// Samo za sadržaj kod koga je izostanak jedne stavke prihvatljiv (vesti, baneri, meni).
/// Za dokumente, stavke računa, iznose i slične podatke koristi se običan `[T]`:
/// tu odgovor mora da padne, jer bi stavka inače tiho nestala iz liste.
///
/// Ključ koji ne postoji ili je `null` daje prazan niz. Vrednost koja nije niz i dalje je greška.
@propertyWrapper
struct LossyArray<Element: Decodable>: Decodable {
    var wrappedValue: [Element]

    init(wrappedValue: [Element] = []) {
        self.wrappedValue = wrappedValue
    }

    init(from decoder: Decoder) throws {
        var container = try decoder.unkeyedContainer()
        var elements: [Element] = []
        var skipped = 0
        while !container.isAtEnd {
            if let value = try container.decode(Attempt<Element>.self).value {
                elements.append(value)
            } else {
                skipped += 1
            }
        }
        if skipped > 0 {
            (decoder.userInfo[.lossyReport] as? LossyReport)?.add(skipped)
        }
        self.wrappedValue = elements
    }
}

extension LossyArray: Equatable where Element: Equatable {}
extension LossyArray: Sendable where Element: Sendable {}

private struct Attempt<Wrapped: Decodable>: Decodable {
    let value: Wrapped?

    init(from decoder: Decoder) throws {
        value = try? Wrapped(from: decoder)
    }
}

extension KeyedDecodingContainer {
    func decode<T>(_ type: LossyArray<T>.Type, forKey key: Key) throws -> LossyArray<T> {
        try decodeIfPresent(type, forKey: key) ?? LossyArray()
    }
}

/// Broji elemente koje je `@LossyArray` preskočio u jednom odgovoru.
/// `HTTPClient` ga prosleđuje dekoderu i posle dekodiranja javlja broj kroz `onLossyDecode`.
final class LossyReport: @unchecked Sendable {
    private let lock = NSLock()
    private var count = 0

    init() {}

    var skipped: Int {
        lock.withLock { count }
    }

    func add(_ amount: Int) {
        lock.withLock { count += amount }
    }
}

extension CodingUserInfoKey {
    static let lossyReport = CodingUserInfoKey(rawValue: "inmind.lossyReport")!
}
