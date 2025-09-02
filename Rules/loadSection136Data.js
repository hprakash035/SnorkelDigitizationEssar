// Section136.js
export async function loadSection136Data(pageProxy, qcItem136, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section136 = FormSectionedTable.getSection('Section136Form');
        if (!section136) {
            throw new Error("Section136Form not found.");
        }

        // const nextButton = section136.getControl('SectionNextButton');
        // if (nextButton) {
        //     await nextButton.setVisible(false);
        // }

        await section136.setVisible(true);

        if (qcItem136?.DATE_INSPECTED) {
            const dateControl = section136.getControl('Section136Date');
            if (dateControl) {
                await dateControl.setValue(qcItem136.DATE_INSPECTED);
            }
        }

        if (qcItem136?.INSPECTED_BY) {
            const inspectedByControl = section136.getControl('Section136InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem136.INSPECTED_BY);
            }
        }

        if (qcItem136?.METHOD) {
            const methodControl = section136.getControl('Section136Method');
            if (methodControl) {
                await methodControl.setValue(qcItem136.METHOD);
            }
        }

        if (qcItem136?.DECISION_TAKEN) {
            const decisionControl = section136.getControl('Section136DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem136.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section136 data:", error);
    }
}
