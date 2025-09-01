export async function loadSection82Data(pageProxy, qcItem82, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section82 = FormSectionedTable.getSection('Section82Form');
        if (!Section82) {
            throw new Error("Section82Form not found in FormSectionedTable.");
        }

        await Section82.setVisible(true);

        const nextButton = Section82.getControl('Section83NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section83Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section82Date31Control = Section82.getControl('Section82Date');
        if (Section82Date31Control && qcItem82.DATE_INSPECTED) {
            await Section82Date31Control.setValue(qcItem82.DATE_INSPECTED); 
        }

        const Section82InspectedBy31Control = Section82.getControl('Section82InspectedBy');
        if (Section82InspectedBy31Control && qcItem82.INSPECTED_BY) {
            await Section82InspectedBy31Control.setValue([qcItem82.INSPECTED_BY]);
        }

        const Section82InspectionMethod31Control = Section82.getControl('Section82Method');
        if (Section82InspectionMethod31Control && qcItem82.METHOD) {
            await Section82InspectionMethod31Control.setValue(qcItem82.METHOD);
        }

        const Section82DecisionTaken31Control = Section82.getControl('Section82DecisionTaken');
        if (Section82DecisionTaken31Control && qcItem82.DECISION_TAKEN) {
            await Section82DecisionTaken31Control.setValue([qcItem82.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection82Data:", error);
    }
}
