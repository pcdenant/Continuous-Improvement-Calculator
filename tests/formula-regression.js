/**
 * Formula Regression Suite — CI Financial Impact Calculator
 * Tests the 5 pure calc functions + calculateMonths directly against the
 * CLAUDE.md baseline, without a browser. Complements tests/ux-regression.js
 * (UI/Playwright) with a fast, dependency-free check on the math itself.
 *
 * Extracts the real source from index.html (not a hand-typed copy) so a
 * change to the formulas is caught even if nobody remembers to update this
 * file — that's the whole point of "formula-level" regression protection.
 *
 * Run:
 *   node tests/formula-regression.js
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
const failures = [];

function ok(name) {
  console.log(`  ✅ ${name}`);
  passed++;
}

function fail(name, detail) {
  console.log(`  ❌ ${name} — ${detail}`);
  failed++;
  failures.push({ name, detail });
}

function section(title) {
  console.log(`\n▶ ${title}`);
}

function assertEqual(name, actual, expected) {
  if (actual === expected) ok(`${name} = ${expected}`);
  else fail(name, `got ${actual}, expected ${expected}`);
}

// ─────────────────────────────────────────────────────────
// Extraction — pull the real functions out of index.html
// ─────────────────────────────────────────────────────────
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const source = fs.readFileSync(INDEX_PATH, 'utf8');

const constMatch = source.match(/const CARRYING_RATE_MONTHLY = [\d.]+;/);
const calcStartMarker = 'function calcProductivity(';
const calcEndMarker = 'function updateDimensionDisplay(';
const calcStartIdx = source.indexOf(calcStartMarker);
const calcEndIdx = source.indexOf(calcEndMarker, calcStartIdx);

const monthsStartMarker = 'function calculateMonths(';
const monthsEndMarker = 'function formatCurrency(';
const monthsStartIdx = source.indexOf(monthsStartMarker);
const monthsEndIdx = source.indexOf(monthsEndMarker, monthsStartIdx);

if (!constMatch || calcStartIdx === -1 || calcEndIdx === -1 || monthsStartIdx === -1 || monthsEndIdx === -1) {
  console.error('❌ Extraction failed — index.html structure changed (markers not found). Aborting.');
  process.exit(1);
}

const calcBlock = source.slice(calcStartIdx, calcEndIdx);
const fnCount = (calcBlock.match(/function calc\w+\(/g) || []).length;
if (fnCount !== 5) {
  console.error(`❌ Expected exactly 5 calc functions in extracted block, found ${fnCount}. Aborting — do not trust a partial extraction.`);
  process.exit(1);
}

const monthsBlock = source.slice(monthsStartIdx, monthsEndIdx);

const { calcProductivity, calcTTM, calcEfficiency, calcQuality, calcHeadcountSaving, CARRYING_RATE_MONTHLY } =
  eval(`(function () { ${constMatch[0]}\n${calcBlock}\nreturn { calcProductivity, calcTTM, calcEfficiency, calcQuality, calcHeadcountSaving, CARRYING_RATE_MONTHLY }; })()`);

const { calculateMonths } = eval(`(function () { ${monthsBlock}\nreturn { calculateMonths }; })()`);

// ─────────────────────────────────────────────────────────
// Scenario A — v2.5 baseline, team unchanged (5→5)
// ─────────────────────────────────────────────────────────
section('Scenario A — v2.5 baseline (team 5→5)');

const A = {
  blendRate: 100, hoursPerDay: 8, teamSizeStart: 5, teamSizeEnd: 5, workingDaysPerMonth: 20, months: 3,
  throughputPrev: 40, throughputCurr: 50,
  leadTimePrev: 45, leadTimeCurr: 40,
  wipPrev: 25, wipCurr: 20,
  defectsPrev: 10, defectsCurr: 6,
};

function deriveAndRun(s) {
  const dailyCostStart = s.blendRate * s.hoursPerDay * s.teamSizeStart;
  const dailyCostEnd = s.blendRate * s.hoursPerDay * s.teamSizeEnd;
  const monthlyCostStart = dailyCostStart * s.workingDaysPerMonth;
  const monthlyCostEnd = dailyCostEnd * s.workingDaysPerMonth;
  const monthlyCostPerHead = s.blendRate * s.hoursPerDay * s.workingDaysPerMonth;
  const costPerItemPrev = monthlyCostStart / s.throughputPrev;
  const costPerItemCurr = monthlyCostEnd / s.throughputCurr;

  const productivity = calcProductivity(costPerItemPrev, costPerItemCurr, s.throughputCurr, s.months);
  const ttm = calcTTM(s.leadTimeCurr - s.leadTimePrev, dailyCostEnd, s.months);
  const efficiency = calcEfficiency(s.wipCurr - s.wipPrev, costPerItemCurr, s.months);
  const quality = calcQuality(s.defectsCurr - s.defectsPrev, costPerItemCurr, s.months);
  const headcount = calcHeadcountSaving(s.teamSizeStart, s.teamSizeEnd, monthlyCostPerHead, s.months);

  return { productivity, ttm, efficiency, quality, headcount, costPerItemPrev, costPerItemCurr, dailyCostEnd, monthlyCostPerHead };
}

const resultA = deriveAndRun(A);
assertEqual('A: productivity.period', resultA.productivity.period, 60000);
assertEqual('A: productivity.annual', resultA.productivity.annual, 240000);
assertEqual('A: ttm.period', resultA.ttm.period, 60000);
assertEqual('A: ttm.annual', resultA.ttm.annual, 240000);
assertEqual('A: efficiency.period', resultA.efficiency.period, 480);
assertEqual('A: efficiency.annual', resultA.efficiency.annual, 1920);
assertEqual('A: quality.period', resultA.quality.period, 19200);
assertEqual('A: quality.annual', resultA.quality.annual, 76800);
assertEqual('A: headcount.period', resultA.headcount.period, 0);
assertEqual('A: headcount.annual', resultA.headcount.annual, 0);

const totalPeriodA = resultA.productivity.period + resultA.ttm.period + resultA.efficiency.period + resultA.quality.period;
const totalAnnualA = resultA.productivity.annual + resultA.ttm.annual + resultA.efficiency.annual + resultA.quality.annual;
assertEqual('A: total.period (4 dims only)', totalPeriodA, 139680);
assertEqual('A: total.annual (4 dims only)', totalAnnualA, 558720);

// ─────────────────────────────────────────────────────────
// Scenario B — v2.7 baseline, team reduced (7→5)
// ─────────────────────────────────────────────────────────
section('Scenario B — v2.7 baseline (team 7→5)');

const B = Object.assign({}, A, { teamSizeStart: 7 });
const resultB = deriveAndRun(B);

assertEqual('B: productivity.period', resultB.productivity.period, 180000);
assertEqual('B: productivity.annual', resultB.productivity.annual, 720000);
assertEqual('B: headcount.period', resultB.headcount.period, 96000);
assertEqual('B: headcount.annual', resultB.headcount.annual, 384000);

const totalPeriodB = resultB.productivity.period + resultB.ttm.period + resultB.efficiency.period + resultB.quality.period;
const totalAnnualB = resultB.productivity.annual + resultB.ttm.annual + resultB.efficiency.annual + resultB.quality.annual;
assertEqual('B: total.period (4 dims only)', totalPeriodB, 259680);
assertEqual('B: total.annual (4 dims only)', totalAnnualB, 1038720);

// G9: only Productivity/Headcount should move between A and B — TTM/Efficiency/Quality
// depend only on teamSizeEnd/costPerItemCurr, unchanged between the two scenarios.
assertEqual('A vs B: ttm.period unchanged (G9)', resultB.ttm.period, resultA.ttm.period);
assertEqual('A vs B: efficiency.period unchanged (G9)', resultB.efficiency.period, resultA.efficiency.period);
assertEqual('A vs B: quality.period unchanged (G9)', resultB.quality.period, resultA.quality.period);
if (resultB.productivity.period !== resultA.productivity.period)
  ok('A vs B: productivity.period changes with teamSizeStart (expected, pre-existing — see G9)');
else
  fail('A vs B: productivity.period changes with teamSizeStart', 'did not change — G9 mechanism may be broken');

// ─────────────────────────────────────────────────────────
// calculateMonths — floor at 1, never 0 or negative (G2)
// ─────────────────────────────────────────────────────────
section('calculateMonths — edge cases (G2)');

assertEqual('same month → floored to 1', calculateMonths('2026-03-01', '2026-03-15'), 1);
assertEqual('startDate > endDate → floored to 1 (never negative)', calculateMonths('2026-05-01', '2026-01-01'), 1);
assertEqual('normal 3-month span', calculateMonths('2026-01-01', '2026-04-01'), 3);
assertEqual('normal 12-month span (year boundary)', calculateMonths('2026-01-15', '2027-01-15'), 12);

// ─────────────────────────────────────────────────────────
// Zero-derived-argument cases (realistic values calculate() would pass in
// when throughput/blendRate/hoursPerDay = 0 — guards live upstream, not
// inside these pure functions; NaN/invalid input is out of scope here)
// ─────────────────────────────────────────────────────────
section('Zero-derived arguments — no NaN/Infinity when a dimension collapses to 0');

assertEqual('calcProductivity(0, 0, 0, 3).period — throughputCurr=0 collapses to 0', calcProductivity(0, 0, 0, 3).period, 0);
assertEqual('calcTTM(-5, 0, 3).period — dailyCostEnd=0 collapses to 0', calcTTM(-5, 0, 3).period, 0);
assertEqual('calcEfficiency(-5, 0, 3).period — costPerItemCurr=0 collapses to 0', calcEfficiency(-5, 0, 3).period, 0);
assertEqual('calcQuality(-4, 0, 3).period — costPerItemCurr=0 collapses to 0', calcQuality(-4, 0, 3).period, 0);

// ─────────────────────────────────────────────────────────
// teamSizeStart === teamSizeEnd → headcount exactly 0
// ─────────────────────────────────────────────────────────
section('calcHeadcountSaving — team unchanged');

assertEqual('teamSizeStart === teamSizeEnd → period exactly 0', calcHeadcountSaving(9, 9, 16000, 3).period, 0);

// ─────────────────────────────────────────────────────────
// Negative sign flips — a metric getting worse must produce a negative period
// ─────────────────────────────────────────────────────────
section('Negative sign flips — metric worsens ⇒ period negative');

if (calcTTM(10, 4000, 3).period < 0) ok('calcTTM: leadTime increases ⇒ negative period');
else fail('calcTTM: leadTime increases ⇒ negative period', `got ${calcTTM(10, 4000, 3).period}`);

if (calcQuality(4, 1600, 3).period < 0) ok('calcQuality: defects increase ⇒ negative period');
else fail('calcQuality: defects increase ⇒ negative period', `got ${calcQuality(4, 1600, 3).period}`);

if (calcHeadcountSaving(5, 7, 16000, 3).period < 0) ok('calcHeadcountSaving: team grows ⇒ negative period, not floored at 0');
else fail('calcHeadcountSaving: team grows ⇒ negative period', `got ${calcHeadcountSaving(5, 7, 16000, 3).period}`);

// ─────────────────────────────────────────────────────────
// CARRYING_RATE_MONTHLY — extracted constant and its effect on Efficiency
// ─────────────────────────────────────────────────────────
section('CARRYING_RATE_MONTHLY — constant and usage');

assertEqual('CARRYING_RATE_MONTHLY extracted value', CARRYING_RATE_MONTHLY, 0.02);

const wipChange = -5, costPerItemCurr = 1600, months = 3;
const expectedEfficiency = -wipChange * costPerItemCurr * CARRYING_RATE_MONTHLY * months;
assertEqual('calcEfficiency uses CARRYING_RATE_MONTHLY exactly', calcEfficiency(wipChange, costPerItemCurr, months).period, expectedEfficiency);

// ─────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log(`  ❌ ${f.name}: ${f.detail}`));
}
console.log('─'.repeat(50));

process.exit(failed > 0 ? 1 : 0);
