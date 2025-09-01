// Section133.js
export async function loadSection133Data(pageProxy, qcItem133, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section133 = FormSectionedTable.getSection('Section133Form');
        if (!section133) {
            throw new Error("Section133Form not found.");
        }

        const nextButton = section133.getControl('SectionNextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        await section133.setVisible(true);

        if (qcItem133?.DATE_INSPECTED) {
            const dateControl = section133.getControl('Section133Date');
            if (dateControl) {
                await dateControl.setValue(qcItem133.DATE_INSPECTED);
            }
        }

        if (qcItem133?.INSPECTED_BY) {
            const inspectedByControl = section133.getControl('Section133InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem133.INSPECTED_BY);
            }
        }

        if (qcItem133?.METHOD) {
            const methodControl = section133.getControl('Section133Method');
            if (methodControl) {
                await methodControl.setValue(qcItem133.METHOD);
            }
        }

        if (qcItem133?.DECISION_TAKEN) {
            const decisionControl = section133.getControl('Section133DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem133.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section133 data:", error);
    }
}
