export async function loadSection42Data(pageProxy, qcItem42, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section42 = FormSectionedTable.getSection('Section42Form');
        if (!Section42) {
            throw new Error("Section42Form not found in FormSectionedTable.");
        }

        await Section42.setVisible(true);

        const nextButton = Section42.getControl('Section5NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section51Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section42Date31Control = Section42.getControl('Section42Date');
        if (Section42Date31Control && qcItem42.DATE_INSPECTED) {
            await Section42Date31Control.setValue(qcItem42.DATE_INSPECTED); 
        }

        const Section42InspectedBy31Control = Section42.getControl('Section42InspectedBy');
        if (Section42InspectedBy31Control && qcItem42.INSPECTED_BY) {
            await Section42InspectedBy31Control.setValue([qcItem42.INSPECTED_BY]);
        }

        const Section42InspectionMethod31Control = Section42.getControl('Section42InspectionMethod');
        if (Section42InspectionMethod31Control && qcItem42.METHOD) {
            await Section42InspectionMethod31Control.setValue(qcItem42.METHOD);
        }

        const Section42DecisionTaken31Control = Section42.getControl('Section42DecisionTaken');
        if (Section42DecisionTaken31Control && qcItem42.DECISION_TAKEN) {
            await Section42DecisionTaken31Control.setValue([qcItem42.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection42Data:", error);
    }
}
