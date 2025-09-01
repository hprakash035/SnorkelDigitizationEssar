export async function loadSection51Data(pageProxy, qcItem51, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section51 = FormSectionedTable.getSection('Section51Form');
        if (!Section51) {
            throw new Error("Section51Form not found in FormSectionedTable.");
        }

        await Section51.setVisible(true);

        const nextButton = Section51.getControl('Section52NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section52Form = FormSectionedTable.getSection('Section52Form');
                if (Section52Form) {
                    await Section52Form.setVisible(true);
                }
            }
           
        }

        const Section51Date31Control = Section51.getControl('Section51Date');
        if (Section51Date31Control && qcItem51.DATE_INSPECTED) {
            await Section51Date31Control.setValue(qcItem51.DATE_INSPECTED); 
        }

        const Section51InspectedBy31Control = Section51.getControl('Section51InspectedBy');
        if (Section51InspectedBy31Control && qcItem51.INSPECTED_BY) {
            await Section51InspectedBy31Control.setValue([qcItem51.INSPECTED_BY]);
        }

        const Section51InspectionMethod31Control = Section51.getControl('Section51InspectionMethod');
        if (Section51InspectionMethod31Control && qcItem51.METHOD) {
            await Section51InspectionMethod31Control.setValue(qcItem51.METHOD);
        }

        const Section51DecisionTaken31Control = Section51.getControl('Section51DecisionTaken');
        if (Section51DecisionTaken31Control && qcItem51.DECISION_TAKEN) {
            await Section51DecisionTaken31Control.setValue([qcItem51.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection51Data:", error);
    }
}
