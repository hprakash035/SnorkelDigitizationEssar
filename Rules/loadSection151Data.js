export async function loadSection151Data(pageProxy, qcItem151, FormSectionedTable, attachments = [], flags, testdataArray = []) {
    try {
        const Section151 = FormSectionedTable.getSection('Section151Form');
        if (!Section151) throw new Error("❌ Section151Form not found in FormSectionedTable.");

        await Section151.setVisible(true);

        // Hide next button
        const nextButton = Section151.getControl('Sectiopn151TestNextButton');
        if (nextButton) {
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                const Section151TestForm = FormSectionedTable.getSection('Section151TestForm');
                if (Section151TestForm) {
                    await Section151TestForm.setVisible(true);
                }
            }
        }

        // Helper for setting values safely
        const setValueIfPresent = async (section, controlName, value) => {
            const control = section?.getControl(controlName);
            if (control && value !== undefined && value !== null) {
                await control.setValue(value);
            }
        };

        // --- Header values ---
        await setValueIfPresent(Section151, 'Section151Date', qcItem151?.DATE_INSPECTED);
        await setValueIfPresent(Section151, 'Section151InspectedBy', qcItem151?.INSPECTED_BY ? [qcItem151.INSPECTED_BY] : undefined);
        await setValueIfPresent(Section151, 'Section151Method', qcItem151?.METHOD);
        await setValueIfPresent(Section151, 'Section151DecisionTaken', qcItem151?.DECISION_TAKEN ? [qcItem151.DECISION_TAKEN] : undefined);

        // --- Test Form values ---
         FormSectionedTable.getSection('Section151FormName').setVisible(true);
        const testForm = FormSectionedTable.getSection('Section151TestForm');
        if (testForm && testdataArray.length > 0) {
            const tests = testdataArray.filter(t =>
                t.testname?.includes("Inspection result of outer castable workablity")
            );

            for (let i = 0; i < Math.min(tests.length, 3); i++) {
                const test = tests[i];
                const suffix = i + 1;

                await setValueIfPresent(testForm, `Section151WaterCasting${suffix}`, test.watercasting);
                await setValueIfPresent(testForm, `Section151FF${suffix}`, test.ff);
                await setValueIfPresent(testForm, `Section151TF${suffix}`, test.tf);
                await setValueIfPresent(testForm, `Section151SettingTime${suffix}`, test.settleduration);
                await setValueIfPresent(testForm, `Section151Remark${suffix}`, test.remark);
            }
        }
         const Section161Form = FormSectionedTable.getSection('Section161Form');
                if (Section161Form) {
                    await Section161Form.setVisible(true);
                }
        console.log("✅ loadSection151Data completed successfully");
    } catch (error) {
        console.error("❌ Error in loadSection151Data:", error);
    }
}
