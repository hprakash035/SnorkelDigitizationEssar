export async function loadSection71Data(pageProxy, qcItem71, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section71 = FormSectionedTable.getSection('Section71Form');
        if (!Section71) {
            throw new Error("Section71Form not found in FormSectionedTable.");
        }

        await Section71.setVisible(true);

        const nextButton = Section71.getControl('Section72NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section72Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section71Date31Control = Section71.getControl('Section71Date');
        if (Section71Date31Control && qcItem71.DATE_INSPECTED) {
            await Section71Date31Control.setValue(qcItem71.DATE_INSPECTED); 
        }

        const Section71InspectedBy31Control = Section71.getControl('Section71InspectedBy');
        if (Section71InspectedBy31Control && qcItem71.INSPECTED_BY) {
            await Section71InspectedBy31Control.setValue([qcItem71.INSPECTED_BY]);
        }

        const Section71InspectionMethod31Control = Section71.getControl('Section71Method');
        if (Section71InspectionMethod31Control && qcItem71.METHOD) {
            await Section71InspectionMethod31Control.setValue(qcItem71.METHOD);
        }

        const Section71DecisionTaken31Control = Section71.getControl('Section71DecisionTaken');
        if (Section71DecisionTaken31Control && qcItem71.DECISION_TAKEN) {
            await Section71DecisionTaken31Control.setValue([qcItem71.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection71Data:", error);
    }
}
