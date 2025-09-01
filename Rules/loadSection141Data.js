export async function loadSection141Data(pageProxy, qcItem141, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section141 = FormSectionedTable.getSection('Section141Form');
        if (!Section141) {
            throw new Error("Section141Form not found in FormSectionedTable.");
        }

        await Section141.setVisible(true);

        const nextButton = Section141.getControl('Section142NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section142Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section141.setVisible(true);

        if (qcItem141?.DATE_INSPECTED) {
            const dateControl = Section141.getControl('Section141Date');
            if (dateControl) {
                await dateControl.setValue(qcItem141.DATE_INSPECTED);
            }
        }

        if (qcItem141?.INSPECTED_BY) {
            const inspectedByControl = Section141.getControl('Section141InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem141.INSPECTED_BY);
            }
        }

        if (qcItem141?.METHOD) {
            const methodControl = Section141.getControl('Section141Method');
            if (methodControl) {
                await methodControl.setValue(qcItem141.METHOD);
            }
        }

        if (qcItem141?.DECISION_TAKEN) {
            const decisionControl = Section141.getControl('Section141DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem141.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section141 data:", error);
    }
}
