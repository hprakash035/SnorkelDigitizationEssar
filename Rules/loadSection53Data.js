export async function loadSection53Data(pageProxy, qcItem53, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section53 = FormSectionedTable.getSection('Section53Form');
        if (!Section53) {
            throw new Error("Section53Form not found in FormSectionedTable.");
        }

        await Section53.setVisible(true);

        const nextButton = Section53.getControl('Section6NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section52Form = FormSectionedTable.getSection('Section61Form');
                if (Section52Form) {
                    await Section52Form.setVisible(true);
                }
            }
           
        }

        const Section53Date31Control = Section53.getControl('Section53Date');
        if (Section53Date31Control && qcItem53.DATE_INSPECTED) {
            await Section53Date31Control.setValue(qcItem53.DATE_INSPECTED); 
        }

        const Section53InspectedBy31Control = Section53.getControl('Section53InspectedBy');
        if (Section53InspectedBy31Control && qcItem53.INSPECTED_BY) {
            await Section53InspectedBy31Control.setValue([qcItem53.INSPECTED_BY]);
        }

        const Section53InspectionMethod31Control = Section53.getControl('Section53Method');
        if (Section53InspectionMethod31Control && qcItem53.METHOD) {
            await Section53InspectionMethod31Control.setValue(qcItem53.METHOD);
        }

        const Section53DecisionTaken31Control = Section53.getControl('Section53DecisionTaken');
        if (Section53DecisionTaken31Control && qcItem53.DECISION_TAKEN) {
            await Section53DecisionTaken31Control.setValue([qcItem53.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection53Data:", error);
    }
}
