import SwiftUI

/// Izbor kviza (sheet u lobiju vođe): standardna iOS lista – „Opšte“ i po jedna grupa za svaku oblast.
struct QuizPickerView: View {
    @Environment(\.sr) private var sr
    let selectedId: String
    let onSelect: (QuizSection.Choice) -> Void

    @EnvironmentObject private var catalog: QuizCatalogDataStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            content
                .navigationTitle(sr("Izaberi kviz"))
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button(sr("Zatvori")) { dismiss() }
                    }
                }
        }
        .task {
            if catalog.quizzes.isEmpty { await catalog.load() }
        }
    }

    @ViewBuilder
    private var content: some View {
        if catalog.quizzes.isEmpty, catalog.isLoading {
            ProgressView()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else if catalog.quizzes.isEmpty, catalog.error != nil {
            // Prvo učitavanje nije uspelo i nema šta da se prikaže: poruka u sadržaju, ne alert.
            ContentUnavailableView {
                Label(sr("Spisak kvizova nije stigao"), systemImage: "wifi.exclamationmark")
            } description: {
                Text(sr(catalog.error?.errorDescription ?? ""))
            } actions: {
                Button(sr("Pokušaj ponovo")) { Task { await catalog.load() } }
                    .buttonStyle(.borderedProminent)
            }
        } else {
            List(catalog.sections) { section in
                Section(sr(section.title)) {
                    ForEach(section.choices) { choice in
                        row(choice)
                    }
                }
            }
            .listStyle(.insetGrouped)
        }
    }

    private func row(_ choice: QuizSection.Choice) -> some View {
        let isSelected = choice.id == selectedId
        return Button {
            onSelect(choice)
        } label: {
            HStack(spacing: 12) {
                Text(choice.icon)
                    .font(.title3)
                    .frame(width: 32)
                VStack(alignment: .leading, spacing: 2) {
                    Text(sr(choice.title))
                        // `Color.primary`, ne `.primary`: dugme u listi bi inače obojilo tekst bojom akcenta.
                        .foregroundStyle(Color.primary)
                    Text(sr("\(choice.questionCount) pitanja"))
                        .font(.caption)
                        .foregroundStyle(Color.secondary)
                }
                Spacer()
                if isSelected {
                    Image(systemName: "checkmark")
                        .fontWeight(.semibold)
                        .foregroundStyle(Color.accentColor)
                }
            }
            .contentShape(Rectangle())
        }
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}

#if DEBUG
#Preview {
    QuizPickerView(selectedId: "opste") { _ in }
        .environmentObject(QuizCatalogDataStore(service: MockGameService()))
        .preferredColorScheme(.dark)
}
#endif
