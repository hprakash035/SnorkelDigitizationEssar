export async function loadSection181Data(pageProxy, qcItem172, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section181 = FormSectionedTable.getSection('Section181Form');
        if (!Section181) {
            throw new Error("Section181Form not found in FormSectionedTable.");
        }

        await Section181.setVisible(true);

        const nextButton = Section181.getControl('Section182NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section182Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section181.setVisible(true);

        if (qcItem172?.DATE_INSPECTED) {
            const dateControl = Section181.getControl('Section181Date');
            if (dateControl) {
                await dateControl.setValue(qcItem172.DATE_INSPECTED);
            }
        }

        if (qcItem172?.INSPECTED_BY) {
            const inspectedByControl = Section181.getControl('Section181InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem172.INSPECTED_BY);
            }
        }

        if (qcItem172?.METHOD) {
            const methodControl = Section181.getControl('Section181Method');
            if (methodControl) {
                await methodControl.setValue(qcItem172.METHOD);
            }
        }

        if (qcItem172?.DECISION_TAKEN) {
            const decisionControl = Section181.getControl('Section181DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem172.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section181 data:", error);
    }
}
