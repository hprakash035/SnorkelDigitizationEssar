export async function loadSection91Data(pageProxy, qcItem91, FormSectionedTable, attachments, flags, testdataArray) {
  try {
    const Section91 = FormSectionedTable.getSection('Section91Form');
    if (!Section91) {
      throw new Error("Section91Form not found in FormSectionedTable.");
    }
    await Section91.setVisible(true);

    const nextButton = Section91.getControl('Section92NextButton');
    if (nextButton) {
      await nextButton.setVisible(false);

      if (flags?.next === false) {
        const Section91TestNameForm = FormSectionedTable.getSection('Section91TestNameForm');
        if (Section91TestNameForm) {
          await Section91TestNameForm.setVisible(true);
        }

        const Section91TestForm = FormSectionedTable.getSection('Section91TestForm');
        if (Section91TestForm) {
          await Section91TestForm.setVisible(true);
        }
      }
    }

    // --- Meta info controls ---
    const Section91Date31Control = Section91.getControl('Section91Date');
    if (Section91Date31Control && qcItem91.DATE_INSPECTED) {
      await Section91Date31Control.setValue(qcItem91.DATE_INSPECTED);
    }

    const Section91InspectedBy31Control = Section91.getControl('Section91InspectedBy');
    if (Section91InspectedBy31Control && qcItem91.INSPECTED_BY) {
      await Section91InspectedBy31Control.setValue([qcItem91.INSPECTED_BY]);
    }

    const Section91InspectionMethod31Control = Section91.getControl('Section91Method');
    if (Section91InspectionMethod31Control && qcItem91.METHOD) {
      await Section91InspectionMethod31Control.setValue(qcItem91.METHOD);
    }

    const Section91DecisionTaken31Control = Section91.getControl('Section91DecisionTaken');
    if (Section91DecisionTaken31Control && qcItem91.DECISION_TAKEN) {
      await Section91DecisionTaken31Control.setValue([qcItem91.DECISION_TAKEN]);
    }

    // --- Handle Section91TestForm ---
    const testForm = FormSectionedTable.getSection('Section91TestForm');
    if (!testForm) {
      return;
    }
    await testForm.setVisible(true);

    // Helper for null-safe values
    const safeVal = (val) => {
      if (val === null || val === undefined || val === 'null' || val === 'undefined') {
        return '';
      }
      return String(val).trim();
    };

    // ✅ Collect all "outer castable workablity" tests
    const parsedTestDataArray = testdataArray
      .filter(item => (item.testname || '').toLowerCase().includes('outer castable workablity'))
      .map(item => ({
        batchNo: safeVal(item.batchNo),
        water: safeVal(item.watercasting || item.water),
        ff1: safeVal(item.ff1),
        ff2: safeVal(item.ff2),
        tf1: safeVal(item.tf1),
        tf2: safeVal(item.tf2),
        settingtime: safeVal(item.settleduration || item.settingtime),
        remark: safeVal(item.remark)
      }));

    // console.log("✅ Parsed Section91 data:", parsedTestDataArray);

    // 🔗 Control mapping for 3 rows (full set)
    const rowConfig = [
      {
        batchNo: 'Section91TestBatchNo1',
        water: 'Section91TestWaterCasteing1',
        ff1: 'Section91FF1',
        ff2: 'Section91FF12',
        tf1: 'Section91TF1',
        tf2: 'Section91TF12',
        st: 'Section91SettingTime1',
        remark: 'Section91TestRemark1'
      },
      {
        batchNo: 'Section91TestBatchNo2',
        water: 'Section91TestWaterCasteing2',
        ff1: 'Section91FF2',
        ff2: 'Section91FF22',
        tf1: 'Section91TF2',
        tf2: 'Section91TF22',
        st: 'Section91SettingTime2',
        remark: 'Section91TestRemark2'
      },
      {
        batchNo: 'Section91TestBatchNo3',
        water: 'Section91TestWaterCasteing3',
        ff1: 'Section91FF3',
        ff2: 'Section91FF32',
        tf1: 'Section91TF3',
        tf2: 'Section91TF32',
        st: 'Section91SettingTime3',
        remark: 'Section91TestRemark3'
      }
    ];

    let dataMapped = false;

    // ✅ Map each entry sequentially
    for (let idx = 0; idx < parsedTestDataArray.length; idx++) {
      const test = parsedTestDataArray[idx];
      const config = rowConfig[idx];
      if (!config) continue;

      const batchCtrl = testForm.getControl(config.batchNo);
      const waterCtrl = testForm.getControl(config.water);
      const ff1Ctrl = testForm.getControl(config.ff1);
      const ff2Ctrl = testForm.getControl(config.ff2);
      const tf1Ctrl = testForm.getControl(config.tf1);
      const tf2Ctrl = testForm.getControl(config.tf2);
      const stCtrl = testForm.getControl(config.st);
      const remarkCtrl = testForm.getControl(config.remark);

      if (batchCtrl) { await batchCtrl.setValue(test.batchNo); await batchCtrl.redraw(); dataMapped = true; }
      if (waterCtrl) { await waterCtrl.setValue(test.water); await waterCtrl.redraw(); dataMapped = true; }
      if (ff1Ctrl)   { await ff1Ctrl.setValue(test.ff1); await ff1Ctrl.redraw(); dataMapped = true; }
      if (ff2Ctrl)   { await ff2Ctrl.setValue(test.ff2); await ff2Ctrl.redraw(); dataMapped = true; }
      if (tf1Ctrl)   { await tf1Ctrl.setValue(test.tf1); await tf1Ctrl.redraw(); dataMapped = true; }
      if (tf2Ctrl)   { await tf2Ctrl.setValue(test.tf2); await tf2Ctrl.redraw(); dataMapped = true; }
      if (stCtrl)    { await stCtrl.setValue(test.settingtime); await stCtrl.redraw(); dataMapped = true; }
      if (remarkCtrl){ await remarkCtrl.setValue(test.remark); await remarkCtrl.redraw(); dataMapped = true; }
    }

    // Handle Next button visibility for Section92
    const nextButtonTest = testForm.getControl('Section101NextButton');
    if (nextButtonTest && flags?.next === false) {
      const nextSection = FormSectionedTable.getSection('Section92Form');
      if (nextSection) {
        await nextSection.setVisible(true);
      }
    }

    // ✅ If data mapped, show Section101Form & hide its Next button
    if (dataMapped) {
      const section101 = FormSectionedTable.getSection('Section101Form');
      if (section101) {
        await section101.setVisible(true);
      }
      const section101NextBtn = FormSectionedTable.getControl('Section101NextButton');
      if (section101NextBtn) {
        await section101NextBtn.setVisible(false);
      }
    }

  } catch (error) {
    console.error("❌ Error in loadSection91Data:", error);
  }
}