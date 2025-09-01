// Section113.js
export async function loadSection113Data(pageProxy, qcItem113, FormSectionedTable) {
    try {
        const section113 = FormSectionedTable.getSection('Section113Form');
        if (!section113) {
            throw new Error("Section113Form not found.");
        }

        const nextButton = section113.getControl('SectionNextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        await section113.setVisible(true);

        if (qcItem113?.DATE_INSPECTED) {
            const dateControl = section113.getControl('Section113InspectionDate');
            if (dateControl) {
                await dateControl.setValue(qcItem113.DATE_INSPECTED);
            }
        }

        if (qcItem113?.INSPECTED_BY) {
            const inspectedByControl = section113.getControl('Section113InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem113.INSPECTED_BY);
            }
        }

        if (qcItem113?.METHOD) {
            const methodControl = section113.getControl('Section113InspectionMethod');
            if (methodControl) {
                await methodControl.setValue(qcItem113.METHOD);
            }
        }

        if (qcItem113?.DECISION_TAKEN) {
            const decisionControl = section113.getControl('Section113DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem113.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section113 data:", error);
    }
}
