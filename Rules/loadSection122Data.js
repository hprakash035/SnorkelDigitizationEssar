export async function loadSection122Data(pageProxy, qcItem122, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section122 = FormSectionedTable.getSection('Section122Form');
        if (!Section122) {
            throw new Error("Section122Form not found in FormSectionedTable.");
        }

        await Section122.setVisible(true);

        const nextButton = Section122.getControl('Section123NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section123Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section122Date31Control = Section122.getControl('Section122Date');
        if (Section122Date31Control && qcItem122.DATE_INSPECTED) {
            await Section122Date31Control.setValue(qcItem122.DATE_INSPECTED); 
        }

        const Section122InspectedBy31Control = Section122.getControl('Section122InspectedBy');
        if (Section122InspectedBy31Control && qcItem122.INSPECTED_BY) {
            await Section122InspectedBy31Control.setValue([qcItem122.INSPECTED_BY]);
        }

        const Section122InspectionMethod31Control = Section122.getControl('Section122Method');
        if (Section122InspectionMethod31Control && qcItem122.METHOD) {
            await Section122InspectionMethod31Control.setValue(qcItem122.METHOD);
        }

        const Section122DecisionTaken31Control = Section122.getControl('Section122DecisionTaken');
        if (Section122DecisionTaken31Control && qcItem122.DECISION_TAKEN) {
            await Section122DecisionTaken31Control.setValue([qcItem122.DECISION_TAKEN]);
        }
  
    
    } catch (error) {
        console.error("Error in loadSection122Data:", error);
    }
}
