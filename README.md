# Continuous Improvement Financial Impact Calculator

A single-file web tool that translates flow metrics into financial impact for leadership. Built for Scrum Masters and Agile Coaches who need to prove measurable business value — not just report ceremony completion.

**→ [Live tool](https://pcdenant.github.io/Continuous-Improvement-Calculator/index.html)** · **[Collaboration Solved](https://collaborationsolved.com)**

---

## What it does

Enter your team's flow metrics at the start and end of an improvement period. The calculator converts the delta into dollar (or euro) savings across four independent dimensions, plus one memo line:

| Dimension | Leadership framing |
| --- | --- |
| Productivity | Delivery Cost Reduction |
| Time-to-Market | Revenue Acceleration |
| Efficiency (WIP) | Carrying Cost Reduction |
| Quality | Rework Cost Elimination |
| Headcount Cost Saving (memo) | Headcount Cash Saving — not included in Total |

Each dimension shows the impact over the measured period and a projected annual figure.

---

## Why these four dimensions (plus one memo line)

The four core dimensions are intentionally independent — not mathematically linked via Little's Law. This is a design choice, not an oversight. Linking them creates a double-counting problem (WIP × Throughput × Lead Time are interdependent). Keeping them separate makes the tool usable without requiring practitioners to resolve the dependency before presenting results.

**Headcount Cost Saving** is shown separately, below the Total, and deliberately excluded from it. A real headcount reduction already lowers Cost per Item, which Productivity accounts for — adding a dedicated headcount line to the same Total would double-count that same reduction. The memo line exists to disclose that part of the Productivity number is actual cash saved, not just avoided cost, without inflating the headline figure.

---

## Inputs

**Team Economics**

* Blend Rate ($/hour or €/hour)
* Hours per Day
* Team Size — Start and End (a smaller, more focused team can outperform a larger one)
* Working Days per Week / per Month

**Improvement Period**

* Start Date and End Date (defaults to today and 3 months prior)

**Flow Metrics** (Start and End values for each)

* Throughput (items/month)
* Lead Time (days)
* WIP (items in progress)
* Defects (count/month)

---

## Features

* **Auto-save** — values saved to localStorage on every input change
* **Share link** — generates a URL with all values encoded as parameters
* **Show Breakdown** — collapsible section with formulas, exec translation, and rationale per dimension
* **Tooltips** — each savings tile has a `?` icon explaining what drives the number and common blockers
* **Light / Dark mode**
* **$ / € currency toggle**
* **Responsive** — works on mobile and desktop

---

## Formulas

**Productivity (Delivery Cost Reduction)**

```
Impact = -((Cost/Item End − Cost/Item Start) × Items/Month End × Months)
```

Where `Cost/Item = Monthly Team Cost / Throughput`

**Time-to-Market (Revenue Acceleration)**

```
Impact = -((Lead Time End − Lead Time Start) × Daily Team Cost × Months)
```

Each day removed from lead time is a day of team cost recovered per delivery cycle. Throughput is deliberately excluded: the per-item daily cost and the throughput multiplier cancel mathematically, so including throughput inflates the result without adding accuracy.

**Efficiency / WIP (Carrying Cost Reduction)**

```
Impact = -((WIP End − WIP Start) × Cost/Item End × 2% × Months)
```

WIP is a stock metric, not a flow. A 2%/month carrying rate (≈ 25%/year) is applied — the standard proxy for the cost of capital tied up in unfinished work. Multiplying a stock directly by months without a rate would imply a 100%/month holding cost, which is not defensible.

**Quality (Rework Cost Elimination)**

```
Impact = -((Defects End − Defects Start) × Cost/Item End × Months)
```

Defects are a flow metric (count/month), so multiplying by months is correct: fewer defects per month, compounded over the period.

**Headcount Cost Saving (memo — not in Total)**

```
Impact = (Team Size Start − Team Size End) × Cost/Head/Month × Months
```

Where `Cost/Head/Month = Blend Rate × Hours/Day × Working Days/Month`

A shrinking team produces a positive value (cash saved); a growing team produces a negative value (added cost) — the formula is symmetric, it isn't floored at zero. This line is **excluded from Total Financial Impact**: Productivity above already reflects the same headcount change through Cost per Item, so summing both would double-count it.

**Negative sign convention**: a reduction in cost/time/WIP/defects produces a positive savings value. An increase produces a negative value (cost increase), shown in red.

---

## Usage notes

* **Positive values** = savings (shown in yellow)
* **Negative values** = cost increase (shown in red) — the team got worse on that dimension
* **Projected Annual** = period impact ÷ months × 12
* All four dimensions are independent — total impact is a sum, not a derived figure
* **Headcount Cost Saving** is a memo line — it is not part of the sum

---

## Single-file architecture

The tool is a self-contained `.html` file with no external dependencies beyond Google Fonts. No build step, no framework, no server required. Open in any browser.

---

## Methodology

Built on the **Value Bridge** framework by Pierre-Cyril Denant. The Value Bridge connects operational flow metrics (throughput, cycle time, lead time, WIP) to executive-level financial language — the only language that protects the Scrum Master role from budget cuts.

More at [collaborationsolved.com](https://collaborationsolved.com) · [SM Survival Score](https://sm-survival-score.vercel.app/)

---

## Report an issue

[Open an issue on GitHub](https://github.com/pcdenant/Continuous-Improvement-Calculator/issues)

---

*un outil de Collaboration Solved par Pierre-Cyril Denant — 2026*
