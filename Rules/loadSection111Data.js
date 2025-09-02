export async function loadSection111Data(pageProxy, qcItem111, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section111 = FormSectionedTable.getSection('Section111Form');
        if (!Section111) {
            throw new Error("Section111Form not found in FormSectionedTable.");
        }
        await Section111.setVisible(true);

        const nextButton = Section111.getControl('Section111TestNextButton');
        if (nextButton) {
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                const Section111TestFormName = FormSectionedTable.getSection('Section111TestFormName');
                if (Section111TestFormName) {
                    await Section111TestFormName.setVisible(true);
                }
                const Section41Form = FormSectionedTable.getSection('Section111TestForm');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
        }

        const Section111Date31Control = Section111.getControl('Section111Date');
        if (Section111Date31Control && qcItem111.DATE_INSPECTED) {
            await Section111Date31Control.setValue(qcItem111.DATE_INSPECTED);
        }

        const Section111InspectedBy31Control = Section111.getControl('Section111InspectedBy');
        if (Section111InspectedBy31Control && qcItem111.INSPECTED_BY) {
            await Section111InspectedBy31Control.setValue([qcItem111.INSPECTED_BY]);
        }

        const Section111InspectionMethod31Control = Section111.getControl('Section111InspectionMethod');
        if (Section111InspectionMethod31Control && qcItem111.METHOD) {
            await Section111InspectionMethod31Control.setValue(qcItem111.METHOD);
        }

        const Section111DecisionTaken31Control = Section111.getControl('Section111DecisionTaken');
        if (Section111DecisionTaken31Control && qcItem111.DECISION_TAKEN) {
            await Section111DecisionTaken31Control.setValue([qcItem111.DECISION_TAKEN]);
        }

        // --- Map MOR Test Result values ---
        const testForm = FormSectionedTable.getSection('Section111TestForm');
        if (testForm && testdataArray.length > 0) {
            let morTests = testdataArray.filter(t => t.testname?.includes("MOR test result"));

            // Sort by specification (numeric or alphabetic)
            morTests = morTests.sort((a, b) => {
                const specA = a.specification;
                const specB = b.specification;

                const numA = parseFloat(specA);
                const numB = parseFloat(specB);

                const isNumA = !isNaN(numA);
                const isNumB = !isNaN(numB);

                if (isNumA && isNumB) {
                    return numA - numB;
                }

                return String(specA).localeCompare(String(specB));
            });

            for (let i = 0; i < Math.min(morTests.length, 4); i++) {
                const test = morTests[i];
                const suffix = i + 1;

                const setFormValue = async (ctrl, val) => {
                    const c = testForm.getControl(ctrl);
                    if (c && val !== undefined && val !== null) {
                        await c.setValue(val);
                    }
                };

                await setFormValue(`Section111TestDate${suffix}`, test.date);
                await setFormValue(`Section111TestSpecification${suffix}`, test.specification);
                await setFormValue(`Section111TestMethod${suffix}`, test.method);
                await setFormValue(`Section111TestActualValue${suffix}`, test.actualvalue);
            }

            const Section112Form = FormSectionedTable.getSection('Section112Form');
            if (Section112Form) {
                await Section112Form.setVisible(true);
            }
        }

    } catch (error) {
        console.error("Error in loadSection111Data:", error);
    }
}
