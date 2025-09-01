export async function loadSection63Data(pageProxy, qcItem63, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section63 = FormSectionedTable.getSection('Section63Form');
        if (!Section63) {
            throw new Error("Section63Form not found in FormSectionedTable.");
        }

        await Section63.setVisible(true);

        const nextButton = Section63.getControl('Section71NextButton');
        if (nextButton) {
            // await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section63Form = FormSectionedTable.getSection('Section71Form');
                if (Section63Form) {
                    await Section63Form.setVisible(true);
                }
            }
           
        }

        const Section63Date31Control = Section63.getControl('Section63Date');
        if (Section63Date31Control && qcItem63.DATE_INSPECTED) {
            await Section63Date31Control.setValue(qcItem63.DATE_INSPECTED); 
        }

        const Section63InspectedBy31Control = Section63.getControl('Section63InspectedBy');
        if (Section63InspectedBy31Control && qcItem63.INSPECTED_BY) {
            await Section63InspectedBy31Control.setValue([qcItem63.INSPECTED_BY]);
        }

        const Section63InspectionMethod31Control = Section63.getControl('Section63Method');
        if (Section63InspectionMethod31Control && qcItem63.METHOD) {
            await Section63InspectionMethod31Control.setValue(qcItem63.METHOD);
        }

        const Section63DecisionTaken31Control = Section63.getControl('Section63DecisionTaken');
        if (Section63DecisionTaken31Control && qcItem63.DECISION_TAKEN) {
            await Section63DecisionTaken31Control.setValue([qcItem63.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection63Data:", error);
    }
}
