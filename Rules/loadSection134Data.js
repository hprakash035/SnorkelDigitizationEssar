// Section134.js
export async function loadSection134Data(pageProxy, qcItem134, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section134 = FormSectionedTable.getSection('Section134Form');
        if (!section134) {
            throw new Error("Section134Form not found.");
        }

        const nextButton = section134.getControl('SectionNextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        await section134.setVisible(true);

        if (qcItem134?.DATE_INSPECTED) {
            const dateControl = section134.getControl('Section134Date');
            if (dateControl) {
                await dateControl.setValue(qcItem134.DATE_INSPECTED);
            }
        }

        if (qcItem134?.INSPECTED_BY) {
            const inspectedByControl = section134.getControl('Section134InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem134.INSPECTED_BY);
            }
        }

        if (qcItem134?.METHOD) {
            const methodControl = section134.getControl('Section134Method');
            if (methodControl) {
                await methodControl.setValue(qcItem134.METHOD);
            }
        }

        if (qcItem134?.DECISION_TAKEN) {
            const decisionControl = section134.getControl('Section134DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem134.DECISION_TAKEN);
            }
        }
     
    } catch (error) {
        console.error("Error loading Section134 data:", error);
    }
}
