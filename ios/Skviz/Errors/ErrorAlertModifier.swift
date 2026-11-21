import SwiftUI

extension View {
    /// Prikaz alert-a iz `ErrorCenter`-a. Stavlja se jednom, na root view.
    /// Aplikacija sa sopstvenim izgledom alert-a pravi svoj modifier po ovom obrascu.
    func errorAlert(_ center: ErrorCenter, buttonTitle: String = "U redu") -> some View {
        modifier(ErrorAlertModifier(center: center, buttonTitle: buttonTitle))
    }

    /// Prosleđuje grešku DataStore-a u `ErrorCenter` iz environment-a i zatim je briše iz store-a.
    /// Koristi ga ekran koji grešku prikazuje kao alert. Ekran koji grešku prikazuje u sadržaju
    /// (prazna lista sa dugmetom „Pokušaj ponovo”) čita `store.error` direktno i ne zove ovo.
    func forwardsError<Failure: Error & Equatable>(
        _ error: Failure?,
        clear: @escaping @MainActor @Sendable () -> Void
    ) -> some View {
        modifier(ForwardErrorModifier(error: error, clear: clear))
    }
}

struct ErrorAlertModifier: ViewModifier {
    @ObservedObject var center: ErrorCenter
    let buttonTitle: String
    // Poruke (i one sa servera) su na latinici; alert ih prikazuje u pismu uređaja.
    @Environment(\.sr) private var sr

    func body(content: Content) -> some View {
        content.alert(
            sr(center.current?.title ?? ""),
            // Zatvaranje ide samo kroz binding. Dugme ne zove `dismiss()`, inače bi se red pomerio dva puta.
            isPresented: Binding(
                get: { center.current != nil },
                set: { isPresented in if !isPresented { center.dismiss() } }
            ),
            presenting: center.current
        ) { _ in
            Button(sr(buttonTitle), role: .cancel) {}
        } message: { alert in
            Text(sr(alert.message))
        }
    }
}

struct ForwardErrorModifier<Failure: Error & Equatable>: ViewModifier {
    @EnvironmentObject private var center: ErrorCenter
    let error: Failure?
    let clear: @MainActor @Sendable () -> Void

    func body(content: Content) -> some View {
        // `.task(id:)` se pokreće i pri prvom prikazu, pa hvata i grešku nastalu pre nego što se ekran pojavio.
        content.task(id: error) { @MainActor in
            guard let error else { return }
            center.present(error)
            clear()
        }
    }
}
