export async function loadSection52Data(pageProxy, qcItem52, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section52 = FormSectionedTable.getSection('Section52Form');
        if (!Section52) {
            throw new Error("Section52Form not found in FormSectionedTable.");
        }

        await Section52.setVisible(true);

        const nextButton = Section52.getControl('Section53NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section52Form = FormSectionedTable.getSection('Section53Form');
                if (Section52Form) {
                    await Section52Form.setVisible(true);
                }
            }
           
        }

        const Section52Date31Control = Section52.getControl('Section52Date');
        if (Section52Date31Control && qcItem52.DATE_INSPECTED) {
            await Section52Date31Control.setValue(qcItem52.DATE_INSPECTED); 
        }

        const Section52InspectedBy31Control = Section52.getControl('Section52InspectedBy');
        if (Section52InspectedBy31Control && qcItem52.INSPECTED_BY) {
            await Section52InspectedBy31Control.setValue([qcItem52.INSPECTED_BY]);
        }

        const Section52InspectionMethod31Control = Section52.getControl('Section52InspectionMethod');
        if (Section52InspectionMethod31Control && qcItem52.METHOD) {
            await Section52InspectionMethod31Control.setValue(qcItem52.METHOD);
        }

        const Section52DecisionTaken31Control = Section52.getControl('Section52DecisionTaken');
        if (Section52DecisionTaken31Control && qcItem52.DECISION_TAKEN) {
            await Section52DecisionTaken31Control.setValue([qcItem52.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection52Data:", error);
    }
}
