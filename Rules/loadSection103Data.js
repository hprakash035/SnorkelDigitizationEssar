export async function loadSection103Data(pageProxy, qcItem103, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section103 = FormSectionedTable.getSection('Section103Form');
        if (!Section103) {
            throw new Error("Section103Form not found in FormSectionedTable.");
        }

        await Section103.setVisible(true);

        const nextButton = Section103.getControl('Section111NextButton');
        if (nextButton) {
            // await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section111Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section103Date31Control = Section103.getControl('Section103Date');
        if (Section103Date31Control && qcItem103.DATE_INSPECTED) {
            await Section103Date31Control.setValue(qcItem103.DATE_INSPECTED); 
        }

        const Section103InspectedBy31Control = Section103.getControl('Section103InspectedBy');
        if (Section103InspectedBy31Control && qcItem103.INSPECTED_BY) {
            await Section103InspectedBy31Control.setValue([qcItem103.INSPECTED_BY]);
        }

        const Section103InspectionMethod31Control = Section103.getControl('Section103InspectionMethod');
        if (Section103InspectionMethod31Control && qcItem103.METHOD) {
            await Section103InspectionMethod31Control.setValue(qcItem103.METHOD);
        }

        const Section103DecisionTaken31Control = Section103.getControl('Section103DecisionTaken');
        if (Section103DecisionTaken31Control && qcItem103.DECISION_TAKEN) {
            await Section103DecisionTaken31Control.setValue([qcItem103.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection103Data:", error);
    }
}
