export async function loadSection3Data(pageProxy, qcItem31, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section31 = FormSectionedTable.getSection('Section31Form');
        if (!section31) {
            throw new Error("Section31Form not found in FormSectionedTable.");
        }

        await section31.setVisible(true);

        const nextButton = section31.getControl('Section31NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section32Form = FormSectionedTable.getSection('Section32Form');
                if (Section32Form) {
                    await Section32Form.setVisible(true);
                }
            }
           
        }

        const section31Date31Control = section31.getControl('Section31Date');
        if (section31Date31Control && qcItem31.DATE_INSPECTED) {
            await section31Date31Control.setValue(qcItem31.DATE_INSPECTED); 
        }

        const section31InspectedBy31Control = section31.getControl('Section31InspectedBy');
        if (section31InspectedBy31Control && qcItem31.INSPECTED_BY) {
            await section31InspectedBy31Control.setValue([qcItem31.INSPECTED_BY]);
        }

        const section31InspectionMethod31Control = section31.getControl('Section31InspectionMethod');
        if (section31InspectionMethod31Control && qcItem31.METHOD) {
            await section31InspectionMethod31Control.setValue(qcItem31.METHOD);
        }

        const section31DecisionTaken31Control = section31.getControl('Section31DecisionTaken');
        if (section31DecisionTaken31Control && qcItem31.DECISION_TAKEN) {
            await section31DecisionTaken31Control.setValue([qcItem31.DECISION_TAKEN]);
        }

    } catch (error) {
        console.error("Error in loadSection31Data:", error);
    }
}
