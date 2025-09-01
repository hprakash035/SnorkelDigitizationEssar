export async function loadSection81Data(pageProxy, qcItem81, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section81 = FormSectionedTable.getSection('Section81Form');
        if (!Section81) {
            throw new Error("Section81Form not found in FormSectionedTable.");
        }

        await Section81.setVisible(true);

        const nextButton = Section81.getControl('Section82NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section82Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section81Date31Control = Section81.getControl('Section81Date');
        if (Section81Date31Control && qcItem81.DATE_INSPECTED) {
            await Section81Date31Control.setValue(qcItem81.DATE_INSPECTED); 
        }

        const Section81InspectedBy31Control = Section81.getControl('Section81InspectedBy');
        if (Section81InspectedBy31Control && qcItem81.INSPECTED_BY) {
            await Section81InspectedBy31Control.setValue([qcItem81.INSPECTED_BY]);
        }

        const Section81InspectionMethod31Control = Section81.getControl('Section81Method');
        if (Section81InspectionMethod31Control && qcItem81.METHOD) {
            await Section81InspectionMethod31Control.setValue(qcItem81.METHOD);
        }

        const Section81DecisionTaken31Control = Section81.getControl('Section81DecisionTaken');
        if (Section81DecisionTaken31Control && qcItem81.DECISION_TAKEN) {
            await Section81DecisionTaken31Control.setValue([qcItem81.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection81Data:", error);
    }
}
