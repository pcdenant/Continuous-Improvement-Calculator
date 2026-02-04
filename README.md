# Continuous Improvement Impact Calculator

Quantifies the Business Value of Continuous Improvement.

A web-based calculator that translates flow metrics improvements into executive-level financial impact. Built for Scrum Masters and Agile Coaches who need to prove measurable value.

## What It Does

Calculates the business impact of continuous improvement across four dimensions:

- **Productivity** – Cost per item changes as throughput evolves
- **Time-to-Market** – Value acceleration from reduced lead times
- **Efficiency** – WIP reduction impact on flow and carrying costs
- **Quality** – Defect reduction savings

Enter your team economics, improvement period, and flow metrics. Get period and projected annual savings.

## How to Use

1. Open `ci-savings-calculator.html` in your browser
2. Fill in **Team Economics** (blend rate, team size, working days)
3. Set your **Improvement Period** (start/end dates)
4. Enter **Flow Metrics** before and after (throughput, lead time, WIP, defects)
5. View instant calculations in the **Summary** section
6. Click "Show Breakdown" for formulas and detailed rationale

## Features

- Real-time calculation as you type
- Currency formatting with K$ and M$ notation
- Improvement percentage indicators
- Formula breakdown with business rationale
- Mobile responsive
- No dependencies, no backend, no data collection

## Example Use Case

**Before improvement:**
- Throughput: 50 items/month
- Lead Time: 45 days
- WIP: 25 items
- Defects: 8/month

**After improvement:**
- Throughput: 40 items/month
- Lead Time: 25 days
- WIP: 25 items
- Defects: 25/month

**Result:** 22.4 M$ period savings, 53.9 M$ projected annual.

## Installation

No installation needed. Just download and open in any modern browser.

```bash
git clone https://github.com/pcdenant/Continuous-Improvement-Calculator.git
cd Continuous-Improvement-Calculator
open ci-savings-calculator.html
```

## Tech Stack

- Pure HTML/CSS/JavaScript
- No frameworks
- No build process
- IBM Plex Mono + Inter fonts (via Google Fonts CDN)

## Contributing

Found a bug or have a suggestion? [Open an issue](https://github.com/pcdenant/Continuous-Improvement-Calculator/issues).

## License

MIT License - use it, modify it, share it.

## Author

**Pierre-Cyril Denant**  
Agile Coach | Scrum Master Mentor  
[collaborationsolved.com](https://collaborationsolved.com)

---

Made with ❤️ and 🍁 Syrup
