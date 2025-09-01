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
                // Show test forms
                const Section102TestFormName = FormSectionedTable.getSection('Section102TestFormName');
                const Section102TestForm = FormSectionedTable.getSection('Section102TestForm');
                await Section102TestFormName?.setVisible(true);
                await Section102TestForm?.setVisible(true); const Section63StaticImage = FormSectionedTable.getSection('Section102StaticImage');
                if (Section63StaticImage) {
                    Section63StaticImage.setVisible(true);
                }
            }
        }

    
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

        const dynamicImageSection = FormSectionedTable.getSection('Section102DynamicImage');
        const binding = pageProxy.getBindingObject();

        if (dynamicImageSection && attachments.length > 0) {
            const firstAttachment = attachments[0];
            const base64 = firstAttachment?.file;
            const mimeType = firstAttachment?.mimeType || 'image/png';

            if (base64 && base64.length > 100) {
                binding.imageUri = `data:${mimeType};base64,${base64}`;
                dynamicImageSection.setVisible(true);
                dynamicImageSection.redraw();
            } else {
                binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
                dynamicImageSection.setVisible(false);
                dynamicImageSection.redraw();
            }
        } else {
            binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
            dynamicImageSection?.setVisible(false);
            dynamicImageSection?.redraw();

            const Section102UserInputImage = FormSectionedTable.getSection('Section102UserInputImage');
            if (Section102UserInputImage) {
                Section102UserInputImage.setVisible(true);
            }
        }

        // --- Load Mixing Test values (*4 Actual situation...) ---
        const testForm = FormSectionedTable.getSection('Section102TestForm');
        if (testForm && testdataArray.length > 0) {
            const mixingTests = testdataArray.filter(t =>
                t.testname?.includes("mixing the outer castable")
            );

            for (let i = 0; i < Math.min(mixingTests.length, 5); i++) {
                const test = mixingTests[i];
                const suffix = i + 1;

                const setFormValue = async (ctrl, val) => {
                    const c = testForm.getControl(ctrl);
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
        }

        // --- Load Gap Measurement tests (*5 The gap between...) ---
        const gapFormHeader = FormSectionedTable.getSection('Section102TestFormName2');
        const gapForm = FormSectionedTable.getSection('Section102Test2Form');
        if (gapForm && gapFormHeader) {
            await gapFormHeader.setVisible(true);
            await gapForm.setVisible(true);

            const positionMap = {
                "12:00 direction": "A",
                "3:00 direction": "B",
                "6:00 direction": "C",
                "9:00 direction": "D"
            };

            const gapTests = testdataArray.filter(t =>
                t.testname?.includes("gap between the top")
            );

            for (const gap of gapTests) {
                const suffix = positionMap[gap.position];
                if (!suffix) continue;

                const ctrl = gapForm.getControl(`Section102TestActualGap${suffix}`);
                if (ctrl) await ctrl.setValue(gap.actualvalue);
            }
        }
    const Section111Form =FormSectionedTable.getSection('Section103Form');
    Section111Form.setVisible('true');
        // console.log('✅ loadSection102Data completed successfully');
    } catch (error) {
        console.error("❌ Error in loadSection102Data:", error);
    }
}
