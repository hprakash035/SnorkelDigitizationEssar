export async function loadSection214Data(pageProxy, qcItem214, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section214 = FormSectionedTable.getSection('Section214Form');
        if (!Section214) {
            throw new Error("Section214Form not found in FormSectionedTable.");
        }

        // Show current section
        await Section214.setVisible(true);

        // Handle next button visibility + next section logic
        const nextButton = Section214.getControl('SectionInletFinalButton');
        if (nextButton) {
            await nextButton.setVisible(false);

            // if (flags?.next === false) {
            //     const Section211Form = FormSectionedTable.getSection('Section214Form');
            //     if (Section211Form) {
            //         await Section211Form.setVisible(true);
            //     }
            // }
        }

        // Populate controls if data exists
        if (qcItem214?.DATE_INSPECTED) {
            const dateControl = Section214.getControl('Section214Date');
            if (dateControl) {
                await dateControl.setValue(qcItem214.DATE_INSPECTED);
            }
        }

        if (qcItem214?.INSPECTED_BY) {
            const inspectedByControl = Section214.getControl('Section214InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem214.INSPECTED_BY]);
            }
        }

        if (qcItem214?.METHOD) {
            const methodControl = Section214.getControl('Section214Method');
            if (methodControl) {
                await methodControl.setValue(qcItem214.METHOD);
            }
        }

        if (qcItem214?.DECISION_TAKEN) {
            const decisionControl = Section214.getControl('Section214DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem214.DECISION_TAKEN]);
            }
        }

    } catch (error) {
        console.error("Error loading Section214 data:", error);
    }
}