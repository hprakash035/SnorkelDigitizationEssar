export async function loadSection144Data(pageProxy, qcItem144, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section144 = FormSectionedTable.getSection('Section144Form');
        if (!Section144) {
            throw new Error("Section144Form not found in FormSectionedTable.");
        }

        await Section144.setVisible(true);

        const nextButton = Section144.getControl('Section145NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section145Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section144.setVisible(true);

        if (qcItem144?.DATE_INSPECTED) {
            const dateControl = Section144.getControl('Section144Date');
            if (dateControl) {
                await dateControl.setValue(qcItem144.DATE_INSPECTED);
            }
        }

        if (qcItem144?.INSPECTED_BY) {
            const inspectedByControl = Section144.getControl('Section144InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem144.INSPECTED_BY);
            }
        }

        if (qcItem144?.METHOD) {
            const methodControl = Section144.getControl('Section144Method');
            if (methodControl) {
                await methodControl.setValue(qcItem144.METHOD);
            }
        }

        if (qcItem144?.DECISION_TAKEN) {
            const decisionControl = Section144.getControl('Section144DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem144.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section144 data:", error);
    }
}
