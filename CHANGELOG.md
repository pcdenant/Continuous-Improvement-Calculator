# Changelog

## [v1.2] - 2026-02-03

### Added
- Improvement percentage indicators next to each category label (e.g., Productivity +10%)
- Dynamic period dates in summary title
- Formula breakdown section with rationale for each calculation
- Meta author tag in HTML head

### Changed
- Currency format: switched to K$ and M$ notation with one decimal (e.g., 1.8 K$, 11.8 M$)
- Currency symbol position: moved after numbers (e.g., 250$ instead of $250)
- Subtitle: "Quantifies the Business Value of Continuous Improvement"
- Footer: replaced text with ❤️ and 🍁 emojis
- "Annual" renamed to "Projected Annual" throughout
- Flow metrics labels: "Previous/Current" renamed to "Start/End"
- WIP label: clarified as "WIP (items/month)"
- Section title: "Period" renamed to "Improvement Period"
- Breakdown order: Productivity → Time-to-Market → Efficiency → Quality

### Fixed
- Date synchronization between Period input and Summary display
- Calculation formulas inverted signs (savings = positive, cost increase = negative)
- Rounding: all monetary values rounded to integers before display

## [v1.1] - 2026-02-03

### Initial Release
- Team economics input panel
- Flow metrics tracking (Throughput, Lead Time, WIP, Defects)
- Period selection with date range
- Automated savings calculation across 4 categories:
  - Productivity
  - Time-to-Market
  - Efficiency (WIP)
  - Quality
- Collapsible breakdown section
- Dark mode professional design
