export async function loadSection72Data(pageProxy, qcItem72, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section72 = FormSectionedTable.getSection('Section72Form');
        if (!Section72) {
            throw new Error("Section72Form not found in FormSectionedTable.");
        }

        await Section72.setVisible(true);

        const nextButton = Section72.getControl('Section81NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section81Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section72Date31Control = Section72.getControl('Section72Date');
        if (Section72Date31Control && qcItem72.DATE_INSPECTED) {
            await Section72Date31Control.setValue(qcItem72.DATE_INSPECTED); 
        }

        const Section72InspectedBy31Control = Section72.getControl('Section72InspectedBy');
        if (Section72InspectedBy31Control && qcItem72.INSPECTED_BY) {
            await Section72InspectedBy31Control.setValue([qcItem72.INSPECTED_BY]);
        }

        const Section72InspectionMethod31Control = Section72.getControl('Section72Method');
        if (Section72InspectionMethod31Control && qcItem72.METHOD) {
            await Section72InspectionMethod31Control.setValue(qcItem72.METHOD);
        }

        const Section72DecisionTaken31Control = Section72.getControl('Section72DecisionTaken');
        if (Section72DecisionTaken31Control && qcItem72.DECISION_TAKEN) {
            await Section72DecisionTaken31Control.setValue([qcItem72.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection72Data:", error);
    }
}
