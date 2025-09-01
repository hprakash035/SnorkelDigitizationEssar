export async function loadSection145Data(pageProxy, qcItem145, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section145 = FormSectionedTable.getSection('Section145Form');
        if (!Section145) {
            throw new Error("Section145Form not found in FormSectionedTable.");
        }

        await Section145.setVisible(true);

        const nextButton = Section145.getControl('Section146NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section146Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section145.setVisible(true);

        if (qcItem145?.DATE_INSPECTED) {
            const dateControl = Section145.getControl('Section145Date');
            if (dateControl) {
                await dateControl.setValue(qcItem145.DATE_INSPECTED);
            }
        }

        if (qcItem145?.INSPECTED_BY) {
            const inspectedByControl = Section145.getControl('Section145InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem145.INSPECTED_BY);
            }
        }

        if (qcItem145?.METHOD) {
            const methodControl = Section145.getControl('Section145Method');
            if (methodControl) {
                await methodControl.setValue(qcItem145.METHOD);
            }
        }

        if (qcItem145?.DECISION_TAKEN) {
            const decisionControl = Section145.getControl('Section145DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem145.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section145 data:", error);
    }
}
