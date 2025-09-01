export async function loadSection83Data(pageProxy, qcItem83, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section83 = FormSectionedTable.getSection('Section83Form');
        if (!Section83) {
            throw new Error("Section83Form not found in FormSectionedTable.");
        }

        await Section83.setVisible(true);

        const nextButton = Section83.getControl('Section84NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section84Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        const Section83Date31Control = Section83.getControl('Section83Date');
        if (Section83Date31Control && qcItem83.DATE_INSPECTED) {
            await Section83Date31Control.setValue(qcItem83.DATE_INSPECTED); 
        }

        const Section83InspectedBy31Control = Section83.getControl('Section83InspectedBy');
        if (Section83InspectedBy31Control && qcItem83.INSPECTED_BY) {
            await Section83InspectedBy31Control.setValue([qcItem83.INSPECTED_BY]);
        }

        const Section83InspectionMethod31Control = Section83.getControl('Section83Method');
        if (Section83InspectionMethod31Control && qcItem83.METHOD) {
            await Section83InspectionMethod31Control.setValue(qcItem83.METHOD);
        }

        const Section83DecisionTaken31Control = Section83.getControl('Section83DecisionTaken');
        if (Section83DecisionTaken31Control && qcItem83.DECISION_TAKEN) {
            await Section83DecisionTaken31Control.setValue([qcItem83.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection83Data:", error);
    }
}
