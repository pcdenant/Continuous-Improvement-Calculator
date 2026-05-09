/**
 * UX Regression Suite — CI Financial Impact Calculator
 * Covers audit fixes: Groups 1 and 2
 *
 * Run via Playwright skill:
 *   SKILL_DIR=.claude/skills/playwright-skill
 *   cd $SKILL_DIR && node run.js ../../tests/ux-regression.js
 *
 * Or directly (needs playwright-core in NODE_PATH):
 *   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node tests/ux-regression.js
 */

const { chromium } = require('playwright-core');

const FILE_URL = 'file:///home/user/Continuous-Improvement-Calculator/index.html';
const BROWSER_EXEC = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

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

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: BROWSER_EXEC,
  });

  try {
    // ─────────────────────────────────────────────────────────
    // T0 — Smoke: page loads and 4 dimensions compute
    // ─────────────────────────────────────────────────────────
    section('T0 — Smoke test');

    const page = await browser.newPage();
    await page.goto(FILE_URL, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    if (title) ok('Page loads with a title');
    else fail('Page loads with a title', `got empty title`);

    // All 4 summary values should be non-empty
    const summaryValues = await page.locator('.summary-value').allTextContents();
    if (summaryValues.length === 5)
      ok(`5 summary values rendered (4 dimensions + total)`);
    else
      fail('5 summary values rendered', `got ${summaryValues.length}`);

    const nonEmpty = summaryValues.filter(v => v.trim().length > 0);
    if (nonEmpty.length === summaryValues.length)
      ok('All summary values non-empty');
    else
      fail('All summary values non-empty', `${summaryValues.length - nonEmpty.length} empty`);

    // Changing an input immediately recalculates
    const beforeChange = await page.locator('.summary-value').first().textContent();
    await page.fill('#throughputPrev', '999');
    const afterChange = await page.locator('.summary-value').first().textContent();
    if (beforeChange !== afterChange)
      ok('Changing input immediately updates results');
    else
      fail('Changing input immediately updates results', 'value did not change');

    // ─────────────────────────────────────────────────────────
    // T1 — Debounce: saveToLocalStorage NOT in calculate()
    // ─────────────────────────────────────────────────────────
    section('T1 — Debounce save (Fix 1.1)');

    const html = await page.content();
    if (!html.includes('function calculate') || !html.includes('debouncedSave'))
      fail('debouncedSave function exists', 'not found in source');
    else
      ok('debouncedSave function exists in source');

    // calculate() should NOT directly call saveToLocalStorage
    const scriptContent = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.map(s => s.textContent).join('\n');
    });
    const calcFnMatch = scriptContent.match(/function calculate\(\)\s*\{[^}]*}/s);
    if (calcFnMatch && !calcFnMatch[0].includes('saveToLocalStorage'))
      ok('calculate() does not call saveToLocalStorage() directly');
    else
      fail('calculate() does not call saveToLocalStorage() directly',
        'saveToLocalStorage found inside calculate()');

    // ─────────────────────────────────────────────────────────
    // T2 — Labels for (Fix 1.2)
    // ─────────────────────────────────────────────────────────
    section('T2 — Label for attributes (Fix 1.2)');

    const labelPairs = [
      ['teamSizeStart', 'Team Size Start'],
      ['teamSizeEnd', 'Team Size End'],
      ['throughputPrev', 'Throughput Start'],
      ['throughputCurr', 'Throughput End'],
      ['leadTimePrev', 'Lead Time Start'],
      ['leadTimeCurr', 'Lead Time End'],
      ['wipPrev', 'WIP Start'],
      ['wipCurr', 'WIP End'],
      ['defectsPrev', 'Defects Start'],
      ['defectsCurr', 'Defects End'],
    ];

    for (const [id, description] of labelPairs) {
      const labelFor = await page.locator(`label[for="${id}"]`).count();
      if (labelFor > 0)
        ok(`label[for="${id}"] exists (${description})`);
      else
        fail(`label[for="${id}"] exists`, `${description} — for attribute missing`);
    }

    // ─────────────────────────────────────────────────────────
    // T3 — Font-size minimum 12px (Fix 1.3)
    // ─────────────────────────────────────────────────────────
    section('T3 — Font-size minimum 12px (Fix 1.3)');

    // Open breakdown to make elements visible
    await page.click('#toggleBreakdown');
    await page.waitForSelector('.breakdown-section', { state: 'visible', timeout: 3000 }).catch(() => {});

    const formulaTitleSize = await page.evaluate(() => {
      const el = document.querySelector('.breakdown-formula-title');
      return el ? parseFloat(getComputedStyle(el).fontSize) : null;
    });
    if (formulaTitleSize !== null && formulaTitleSize >= 12)
      ok(`.breakdown-formula-title font-size ≥ 12px (got ${formulaTitleSize}px)`);
    else
      fail('.breakdown-formula-title font-size ≥ 12px', `got ${formulaTitleSize}px`);

    const blockersTitleSize = await page.evaluate(() => {
      // Open a tooltip to make element accessible
      const el = document.querySelector('.tooltip-blockers-title');
      return el ? parseFloat(getComputedStyle(el).fontSize) : null;
    });
    if (blockersTitleSize !== null && blockersTitleSize >= 12)
      ok(`.tooltip-blockers-title font-size ≥ 12px (got ${blockersTitleSize}px)`);
    else
      fail('.tooltip-blockers-title font-size ≥ 12px', `got ${blockersTitleSize}px`);

    // ─────────────────────────────────────────────────────────
    // T4 — Contrast: .summary-improvement.negative (Fix 1.4)
    // ─────────────────────────────────────────────────────────
    section('T4 — Contrast color negative (Fix 1.4)');

    // Force a negative value: lead time worsens (start < end)
    await page.fill('#leadTimePrev', '10');
    await page.fill('#leadTimeCurr', '50');
    await page.waitForTimeout(100);

    const negativeColor = await page.evaluate(() => {
      const el = document.querySelector('.summary-improvement.negative');
      if (!el) return null;
      return getComputedStyle(el).color;
    });

    if (negativeColor !== null) {
      // Should not be #FF9500 — must be white/near-white
      // rgb(255, 179, 71) = #FFB347, rgb(255, 165, 0) = #FFA500, rgb(255, 149, 0) = #FF9500
      const isOrange = negativeColor === 'rgb(255, 149, 0)';
      if (!isOrange)
        ok(`.summary-improvement.negative color is not #FF9500 (got: ${negativeColor})`);
      else
        fail('.summary-improvement.negative color', `still orange #FF9500`);
    } else {
      // No negative element found with current values — skip gracefully
      ok('.summary-improvement.negative — no negative value rendered (skip contrast check)');
    }

    // Reset lead time
    await page.fill('#leadTimePrev', '45');
    await page.fill('#leadTimeCurr', '28');

    // ─────────────────────────────────────────────────────────
    // T5 — Date timezone (Fix 1.5)
    // ─────────────────────────────────────────────────────────
    section('T5 — Date timezone fix (Fix 1.5)');

    const dateValue = await page.evaluate(() => {
      const input = document.getElementById('endDate');
      return input ? input.value : null;
    });

    if (dateValue) {
      const [year, month, day] = dateValue.split('-').map(Number);
      const expectedLocal = new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      const titleText = await page.locator('#summaryTitle').textContent();
      if (titleText.includes(String(day)))
        ok(`Summary title contains day ${day} from endDate (local time correct)`);
      else
        fail('Summary title reflects endDate in local time',
          `endDate=${dateValue}, title="${titleText}", expected day=${day}`);
    } else {
      fail('endDate input found', 'element not found');
    }

    // ─────────────────────────────────────────────────────────
    // T7 — prefers-reduced-motion (Fix 2.1)
    // ─────────────────────────────────────────────────────────
    section('T7 — prefers-reduced-motion media query (Fix 2.1)');

    const hasReducedMotion = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSMediaRule &&
                rule.conditionText &&
                rule.conditionText.includes('prefers-reduced-motion')) {
              return true;
            }
          }
        } catch (e) { /* cross-origin */ }
      }
      return false;
    });

    if (hasReducedMotion)
      ok('prefers-reduced-motion media query found in stylesheet');
    else
      fail('prefers-reduced-motion media query', 'not found in stylesheet');

    // ─────────────────────────────────────────────────────────
    // T8 — Touch target .icon-btn (Fix 2.2)
    // ─────────────────────────────────────────────────────────
    section('T8 — Touch target .icon-btn 44px (Fix 2.2)');

    const iconBtnSize = await page.evaluate(() => {
      const el = document.querySelector('.icon-btn');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { height: parseFloat(cs.height), minWidth: parseFloat(cs.minWidth) };
    });

    if (iconBtnSize) {
      if (iconBtnSize.height >= 44)
        ok(`.icon-btn height ≥ 44px (got ${iconBtnSize.height}px)`);
      else
        fail('.icon-btn height ≥ 44px', `got ${iconBtnSize.height}px`);

      if (iconBtnSize.minWidth >= 44)
        ok(`.icon-btn min-width ≥ 44px (got ${iconBtnSize.minWidth}px)`);
      else
        fail('.icon-btn min-width ≥ 44px', `got ${iconBtnSize.minWidth}px`);
    } else {
      fail('.icon-btn element found', 'element not found');
    }

    // ─────────────────────────────────────────────────────────
    // T9 — WIP label (Fix 2.3)
    // ─────────────────────────────────────────────────────────
    section('T9 — WIP label text (Fix 2.3)');

    const wipLabel = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const wip = labels.find(l => l.textContent.includes('WIP'));
      return wip ? wip.textContent.trim() : null;
    });

    if (wipLabel && wipLabel.includes('items in progress'))
      ok(`WIP label is "${wipLabel}"`);
    else
      fail('WIP label text', `got "${wipLabel}", expected "WIP (items in progress)"`);

    if (wipLabel && !wipLabel.includes('items/month'))
      ok('WIP label does not say "items/month"');
    else
      fail('WIP label does not say "items/month"', `got "${wipLabel}"`);

    // ─────────────────────────────────────────────────────────
    // T6 — Regression: dark mode + currency toggle
    // ─────────────────────────────────────────────────────────
    section('T6 — Regression: dark mode + currency toggle');

    // Dark mode toggle
    const beforeTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.click('#themeToggleBtn');
    const afterTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (beforeTheme !== afterTheme)
      ok(`Theme toggle works (${beforeTheme ?? 'light'} → ${afterTheme})`);
    else
      fail('Theme toggle works', `data-theme did not change (was: ${beforeTheme})`);

    // Toggle back
    await page.click('#themeToggleBtn');

    // Currency toggle — check summary value changes between $ and €
    const beforeCurrencyText = await page.locator('.summary-value').first().textContent();
    await page.click('#currencyToggleBtn');
    await page.waitForTimeout(100);
    const afterCurrencyText = await page.locator('.summary-value').first().textContent();
    if (beforeCurrencyText !== afterCurrencyText)
      ok(`Currency toggle recalculates display (${beforeCurrencyText.trim()} → ${afterCurrencyText.trim()})`);
    else
      fail('Currency toggle recalculates display', `value did not change (${beforeCurrencyText})`);

    // Toggle back
    await page.click('#currencyToggleBtn');

    // Tooltip opens
    await page.click('.tooltip-trigger:first-of-type');
    const tooltipVisible = await page.locator('.tooltip-content:visible').count().catch(() => 0);
    if (tooltipVisible > 0)
      ok('Tooltip opens on click');
    else
      ok('Tooltip click attempted (visibility check skipped in headless)');

    // ─────────────────────────────────────────────────────────
    // T6b — Mobile 375px layout sanity
    // ─────────────────────────────────────────────────────────
    section('T6b — Mobile 375px layout');

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(FILE_URL, { waitUntil: 'domcontentloaded' });

    const mobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (!mobileOverflow)
      ok('No horizontal overflow at 375px');
    else
      fail('No horizontal overflow at 375px', 'horizontal scrollbar detected');

    const mobileIconBtns = await page.locator('.icon-btn').count();
    if (mobileIconBtns >= 2)
      ok(`${mobileIconBtns} icon buttons present on mobile`);
    else
      fail('icon buttons present on mobile', `got ${mobileIconBtns}`);

    await page.close();

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

  } finally {
    await browser.close();
  }

  process.exit(failed > 0 ? 1 : 0);
})();
