export async function loadSection121Data(pageProxy, qcItem121, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section121 = FormSectionedTable.getSection('Section121Form');
        if (!Section121) {
            throw new Error("Section121Form not found in FormSectionedTable.");
        }

        await Section121.setVisible(true);

        const nextButton = Section121.getControl('Section122NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section122Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section121Date31Control = Section121.getControl('Section121Date');
        if (Section121Date31Control && qcItem121.DATE_INSPECTED) {
            await Section121Date31Control.setValue(qcItem121.DATE_INSPECTED); 
        }

        const Section121InspectedBy31Control = Section121.getControl('Section121InspectedBy');
        if (Section121InspectedBy31Control && qcItem121.INSPECTED_BY) {
            await Section121InspectedBy31Control.setValue([qcItem121.INSPECTED_BY]);
        }

        const Section121InspectionMethod31Control = Section121.getControl('Section121Method');
        if (Section121InspectionMethod31Control && qcItem121.METHOD) {
            await Section121InspectionMethod31Control.setValue(qcItem121.METHOD);
        }

        const Section121DecisionTaken31Control = Section121.getControl('Section121DecisionTaken');
        if (Section121DecisionTaken31Control && qcItem121.DECISION_TAKEN) {
            await Section121DecisionTaken31Control.setValue([qcItem121.DECISION_TAKEN]);
        }
  
    
    } catch (error) {
        console.error("Error in loadSection121Data:", error);
    }
}
