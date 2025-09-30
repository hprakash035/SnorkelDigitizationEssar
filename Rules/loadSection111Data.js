export async function loadSection111Data(pageProxy, qcItem111, FormSectionedTable, attachments, flags, testdataArray) {
  try {
    const Section111 = FormSectionedTable.getSection('Section111Form');
    if (!Section111) throw new Error("❌ Section111Form not found in FormSectionedTable.");
    await Section111.setVisible(true);

    // --- Handle Next button ---
    const nextButton = Section111.getControl('Section111TestNextButton');
    if (nextButton) {
      await nextButton.setVisible(false);

      if (flags?.next === false) {
        const Section111TestFormName = FormSectionedTable.getSection('Section111TestFormName');
        if (Section111TestFormName) await Section111TestFormName.setVisible(true);

        const Section111TestForm = FormSectionedTable.getSection('Section111TestForm');
        if (Section111TestForm) await Section111TestForm.setVisible(true);
      }
    }

    // --- Meta info controls ---
    const dateCtrl = Section111.getControl('Section111Date');
    if (dateCtrl && qcItem111.DATE_INSPECTED) await dateCtrl.setValue(qcItem111.DATE_INSPECTED);

    const inspectedByCtrl = Section111.getControl('Section111InspectedBy');
    if (inspectedByCtrl && qcItem111.INSPECTED_BY) await inspectedByCtrl.setValue([qcItem111.INSPECTED_BY]);

    const methodCtrl = Section111.getControl('Section111InspectionMethod');
    if (methodCtrl && qcItem111.METHOD) await methodCtrl.setValue(qcItem111.METHOD);

    const decisionCtrl = Section111.getControl('Section111DecisionTaken');
    if (decisionCtrl && qcItem111.DECISION_TAKEN) await decisionCtrl.setValue([qcItem111.DECISION_TAKEN]);

    // --- Handle Section111TestForm ---
    const testForm = FormSectionedTable.getSection('Section111TestForm');
    if (!testForm) return;
    await testForm.setVisible(true);

    // Helper for safe values
    const safeVal = (val) => {
      if (val === null || val === undefined || val === 'null' || val === 'undefined') {
        return '';
      }
      return String(val).trim();
    };

    // ✅ Collect MOR test results
    let morTests = testdataArray.filter(item =>
      (item.testname || '').toLowerCase().includes("mor test result")
    );

    // Sort by specification (numeric first, else alphabetic)
    morTests = morTests.sort((a, b) => {
      const specA = a.specification;
      const specB = b.specification;
      const numA = parseFloat(specA);
      const numB = parseFloat(specB);
      const isNumA = !isNaN(numA);
      const isNumB = !isNaN(numB);

      if (isNumA && isNumB) return numA - numB;
      return String(specA).localeCompare(String(specB));
    });

    let dataMapped = false;

    // 🔗 Map max 4 MOR test rows
    for (let i = 0; i < Math.min(morTests.length, 4); i++) {
      const test = morTests[i];
      const suffix = i + 1;

      const setFormValue = async (ctrl, val) => {
        const c = testForm.getControl(ctrl);
        if (c) {
          await c.setValue(safeVal(val));
          await c.redraw();
          dataMapped = true;
        }
      };

      await setFormValue(`Section111TestDate${suffix}`, test.date);
      await setFormValue(`Section111TestSpecification${suffix}`, test.specification);
      await setFormValue(`Section111TestMethod${suffix}`, test.method);
      await setFormValue(`Section111TestActualValue${suffix}`, test.actualvalue);
    }

    // --- Handle Section112 visibility if data is mapped ---
    if (dataMapped) {
      const nextBtn112 =  FormSectionedTable.getSection('Section111TestForm')?.getControl('Section112NextButton');
      if (nextBtn112) await nextBtn112.setVisible(false);
      const Section112Form = FormSectionedTable.getSection('Section112Form');
      if (Section112Form) await Section112Form.setVisible(true);

      // Hide Section112 Next button if exists
      
    }

  } catch (error) {
    console.error("❌ Error in loadSection111Data:", error);
  }
}