export async function loadSection146Data(pageProxy, qcItem145, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section146 = FormSectionedTable.getSection('Section146Form');
        if (!Section146) {
            throw new Error("Section146Form not found in FormSectionedTable.");
        }

        await Section146.setVisible(true);

        const nextButton = Section146.getControl('Section151NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section151Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section146.setVisible(true);

        if (qcItem145?.DATE_INSPECTED) {
            const dateControl = Section146.getControl('Section146Date');
            if (dateControl) {
                await dateControl.setValue(qcItem145.DATE_INSPECTED);
            }
        }

        if (qcItem145?.INSPECTED_BY) {
            const inspectedByControl = Section146.getControl('Section146InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem145.INSPECTED_BY);
            }
        }

        if (qcItem145?.METHOD) {
            const methodControl = Section146.getControl('Section146Method');
            if (methodControl) {
                await methodControl.setValue(qcItem145.METHOD);
            }
        }

        if (qcItem145?.DECISION_TAKEN) {
            const decisionControl = Section146.getControl('Section146DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem145.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section146 data:", error);
    }
}
