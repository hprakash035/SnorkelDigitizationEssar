export async function loadSection1Data(pageProxy, qcItem1, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section1 = FormSectionedTable.getSection('Section1Form');
        if (!section1) {
            throw new Error("Section1Form not found in FormSectionedTable.");
        }

        await section1.setVisible(true);

        const nextButton = section1.getControl('Section1NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                const Section2Form = FormSectionedTable.getSection('Section2Form');
                if (Section2Form) {
                    await Section2Form.setVisible(true);
                }
            }
        }

        const section1Date1Control = section1.getControl('Section1Date1');
        if (section1Date1Control && qcItem1.DATE_INSPECTED) {
            await section1Date1Control.setValue(qcItem1.DATE_INSPECTED);
        }

        const section1InspectedBy1Control = section1.getControl('Section1InspectedBy1');
        if (section1InspectedBy1Control && qcItem1.INSPECTED_BY) {
            await section1InspectedBy1Control.setValue(qcItem1.INSPECTED_BY);
        }

        const section1InspectionMethod1Control = section1.getControl('Section1InspectionMethod1');
        if (section1InspectionMethod1Control && qcItem1.METHOD) {
            await section1InspectionMethod1Control.setValue(qcItem1.METHOD);
        }

        const section1DecisionTaken1Control = section1.getControl('Section1DecisionTaken1');
        if (section1DecisionTaken1Control && qcItem1.DECISION_TAKEN) {
            await section1DecisionTaken1Control.setValue(qcItem1.DECISION_TAKEN);
        }

    } catch (error) {
        console.error("Error loading Section1 data:", error);
    }
}
