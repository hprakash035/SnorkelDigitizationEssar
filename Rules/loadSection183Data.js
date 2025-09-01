export async function loadSection183Data(pageProxy, qcItem183, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section183 = FormSectionedTable.getSection('Section183Form');
        if (!Section183) {
            throw new Error("Section183Form not found in FormSectionedTable.");
        }

        await Section183.setVisible(true);

        const nextButton = Section183.getControl('Section184NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section184Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section183.setVisible(true);

        if (qcItem183?.DATE_INSPECTED) {
            const dateControl = Section183.getControl('Section183Date');
            if (dateControl) {
                await dateControl.setValue(qcItem183.DATE_INSPECTED);
            }
        }

        if (qcItem183?.INSPECTED_BY) {
            const inspectedByControl = Section183.getControl('Section183InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem183.INSPECTED_BY);
            }
        }

        if (qcItem183?.METHOD) {
            const methodControl = Section183.getControl('Section183Method');
            if (methodControl) {
                await methodControl.setValue(qcItem183.METHOD);
            }
        }

        if (qcItem183?.DECISION_TAKEN) {
            const decisionControl = Section183.getControl('Section183DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem183.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section183 data:", error);
    }
}
