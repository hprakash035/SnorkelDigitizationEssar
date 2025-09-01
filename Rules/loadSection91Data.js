export async function loadSection91Data(pageProxy, qcItem91, FormSectionedTable, attachments, flags, testdataArray) {
  try {
    // console.log("Loading Section91Data...");

    const Section91 = FormSectionedTable.getSection('Section91Form');
    if (!Section91) {
      // console.error("❌ Section91Form not found in FormSectionedTable.");
      throw new Error("Section91Form not found in FormSectionedTable.");
    }

    // console.log("Section91Form found, setting visibility to true.");
    await Section91.setVisible(true);

    const nextButton = Section91.getControl('Section92NextButton');
    if (nextButton) {
      // console.log("Next button found, setting visibility to false.");
      await nextButton.setVisible(false);

      if (flags?.next === false) {
        // console.log("Flags indicate next button should be hidden, showing additional sections.");
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
      // console.log(`Setting Section91Date with value: ${qcItem91.DATE_INSPECTED}`);
      await Section91Date31Control.setValue(qcItem91.DATE_INSPECTED);
    }

    const Section91InspectedBy31Control = Section91.getControl('Section91InspectedBy');
    if (Section91InspectedBy31Control && qcItem91.INSPECTED_BY) {
      // console.log(`Setting Section91InspectedBy with value: ${qcItem91.INSPECTED_BY}`);
      await Section91InspectedBy31Control.setValue([qcItem91.INSPECTED_BY]);
    }

    const Section91InspectionMethod31Control = Section91.getControl('Section91Method');
    if (Section91InspectionMethod31Control && qcItem91.METHOD) {
      // console.log(`Setting Section91Method with value: ${qcItem91.METHOD}`);
      await Section91InspectionMethod31Control.setValue(qcItem91.METHOD);
    }

    const Section91DecisionTaken31Control = Section91.getControl('Section91DecisionTaken');
    if (Section91DecisionTaken31Control && qcItem91.DECISION_TAKEN) {
      // console.log(`Setting Section91DecisionTaken with value: ${qcItem91.DECISION_TAKEN}`);
      await Section91DecisionTaken31Control.setValue([qcItem91.DECISION_TAKEN]);
    }

    // --- Handle Section91TestForm ---
    const testForm = FormSectionedTable.getSection('Section91TestForm');
    if (!testForm) {
      // console.error('❌ Section91TestForm not found!');
      return;
    }
    await testForm.setVisible(true);

    // ✅ Collect all "*3 Inspection result..." tests
    const parsedTestDataArray = testdataArray
      .filter(item => (item.testname || '').toLowerCase().includes('outer castable workablity'))
      .map(item => ({
        water: item.watercasting || '',         // ✅ FIXED
        ff: item.ff || '',
        tf: item.tf || '',
        settingtime: item.settleduration || '', // ✅ FIXED
        remark: item.remark || ''
      }));

    // 🔗 Control mapping for 3 rows
    const rowConfig = [
      { water: 'Section91TestWaterCasteing1', ff: 'Section91FF1', tf: 'Section91TF1', st: 'Section91SettingTime1', remark: 'Section91TestRemark1' },
      { water: 'Section91TestWaterCasteing2', ff: 'Section91FF2', tf: 'Section91TF2', st: 'Section91SettingTime2', remark: 'Section91TestRemark2' },
      { water: 'Section91TestWaterCasteing3', ff: 'Section91FF3', tf: 'Section91TF3', st: 'Section91SettingTime3', remark: 'Section91TestRemark3' }
    ];

    let dataMapped = false;

    // ✅ Map each entry sequentially
    for (let idx = 0; idx < parsedTestDataArray.length; idx++) {
      const test = parsedTestDataArray[idx];
      const config = rowConfig[idx];
      if (!config) continue;

      // console.log(`ℹ️ Setting values for row ${idx + 1}`, test);

      const waterCtrl = testForm.getControl(config.water);
      const ffCtrl = testForm.getControl(config.ff);
      const tfCtrl = testForm.getControl(config.tf);
      const stCtrl = testForm.getControl(config.st);
      const remarkCtrl = testForm.getControl(config.remark);

      if (waterCtrl) { await waterCtrl.setValue(test.water); await waterCtrl.redraw(); dataMapped = true; }
      if (ffCtrl)    { await ffCtrl.setValue(test.ff); await ffCtrl.redraw(); dataMapped = true; }
      if (tfCtrl)    { await tfCtrl.setValue(test.tf); await tfCtrl.redraw(); dataMapped = true; }
      if (stCtrl)    { await stCtrl.setValue(test.settingtime); await stCtrl.redraw(); dataMapped = true; }
      if (remarkCtrl){ await remarkCtrl.setValue(test.remark); await remarkCtrl.redraw(); dataMapped = true; }
    }

    // Handle Next button visibility for Section92
    const nextButtonTest = testForm.getControl('Section101NextButton');
    if (nextButtonTest && flags?.next === false) {
      // console.log("Flags indicate next button hidden, showing Section92Form.");
      const nextSection = FormSectionedTable.getSection('Section92Form');
      if (nextSection) {
        await nextSection.setVisible(true);
      }
    }

    // ✅ NEW: If data mapped, show Section101Form & hide its Next button
    if (dataMapped) {
      // console.log("✅ Data mapped for Section91, showing Section101Form and hiding Section101NextButton.");
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
    // console.error("Error in loadSection91Data:", error);
  }
}
