export async function loadSection143Data(pageProxy, qcItem143, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section143 = FormSectionedTable.getSection('Section143Form');
        if (!Section143) {
            throw new Error("Section143Form not found in FormSectionedTable.");
        }

        await Section143.setVisible(true);

        const nextButton = Section143.getControl('Section144NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section144Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section143.setVisible(true);

        if (qcItem143?.DATE_INSPECTED) {
            const dateControl = Section143.getControl('Section143Date');
            if (dateControl) {
                await dateControl.setValue(qcItem143.DATE_INSPECTED);
            }
        }

        if (qcItem143?.INSPECTED_BY) {
            const inspectedByControl = Section143.getControl('Section143InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem143.INSPECTED_BY);
            }
        }

        if (qcItem143?.METHOD) {
            const methodControl = Section143.getControl('Section143Method');
            if (methodControl) {
                await methodControl.setValue(qcItem143.METHOD);
            }
        }

        if (qcItem143?.DECISION_TAKEN) {
            const decisionControl = Section143.getControl('Section143DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem143.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section143 data:", error);
    }
}
