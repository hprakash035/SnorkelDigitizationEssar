export async function loadSection102Data(pageProxy, qcItem102, FormSectionedTable, attachments = [], flags, testdataArray = []) {
    try {
        const Section102 = FormSectionedTable.getSection('Section102Form');
        if (!Section102) throw new Error("❌ Section102Form not found in FormSectionedTable.");

        await Section102.setVisible(true);

        const hideNextButton = async (section, buttonName) => {
            if (section) {
                const btn = section.getControl(buttonName);
                if (btn) {
                    await btn.setVisible(false);
                    // console.log(`🚫 Hidden ${buttonName}`);
                }
            }
        };

        // -------------------------------
        // Metadata population
        // -------------------------------
        let hasMetadata = false;
        const setValueIfPresent = async (controlName, value) => {
            const control = Section102.getControl(controlName);
            if (control && value !== undefined && value !== null) {
                await control.setValue(value);
                hasMetadata = true;
            }
        };

        await setValueIfPresent('Section102Date', qcItem102.DATE_INSPECTED);
        await setValueIfPresent('Section102InspectedBy', qcItem102.INSPECTED_BY ? [qcItem102.INSPECTED_BY] : undefined);
        await setValueIfPresent('Section102Method', qcItem102.METHOD);
        await setValueIfPresent('Section102DecisionTaken', qcItem102.DECISION_TAKEN ? [qcItem102.DECISION_TAKEN] : undefined);

        if (hasMetadata) {
            await hideNextButton(Section102, "Section102TestNextButton");
        }

        // -------------------------------
        // Image handling
        // -------------------------------
        FormSectionedTable.getSection('Section102StaticImage').setVisible(true);
        const dynamicImageSection = FormSectionedTable.getSection('Section102DynamicImage');
        const Section102UserInputImage = FormSectionedTable.getSection('Section102UserInputImage');
        const binding = pageProxy.getBindingObject();

        let hasDynamicImage = false;

        if (dynamicImageSection && attachments.length > 0) {
            const firstAttachment = attachments[0];
            const base64 = firstAttachment?.file;
            const mimeType = firstAttachment?.mimeType || 'image/png';

            if (base64 && base64.length > 100) {
                binding.imageUri = `data:${mimeType};base64,${base64}`;
                await dynamicImageSection.setVisible(true);
                await dynamicImageSection.redraw();

                hasDynamicImage = true;

                if (Section102UserInputImage) {
                    await Section102UserInputImage.setVisible(false);
                }
            }
        }

        if (!hasDynamicImage) {
            binding.imageUri = '/TRL_Snorkel_Digitization_TSL/Images/NoImageAvailable.png';
            await dynamicImageSection?.setVisible(false);
            await dynamicImageSection?.redraw();

            if (Section102UserInputImage) {
                await Section102UserInputImage.setVisible(true);
            }
        }

        // -------------------------------
        // Mixing Test
        // -------------------------------
        const Section102TestForm = FormSectionedTable.getSection('Section102TestForm');
        if (Section102TestForm) {
            const Section102TestFormName = FormSectionedTable.getSection('Section102TestFormName');
            await Section102TestFormName?.setVisible(true);
            await Section102TestForm.setVisible(true);

            const mixingTests = testdataArray.filter(t =>
                t.testname?.includes("mixing the outer castable")
            );

            if (mixingTests.length > 0) {
                for (let i = 0; i < Math.min(mixingTests.length, 5); i++) {
                    const test = mixingTests[i];
                    const suffix = i + 1;

                    const setFormValue = async (ctrl, val) => {
                        const c = Section102TestForm.getControl(ctrl);
                        if (c && val !== undefined && val !== null) {
                            await c.setValue(val);
                        }
                    };

                    await setFormValue(`Section102TestBatchNo${suffix}`, test.batchNo);
                    await setFormValue(`Section102PowerWeight${suffix}`, test.powderweight);
                    await setFormValue(`Section102WaterCasting${suffix}`, test.watercasting);
                    await setFormValue(`Section102FludityOfCastable${suffix}`, test.fluidity ? [test.fluidity] : []);
                    await setFormValue(`Section102AddingVibration${suffix}`, test.vibration);
                    await setFormValue(`Section102Remark${suffix}`, test.remark);
                }

                // hide NEXT only if mixing data exists
                await hideNextButton(Section102TestForm, "Section102Test2NextButton");
            }
        }

        // -------------------------------
        // Gap Measurement Tests
        // -------------------------------
        const gapFormHeader = FormSectionedTable.getSection('Section102TestFormName2');
        const gapForm = FormSectionedTable.getSection('Section102Test2Form');

        let hasGapData = false;

        if (hasDynamicImage && gapForm && gapFormHeader) {
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
                if (ctrl && gap.actualvalue) {
                    await ctrl.setValue(gap.actualvalue);
                    hasGapData = true;
                }
            }

            if (hasGapData) {
                await hideNextButton(gapForm, "Section102StaticNextButton");
            }
        } else {
            await gapFormHeader?.setVisible(false);
            await gapForm?.setVisible(false);
        }

        // -------------------------------
        // Section 103 visibility
        // -------------------------------
        const Section103Form = FormSectionedTable.getSection('Section103Form');
        if (Section103Form) {
            await Section103Form.setVisible(hasGapData);
        }

        // console.log("✅ loadSection102Data completed successfully");
    } catch (error) {
        // console.error("❌ Error in loadSection102Data:", error);
    }
}
