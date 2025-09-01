export async function loadSection84Data(pageProxy, qcItem84, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section84 = FormSectionedTable.getSection('Section84Form');
        if (!Section84) {
            throw new Error("Section84Form not found in FormSectionedTable.");
        }

        await Section84.setVisible(true);

        const nextButton = Section84.getControl('Section91NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section91Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section84Date31Control = Section84.getControl('Section84Date');
        if (Section84Date31Control && qcItem84.DATE_INSPECTED) {
            await Section84Date31Control.setValue(qcItem84.DATE_INSPECTED); 
        }

        const Section84InspectedBy31Control = Section84.getControl('Section84InspectedBy');
        if (Section84InspectedBy31Control && qcItem84.INSPECTED_BY) {
            await Section84InspectedBy31Control.setValue([qcItem84.INSPECTED_BY]);
        }

        const Section84InspectionMethod31Control = Section84.getControl('Section84Method');
        if (Section84InspectionMethod31Control && qcItem84.METHOD) {
            await Section84InspectionMethod31Control.setValue(qcItem84.METHOD);
        }

        const Section84DecisionTaken31Control = Section84.getControl('Section84DecisionTaken');
        if (Section84DecisionTaken31Control && qcItem84.DECISION_TAKEN) {
            await Section84DecisionTaken31Control.setValue([qcItem84.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection84Data:", error);
    }
}
