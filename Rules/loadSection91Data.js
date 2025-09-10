export async function loadSection91Data(pageProxy, qcItem91, FormSectionedTable, attachments, flags, testdataArray) {
  try {
    const Section91 = FormSectionedTable.getSection('Section91Form');
    if (!Section91) throw new Error('Section91Form not found.');
    await Section91.setVisible(true);

    // Hide possible next buttons on the header section
    ['Section92NextButton', 'Section91NextButton'].forEach(async (n) => {
      const b = Section91.getControl(n);
      if (b) await b.setVisible(false);
    });

    // header meta fields (safe checks)
    const setIf = async (ctrl, val) => {
      if (ctrl && typeof val !== 'undefined' && val !== null) {
        // arrays for multi-select remain as in your earlier code; text use string
        await ctrl.setValue(Array.isArray(val) ? val : val);
        if (ctrl.redraw) await ctrl.redraw();
      }
    };
    await setIf(Section91.getControl('Section91Date'), qcItem91?.DATE_INSPECTED);
    await setIf(Section91.getControl('Section91InspectedBy'), qcItem91?.INSPECTED_BY ? [qcItem91.INSPECTED_BY] : undefined);
    await setIf(Section91.getControl('Section91Method'), qcItem91?.METHOD);
    await setIf(Section91.getControl('Section91DecisionTaken'), qcItem91?.DECISION_TAKEN ? [qcItem91.DECISION_TAKEN] : undefined);

    // Reveal related sections if flags say so
    if (flags?.next === false) {
      const sName = FormSectionedTable.getSection('Section91TestNameForm');
      if (sName) await sName.setVisible(true);
      const sTest = FormSectionedTable.getSection('Section91TestForm');
      if (sTest) await sTest.setVisible(true);
    }

    // test form & row control map
    const testForm = FormSectionedTable.getSection('Section91TestForm');
    if (!testForm) return;
    await testForm.setVisible(true);

    const rowConfig = {
      1: { water: 'Section91TestWaterCasteing1', ff: 'Section91FF1', tf: 'Section91TF1', st: 'Section91SettingTime1', remark: 'Section91TestRemark1' },
      2: { water: 'Section91TestWaterCasteing2', ff: 'Section91FF2', tf: 'Section91TF2', st: 'Section91SettingTime2', remark: 'Section91TestRemark2' },
      3: { water: 'Section91TestWaterCasteing3', ff: 'Section91FF3', tf: 'Section91TF3', st: 'Section91SettingTime3', remark: 'Section91TestRemark3' }
    };

    // Helper: check if item is relevant for this block
    const isRelevant = (it) => {
      if (!it) return false;
      const name = (it.testname || '').toString().toLowerCase();
      if (/castable|workabil/i.test(name)) return true;
      // presence of test fields also qualifies
      return ['watercasting','ff','tf','settleduration','remark','fluidity'].some(k => typeof it[k] !== 'undefined' && it[k] !== null);
    };

    // get relevant items and keep original objects (they contain createdAt etc.)
    let relevant = Array.isArray(testdataArray) ? testdataArray.filter(isRelevant) : [];

    // If no relevant items, clear row controls and return
    if (!relevant.length) {
      for (let r = 1; r <= 3; r++) {
        const cfg = rowConfig[r];
        ['water','ff','tf','st','remark'].forEach(async (k) => {
          const ctrl = testForm.getControl(cfg[k]);
          if (ctrl) { await ctrl.setValue(''); if (ctrl.redraw) await ctrl.redraw(); }
        });
      }
      return;
    }

    // Sort strategy: if numeric order fields exist, use them; else sort by createdAt ascending (oldest first).
    const hasNumericOrder = relevant.some(it => [it.no, it.position, it.seq, it.sequence, it.sheetNo, it.sample_no, it.sampleNo].some(v => v !== null && v !== undefined));
    if (hasNumericOrder) {
      relevant.sort((a,b) => {
        const getNum = it => {
          const candidates = [it.no, it.position, it.seq, it.sequence, it.sheetNo, it.sample_no, it.sampleNo].map(v => (v === null || v === undefined) ? NaN : Number(v));
          const found = candidates.find(n => !Number.isNaN(n));
          return Number.isFinite(found) ? found : Number.POSITIVE_INFINITY;
        };
        return getNum(a) - getNum(b);
      });
    } else {
      // fallback: use createdAt ascending. If createdAt missing, push to end.
      relevant.sort((a,b) => {
        const ta = a?.createdAt ? Date.parse(a.createdAt) : Number.POSITIVE_INFINITY;
        const tb = b?.createdAt ? Date.parse(b.createdAt) : Number.POSITIVE_INFINITY;
        return ta - tb;
      });
    }

    // helper to extract row 1..3 from item
    const extractRow = (it, usedRows) => {
      // 1) explicit numeric fields
      const numericCandidates = [it.no, it.position, it.seq, it.sequence, it.sheetNo, it.sample_no, it.sampleNo];
      for (const c of numericCandidates) {
        const n = Number(c);
        if (Number.isInteger(n) && n >= 1 && n <= 3 && !usedRows.has(n)) return n;
      }
      // 2) parse any digit 1..3 from testname/remark/title (this catches "*3 Inspection...")
      const text = ((it.testname || '') + ' ' + (it.remark || '') + ' ' + (it.title || '')).toString();
      const m = text.match(/[1-3]/);
      if (m) {
        const n = Number(m[0]);
        if (!usedRows.has(n)) return n;
      }
      // 3) first free row
      for (let r = 1; r <= 3; r++) if (!usedRows.has(r)) return r;
      return null;
    };

    const usedRows = new Set();
    let dataMapped = false;

    // Assign items to rows using above logic and put values into controls
    for (let i = 0; i < relevant.length; i++) {
      const it = relevant[i];
      const row = extractRow(it, usedRows);
      if (!row) continue;
      usedRows.add(row);

      const cfg = rowConfig[row];
      const waterCtrl  = testForm.getControl(cfg.water);
      const ffCtrl     = testForm.getControl(cfg.ff);
      const tfCtrl     = testForm.getControl(cfg.tf);
      const stCtrl     = testForm.getControl(cfg.st);
      const remarkCtrl = testForm.getControl(cfg.remark);

      const setVal = async (ctrl, val) => {
        if (!ctrl) return;
        await ctrl.setValue(val === null || typeof val === 'undefined' ? '' : String(val));
        if (ctrl.redraw) await ctrl.redraw();
      };

      await setVal(waterCtrl, it.watercasting ?? it.water ?? '');
      await setVal(ffCtrl, it.ff ?? '');
      await setVal(tfCtrl, it.tf ?? '');
      await setVal(stCtrl, it.settleduration ?? it.settingtime ?? '');
      await setVal(remarkCtrl, it.remark ?? '');

      dataMapped = true;
    }

    // Clear any rows not assigned (avoid stale values)
    for (let r = 1; r <= 3; r++) {
      if (!usedRows.has(r)) {
        const cfg = rowConfig[r];
        const c1 = testForm.getControl(cfg.water);
        const c2 = testForm.getControl(cfg.ff);
        const c3 = testForm.getControl(cfg.tf);
        const c4 = testForm.getControl(cfg.st);
        const c5 = testForm.getControl(cfg.remark);
        if (c1) { await c1.setValue(''); if (c1.redraw) await c1.redraw(); }
        if (c2) { await c2.setValue(''); if (c2.redraw) await c2.redraw(); }
        if (c3) { await c3.setValue(''); if (c3.redraw) await c3.redraw(); }
        if (c4) { await c4.setValue(''); if (c4.redraw) await c4.redraw(); }
        if (c5) { await c5.setValue(''); if (c5.redraw) await c5.redraw(); }
      }
    }

    // If flags.next === false, show next section
    if (flags?.next === false) {
      const nextSection = FormSectionedTable.getSection('Section92Form');
      if (nextSection) await nextSection.setVisible(true);
    }

    // If data mapped -> show Section101Form and hide Section101NextButton inside testForm
    if (dataMapped) {
      const section101 = FormSectionedTable.getSection('Section101Form');
      if (section101) await section101.setVisible(true);

      const section101NextBtn = testForm.getControl('Section101NextButton');
      if (section101NextBtn) await section101NextBtn.setVisible(false);
    } else {
      const section101NextBtn = testForm.getControl('Section101NextButton');
      if (section101NextBtn && flags?.next === true) await section101NextBtn.setVisible(true);
    }

  } catch (err) {
    // swallow to avoid blocking UI; uncomment next line for debugging
    // console.error('loadSection91Data error:', err);
  }
}
