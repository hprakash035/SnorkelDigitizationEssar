export async function loadSection191Data(pageProxy, qcItem191, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section191 = FormSectionedTable.getSection('Section191Form');
        if (!Section191) {
            throw new Error("Section191Form not found in FormSectionedTable.");
        }

        await Section191.setVisible(true);

        const nextButton = Section191.getControl('Section192NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section192Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section191.setVisible(true);

        if (qcItem191?.DATE_INSPECTED) {
            const dateControl = Section191.getControl('Section191Date');
            if (dateControl) {
                await dateControl.setValue(qcItem191.DATE_INSPECTED);
            }
        }

        if (qcItem191?.INSPECTED_BY) {
            const inspectedByControl = Section191.getControl('Section191InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem191.INSPECTED_BY);
            }
        }

        if (qcItem191?.METHOD) {
            const methodControl = Section191.getControl('Section191Method');
            if (methodControl) {
                await methodControl.setValue(qcItem191.METHOD);
            }
        }

        if (qcItem191?.DECISION_TAKEN) {
            const decisionControl = Section191.getControl('Section191DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem191.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section191 data:", error);
    }
}
