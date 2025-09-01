export async function loadSection41Data(pageProxy, qcItem41, FormSectionedTable, attachments = [], flags, testdataArray = []) {
    try {
        // console.log('🚀 Running loader for section 4.1...');

        const section41 = FormSectionedTable.getSection('Section41Form');
        if (!section41) throw new Error("Section 41 Form not found in FormSectionedTable.");

        await section41.setVisible(true);

        const nextButton = section41.getControl('Section41NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                const Section41StaticImage = FormSectionedTable.getSection('Section41StaticImage');
                Section41StaticImage?.setVisible(true);
            }
        }

        // Set form control values
        const setValueIfPresent = async (controlName, value) => {
            const control = section41.getControl(controlName);
            if (control && value !== undefined) {
                await control.setValue(value);
            }
        };

        await setValueIfPresent('Section41Date', qcItem41.DATE_INSPECTED);
        await setValueIfPresent('Section41InspectedBy', qcItem41.INSPECTED_BY);
        await setValueIfPresent('Section41Method', qcItem41.METHOD);
        await setValueIfPresent('Section41DecisionTaken', qcItem41.DECISION_TAKEN);

        // ✅ Dynamic Image Logic
        const dynamicImageSection = FormSectionedTable.getSection('Section41DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section41UserInputImage');
        const binding = pageProxy.getBindingObject();

        if (dynamicImageSection && attachments.length > 0) {
            const firstAttachment = attachments[0];
            const base64 = firstAttachment?.file;
            const mimeType = firstAttachment?.mimeType || 'image/png';

            if (base64 && base64.length > 100) {
                binding.imageUri = `data:${mimeType};base64,${base64}`;
                await dynamicImageSection.setVisible(true);
                await dynamicImageSection.redraw();

                // Hide user input image section
                if (userInputImageSection) {
                    await userInputImageSection.setVisible(false);
                }
            } else {
                binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
                await dynamicImageSection.setVisible(false);
                await dynamicImageSection.redraw();

                // Show user input image section
                if (userInputImageSection) {
                    await userInputImageSection.setVisible(true);
                }
            }
        } else {
            binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
            await dynamicImageSection?.setVisible(false);
            await dynamicImageSection?.redraw();

            // Show user input image section
            if (userInputImageSection) {
                await userInputImageSection.setVisible(true);
            }
        }

        const Section41TestFormHeader = FormSectionedTable.getSection('Section41TestName');
        const testForm = FormSectionedTable.getSection('Section41TestForm');
        if (!testForm) return;

        await Section41TestFormHeader.setVisible(true);
        await testForm.setVisible(true);

        const gapOrder = ['A', 'B', 'C', 'D'];
        const positionMap = {
            'GAP A': 'A', 'A': 'A',
            'GAP B': 'B', 'B': 'B',
            'GAP C': 'C', 'C': 'C',
            'GAP D': 'D', 'D': 'D',
        };

        const sortedTestData = [...testdataArray].sort((a, b) => {
            const posA = (a.position || '').toUpperCase().replace('GAP ', '').trim();
            const posB = (b.position || '').toUpperCase().replace('GAP ', '').trim();
            return gapOrder.indexOf(posA) - gapOrder.indexOf(posB);
        });

        for (const test of sortedTestData) {
            const rawPosition = (test.position || '').toUpperCase().replace('GAP ', '').trim();
            const suffix = positionMap[rawPosition];

            if (!suffix) continue;

            const actualGapControlId = `Section41TestActualGap${suffix}`;
            const actualGapCtrl = testForm.getControl(actualGapControlId);

            if (!actualGapCtrl) continue;

            await actualGapCtrl.setValue(test.actualvalue || '');
            await actualGapCtrl.redraw();
        }

        const nextButton2 = testForm.getControl('Section42NextButton');
        if (nextButton2) {
            const hasTestData = Array.isArray(testdataArray) && testdataArray.length > 0;

            if (hasTestData) {
                await nextButton2.setVisible(false);

                if (flags?.next === false) {
                    const Section42Form = FormSectionedTable.getSection('Section42Form');
                    if (Section42Form) {
                        await Section42Form.setVisible(true);
                    }
                }
            } else {
                // Leave the Next button visible if no test data
                await nextButton2.setVisible(true);
            }
        }

    } catch (error) {
        console.error("❌ Error in loadSection41Data:", error);
    }
}
