export async function loadSection101Data(pageProxy, qcItem101, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section101 = FormSectionedTable.getSection('Section101Form');
        if (!Section101) {
            throw new Error("Section101Form not found in FormSectionedTable.");
        }

        await Section101.setVisible(true);

        const nextButton = Section101.getControl('Section102NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section102Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section101Date31Control = Section101.getControl('Section101Date');
        if (Section101Date31Control && qcItem101.DATE_INSPECTED) {
            await Section101Date31Control.setValue(qcItem101.DATE_INSPECTED); 
        }

        const Section101InspectedBy31Control = Section101.getControl('Section101InspectedBy');
        if (Section101InspectedBy31Control && qcItem101.INSPECTED_BY) {
            await Section101InspectedBy31Control.setValue([qcItem101.INSPECTED_BY]);
        }

        const Section101InspectionMethod31Control = Section101.getControl('Section101Method');
        if (Section101InspectionMethod31Control && qcItem101.METHOD) {
            await Section101InspectionMethod31Control.setValue(qcItem101.METHOD);
        }

        const Section101DecisionTaken31Control = Section101.getControl('Section101DecisionTaken');
        if (Section101DecisionTaken31Control && qcItem101.DECISION_TAKEN) {
            await Section101DecisionTaken31Control.setValue([qcItem101.DECISION_TAKEN]);
        }
  
    
    } catch (error) {
        console.error("Error in loadSection101Data:", error);
    }
}
