export async function loadSection61Data(pageProxy, qcItem61, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section61 = FormSectionedTable.getSection('Section61Form');
        if (!Section61) {
            throw new Error("Section61Form not found in FormSectionedTable.");
        }

        await Section61.setVisible(true);

        const nextButton = Section61.getControl('Section62NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section62Form = FormSectionedTable.getSection('Section62Form');
                if (Section62Form) {
                    await Section62Form.setVisible(true);
                }
            }
           
        }

        const Section61Date31Control = Section61.getControl('Section61Date');
        if (Section61Date31Control && qcItem61.DATE_INSPECTED) {
            await Section61Date31Control.setValue(qcItem61.DATE_INSPECTED); 
        }

        const Section61InspectedBy31Control = Section61.getControl('Section61InspectedBy');
        if (Section61InspectedBy31Control && qcItem61.INSPECTED_BY) {
            await Section61InspectedBy31Control.setValue([qcItem61.INSPECTED_BY]);
        }

        const Section61InspectionMethod31Control = Section61.getControl('Section61Method');
        if (Section61InspectionMethod31Control && qcItem61.METHOD) {
            await Section61InspectionMethod31Control.setValue(qcItem61.METHOD);
        }

        const Section61DecisionTaken31Control = Section61.getControl('Section61DecisionTaken');
        if (Section61DecisionTaken31Control && qcItem61.DECISION_TAKEN) {
            await Section61DecisionTaken31Control.setValue([qcItem61.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection61Data:", error);
    }
}
