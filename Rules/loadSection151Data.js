export async function loadSection151Data(pageProxy, qcItem151, FormSectionedTable, attachments = [], flags, testdataArray = []) {
    try {
        const Section151 = FormSectionedTable.getSection('Section151Form');
        if (!Section151) throw new Error("❌ Section151Form not found in FormSectionedTable.");

        await Section151.setVisible(true);

        // --- Helper Functions ---
        const setValueIfPresent = async (section, controlName, value) => {
            const control = section?.getControl(controlName);
            if (control && value !== undefined && value !== null) {
                await control.setValue(value);
            }
        };

        const setButtonVisibility = async (section, buttonName, visible) => {
            const button = section?.getControl(buttonName);
            if (button) {
                await button.setVisible(visible);
            }
        };

        // --- Header Values ---
        let headerHasData = false;

        if (qcItem151?.DATE_INSPECTED) {
            await setValueIfPresent(Section151, 'Section151Date', qcItem151.DATE_INSPECTED);
            headerHasData = true;
        }
        if (qcItem151?.INSPECTED_BY) {
            await setValueIfPresent(Section151, 'Section151InspectedBy', [qcItem151.INSPECTED_BY]);
            headerHasData = true;
        }
        if (qcItem151?.METHOD) {
            await setValueIfPresent(Section151, 'Section151Method', qcItem151.METHOD);
            headerHasData = true;
        }
        if (qcItem151?.DECISION_TAKEN) {
            await setValueIfPresent(Section151, 'Section151DecisionTaken', [qcItem151.DECISION_TAKEN]);
            headerHasData = true;
        }

        // --- Control Next Button visibility based on header data ---
        await setButtonVisibility(Section151, 'Sectiopn151TestNextButton', !headerHasData);

        // --- Test Form Section ---
        let testHasData = false;
         const testForm = FormSectionedTable.getSection('Section151TestForm');
        const Section151FormName = FormSectionedTable.getSection('Section151FormName');

        if (headerHasData && testForm) {
            await testForm.setVisible(true);
             await Section151FormName.setVisible(true);

            if (testdataArray.length > 0) {
                const tests = testdataArray.filter(t =>
                    t.testname?.includes("*9 Inspection result of outer castable workablity")
                );

                for (let i = 0; i < Math.min(tests.length, 3); i++) {
                    const test = tests[i];
                    const suffix = i + 1;

                    await setValueIfPresent(testForm, `Section151TestBatchNo${suffix}`, test.batchNo);
                    await setValueIfPresent(testForm, `Section151TestWaterCasteing${suffix}`, test.watercasting);
                    await setValueIfPresent(testForm, `Section151FF${suffix}`, test.ff1);
                    await setValueIfPresent(testForm, `Section151FF${suffix}2`, test.ff2);
                    await setValueIfPresent(testForm, `Section151TF${suffix}`, test.tf1);
                    await setValueIfPresent(testForm, `Section151TF${suffix}2`, test.tf2);
                    await setValueIfPresent(testForm, `Section151SettingTime${suffix}`, test.settleduration);
                    await setValueIfPresent(testForm, `Section151TestRemark${suffix}`, test.remark);

                    testHasData = true;
                }
            }

            // Optional: You could control visibility of a next button inside the testForm if needed
            await setButtonVisibility(testForm, 'Section161NextButton', !testHasData);
        }

        // --- Section 161 Visibility ---
        const Section161Form = FormSectionedTable.getSection('Section161Form');
        if (Section161Form) {
            await Section161Form.setVisible(testHasData);
        }

        // console.log("✅ loadSection151Data executed: headerHasData =", headerHasData, "| testHasData =", testHasData);
    } catch (error) {
         console.error("❌ Error in loadSection151Data:", error);
    }
}