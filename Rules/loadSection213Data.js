export async function loadSection213Data(pageProxy, qcItem213, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section213 = FormSectionedTable.getSection('Section213Form');
        if (!Section213) {
            throw new Error("Section213Form not found in FormSectionedTable.");
        }

        // Show current section
        await Section213.setVisible(true);

        // Handle next button visibility + next section logic
        const nextButton = Section213.getControl('Section214NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                const Section211Form = FormSectionedTable.getSection('Section214Form');
                if (Section211Form) {
                    await Section211Form.setVisible(true);
                }
            }
        }

        // Populate controls if data exists
        if (qcItem213?.DATE_INSPECTED) {
            const dateControl = Section213.getControl('Section213Date');
            if (dateControl) {
                await dateControl.setValue(qcItem213.DATE_INSPECTED);
            }
        }

        if (qcItem213?.INSPECTED_BY) {
            const inspectedByControl = Section213.getControl('Section213InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem213.INSPECTED_BY]);
            }
        }

        if (qcItem213?.METHOD) {
            const methodControl = Section213.getControl('Section213Method');
            if (methodControl) {
                await methodControl.setValue(qcItem213.METHOD);
            }
        }

        if (qcItem213?.DECISION_TAKEN) {
            const decisionControl = Section213.getControl('Section213DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem213.DECISION_TAKEN]);
            }
        }

    } catch (error) {
        console.error("Error loading Section213 data:", error);
    }
}