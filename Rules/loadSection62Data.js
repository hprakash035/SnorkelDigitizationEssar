export async function loadSection62Data(pageProxy, qcItem62, FormSectionedTable, attachments = [], flags, testdataArray = []) {
    try {
        const section63 = FormSectionedTable.getSection('Section62Form');
        if (!section63) {
            throw new Error("Section 62 Form not found in FormSectionedTable.");
        }
        await section63.setVisible(true);

        // Handling the "Next" button visibility
        const nextButton = section63.getControl('Section63NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                const Section63StaticImage = FormSectionedTable.getSection('Section63StaticImage');
                if (Section63StaticImage) {
                    Section63StaticImage.setVisible(true);
                }
            }
        } else {
            console.warn('⚠️ Section63NextButton control not found');
        }

        const setValueIfPresent = async (controlName, value) => {
            const control = section63.getControl(controlName);
            if (control && value !== undefined) {
                await control.setValue(value);
            }
        };

        await setValueIfPresent('Section62Date', qcItem62.DATE_INSPECTED);
        await setValueIfPresent('Section62InspectedBy', qcItem62.INSPECTED_BY);
        await setValueIfPresent('Section62Method', qcItem62.METHOD);
        await setValueIfPresent('Section62DecisionTaken', qcItem62.DECISION_TAKEN);

        const dynamicImageSection = FormSectionedTable.getSection('Section63DynamicImage');
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

            const Section63UserInputImage = FormSectionedTable.getSection('Section63UserInputImage');
            if (Section63UserInputImage) {
                Section63UserInputImage.setVisible(true);
            }
        }

        const testForm = FormSectionedTable.getSection('Section63TestForm');
        const testFormName = FormSectionedTable.getSection('Section63TestName');
        if (!testForm) {
            return;
        }
        await testFormName.setVisible(true);
        await testForm.setVisible(true);

        const parsedTestDataArray = testdataArray
            .filter(item => {
                const name = item.testname?.toLowerCase() || '';
                return name.includes('height measurement for steel mesh') && name.includes('y studs');
            })
            .map(item => {
                const pos = (item.position || '').toLowerCase();
                let type = null;
                if (pos.includes('mesh')) type = 'Mesh';
                else if (pos.includes('studs')) type = 'Studs';

                if (!type) {
                    return null;
                }

                return {
                    type,
                    position: item.position,
                    tolerance: item.tolerance,
                    actualvalue: item.actualvalue
                };
            })
            .filter(Boolean);

        const testDataConfig = [
            { type: 'Mesh', positionField: 'Section63TestPositionMesh', toleranceField: 'Section63TestToleranceMesh', actualField: 'Section63TestActualMesh' },
            { type: 'Studs', positionField: 'Section63TestPositionStuds', toleranceField: 'Section63TestToleranceStuds', actualField: 'Section63TestActualStuds' }
        ];

        for (const config of testDataConfig) {
            const { type, positionField, toleranceField, actualField } = config;
            const test = parsedTestDataArray.find(t => t.type === type);

            const positionControl = testForm.getControl(positionField);
            const toleranceControl = testForm.getControl(toleranceField);
            const actualControl = testForm.getControl(actualField);

            if (test) {
                if (positionControl) { await positionControl.setValue(test.position || ''); await positionControl.redraw(); }
                if (toleranceControl) { await toleranceControl.setValue(test.tolerance || ''); await toleranceControl.redraw(); }
                if (actualControl)   { await actualControl.setValue(test.actualvalue || ''); await actualControl.redraw(); }
            }

            const nextButton2 = testForm.getControl('Section63TestNextButton');
            if (nextButton2) {
                // Only hide the button if the parsedTestDataArray has data
                if (parsedTestDataArray.length > 0) {
                    await nextButton2.setVisible(false);
                }
            }
        }

        // Make Section63Form visible if there's test data
        const Section63Form = FormSectionedTable.getSection('Section63Form');
        if (Section63Form) {
            if (parsedTestDataArray.length > 0) {
                await Section63Form.setVisible(true);
            } else {
                await Section63Form.setVisible(false);
            }
        }

    } catch (error) {
        console.error("❌ Error in loadSection62Data:", error);
    }
}
