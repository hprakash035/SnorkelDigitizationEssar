// Section2.js
export async function loadSection2Data(pageProxy, qcItem2, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section2 = FormSectionedTable.getSection('Section2Form');
        if (!section2) {
            throw new Error("Section2Form not found.");
        }

        await section2.setVisible(true);

        const nextButton = section2.getControl('Section2NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                const Section31Form = FormSectionedTable.getSection('Section31Form');
                if (Section31Form) {
                    await Section31Form.setVisible(true);
                }
            }
        }

        const section2Date2Control = section2.getControl('Section2InspectionDate2');
        if (section2Date2Control && qcItem2.DATE_INSPECTED) {
            await section2Date2Control.setValue(qcItem2.DATE_INSPECTED);
        }

        const section2InspectedBy2Control = section2.getControl('Section2InspectedBy2');
        if (section2InspectedBy2Control && qcItem2.INSPECTED_BY) {
            await section2InspectedBy2Control.setValue(qcItem2.INSPECTED_BY);
        }

        const section2InspectionMethod2Control = section2.getControl('Section2InspectionMethod2');
        if (section2InspectionMethod2Control && qcItem2.METHOD) {
            await section2InspectionMethod2Control.setValue(qcItem2.METHOD);
        }

        const section2DecisionTaken2Control = section2.getControl('Section2DecisionTaken2');
        if (section2DecisionTaken2Control && qcItem2.DECISION_TAKEN) {
            await section2DecisionTaken2Control.setValue(qcItem2.DECISION_TAKEN);
        }

    } catch (error) {
        // You might want to keep this for debugging in case of errors in prod
        console.error("Error loading Section2 data:", error);
    }
}
