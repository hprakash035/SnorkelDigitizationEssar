export async function loadSection194Data(pageProxy, qcItem194, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section194 = FormSectionedTable.getSection('Section194Form');
        if (!Section194) {
            throw new Error("Section194Form not found in FormSectionedTable.");
        }

        await Section194.setVisible(true);

        const nextButton = Section194.getControl('Section195NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section195Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section194.setVisible(true);

        if (qcItem194?.DATE_INSPECTED) {
            const dateControl = Section194.getControl('Section194Date');
            if (dateControl) {
                await dateControl.setValue(qcItem194.DATE_INSPECTED);
            }
        }

        if (qcItem194?.INSPECTED_BY) {
            const inspectedByControl = Section194.getControl('Section194InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem194.INSPECTED_BY);
            }
        }

        if (qcItem194?.METHOD) {
            const methodControl = Section194.getControl('Section194Method');
            if (methodControl) {
                await methodControl.setValue(qcItem194.METHOD);
            }
        }

        if (qcItem194?.DECISION_TAKEN) {
            const decisionControl = Section194.getControl('Section194DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem194.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section194 data:", error);
    }
}
