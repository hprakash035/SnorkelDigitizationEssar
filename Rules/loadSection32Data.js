export async function loadSection32Data(pageProxy, qcItem32, FormSectionedTable, attachments, flags, testdataArray) {
    try {
      
        const Section32 = FormSectionedTable.getSection('Section32Form');

        if (!Section32) {
          
            throw new Error("Section32Form not found in FormSectionedTable.");
        }

       
        await Section32.setVisible(true);

        const nextButton = Section32.getControl('Section32NextButton');
        if (nextButton) {
           
            await nextButton.setVisible(false);

            if (flags?.next === false) {
               
                const Section41Form = FormSectionedTable.getSection('Section41Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                  
                } else {
                   
                }
            } else {
                // console.log("flags.next is true or undefined.");
            }
        } else {
            // console.warn("Next button not found in Section32Form.");
        }

        const Section32Date31Control = Section32.getControl('Section32Date');
        if (Section32Date31Control && qcItem32.DATE_INSPECTED) {
            // console.log("Setting DATE_INSPECTED:", qcItem32.DATE_INSPECTED);
            await Section32Date31Control.setValue(qcItem32.DATE_INSPECTED);
        }

        const Section32InspectedBy31Control = Section32.getControl('Section32InspectedBy');
        if (Section32InspectedBy31Control && qcItem32.INSPECTED_BY) {
            // console.log("Setting INSPECTED_BY:", qcItem32.INSPECTED_BY);
            await Section32InspectedBy31Control.setValue([qcItem32.INSPECTED_BY]);
        }

        const Section32InspectionMethod31Control = Section32.getControl('Section32Method');
        if (Section32InspectionMethod31Control && qcItem32.METHOD) {
            // console.log("Setting METHOD:", qcItem32.METHOD);
            await Section32InspectionMethod31Control.setValue(qcItem32.METHOD);
        }

        const Section32DecisionTaken31Control = Section32.getControl('Section32DecisionTaken');
        if (Section32DecisionTaken31Control && qcItem32.DECISION_TAKEN) {
            // console.log("Setting DECISION_TAKEN:", qcItem32.DECISION_TAKEN);
            await Section32DecisionTaken31Control.setValue([qcItem32.DECISION_TAKEN]);
        }

        // console.log("loadSection32Data completed successfully.");
    } catch (error) {
        // console.error("Error in loadSection32Data:", error);
    }
}
