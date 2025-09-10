export async function loadSection102Data(pageProxy, qcItem102, FormSectionedTable, attachments = [], flags, testdataArray = []) {
    try {
        const Section102 = FormSectionedTable.getSection('Section102Form');
        if (!Section102) throw new Error("❌ Section102Form not found in FormSectionedTable.");
        await Section102.setVisible(true);

        // Hide Next button if exists
        const nextButton = Section102.getControl('Section102TestNextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            if (flags?.next === false) {
                await FormSectionedTable.getSection('Section102TestFormName')?.setVisible(true);
                await FormSectionedTable.getSection('Section102TestForm')?.setVisible(true);
                await FormSectionedTable.getSection('Section102StaticImage')?.setVisible(true);
            }
        }

        // --- Load Header values ---
        const setValueIfPresent = async (controlName, value) => {
            const control = Section102.getControl(controlName);
            if (control && value !== undefined && value !== null) {
                await control.setValue(value);
            }
        };
        await setValueIfPresent('Section102Date', qcItem102.DATE_INSPECTED);
        await setValueIfPresent('Section102InspectedBy', qcItem102.INSPECTED_BY ? [qcItem102.INSPECTED_BY] : undefined);
        await setValueIfPresent('Section102Method', qcItem102.METHOD);
        await setValueIfPresent('Section102DecisionTaken', qcItem102.DECISION_TAKEN ? [qcItem102.DECISION_TAKEN] : undefined);

        const binding = pageProxy.getBindingObject();
        const dynamicImageSection = FormSectionedTable.getSection('Section102DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section102UserInputImage');

        // --- Step 1: Load Test Form 1 (Mixing Tests) ---
        const testForm1 = FormSectionedTable.getSection('Section102TestForm');
        const mixingTests = testdataArray.filter(t => t.testname?.includes("mixing the outer castable"));

        let test1Loaded = false;
        if (testForm1 && mixingTests.length > 0) {
            for (let i = 0; i < Math.min(mixingTests.length, 5); i++) {
                const test = mixingTests[i];
                const suffix = i + 1;

                const setFormValue = async (ctrl, val) => {
                    const c = testForm1.getControl(ctrl);
                    if (c && val !== undefined && val !== null) {
                        await c.setValue(val);
                    }
                };

                await setFormValue(`Section102PowerWeight${suffix}`, test.powderweight);
                await setFormValue(`Section102WaterCasting${suffix}`, test.watercasting);
                await setFormValue(`Section102FludityOfCastable${suffix}`, test.fluidity ? [test.fluidity] : []);
                await setFormValue(`Section102AddingVibration${suffix}`, test.vibration);
                await setFormValue(`Section102Remark${suffix}`, test.remark);
            }
            test1Loaded = true;
        }

        // --- Step 2: Check for User Image ---
        let userImagePresent = false;
        if (attachments.length > 0 && attachments[0]?.file?.length > 100) {
            const firstAttachment = attachments[0];
            const base64 = firstAttachment.file;
            const mimeType = firstAttachment.mimeType || 'image/png';

            binding.imageUri = `data:${mimeType};base64,${base64}`;
            dynamicImageSection?.setVisible(true);
            dynamicImageSection?.redraw();
            userImagePresent = true;
        } else {
            binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
            dynamicImageSection?.setVisible(false);
            dynamicImageSection?.redraw();
            userInputImageSection?.setVisible(true);
        }

        // --- Step 3: If user image exists, check Test Form 2 ---
        if (userImagePresent) {
            const gapFormHeader = FormSectionedTable.getSection('Section102TestFormName2');
            const gapForm = FormSectionedTable.getSection('Section102Test2Form');

            const gapTests = testdataArray.filter(t => t.testname?.includes("gap between the top"));
            if (gapForm && gapFormHeader) {
                await gapFormHeader.setVisible(true);
                await gapForm.setVisible(true);

                if (gapTests.length > 0) {
                    const positionMap = {
                        "12:00 direction": "A",
                        "3:00 direction": "B",
                        "6:00 direction": "C",
                        "9:00 direction": "D"
                    };

                    for (const gap of gapTests) {
                        const suffix = positionMap[gap.position];
                        if (!suffix) continue;

                        const ctrl = gapForm.getControl(`Section102TestActualGap${suffix}`);
                        if (ctrl) await ctrl.setValue(gap.actualvalue);
                    }
                }
                // else: just show empty controls for user to fill
            }
        }

        // --- Finally move to Section103 ---
        const Section103Form = FormSectionedTable.getSection('Section103Form');
        Section103Form?.setVisible(true);

    } catch (error) {
        console.error("❌ Error in loadSection102Data:", error);
    }
}
