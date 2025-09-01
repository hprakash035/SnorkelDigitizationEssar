export async function loadSection142Data(pageProxy, qcItem142, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section142 = FormSectionedTable.getSection('Section142Form');
        if (!Section142) {
            throw new Error("Section142Form not found in FormSectionedTable.");
        }

        await Section142.setVisible(true);

        const nextButton = Section142.getControl('Section143NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section143Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section142.setVisible(true);

        if (qcItem142?.DATE_INSPECTED) {
            const dateControl = Section142.getControl('Section142Date');
            if (dateControl) {
                await dateControl.setValue(qcItem142.DATE_INSPECTED);
            }
        }

        if (qcItem142?.INSPECTED_BY) {
            const inspectedByControl = Section142.getControl('Section142InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem142.INSPECTED_BY);
            }
        }

        if (qcItem142?.METHOD) {
            const methodControl = Section142.getControl('Section142Method');
            if (methodControl) {
                await methodControl.setValue(qcItem142.METHOD);
            }
        }

        if (qcItem142?.DECISION_TAKEN) {
            const decisionControl = Section142.getControl('Section142DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem142.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section142 data:", error);
    }
}
