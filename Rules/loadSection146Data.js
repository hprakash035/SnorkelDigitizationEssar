// Section146.js
export async function loadSection146Data(pageProxy, qcItem146, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        // console.log("Starting to load Section146 data...");

        const section146 = FormSectionedTable.getSection('Section146Form');
        if (!section146) {
            // console.error("Section146Form not found.");
            throw new Error("Section146Form not found.");
        }
        // console.log("Section146Form found.");

        await section146.setVisible(true);

        const nextButton = section146.getControl('Section151NextButton');
        if (nextButton) {
            // console.log("Hiding 'Section151NextButton'...");
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                // console.log("flags.next is false. Making Section151Form visible...");
                const section151 = FormSectionedTable.getSection('Section151Form');
                if (section151) {
                    await section151.setVisible(true);
                    // console.log("Section151Form set to visible.");
                } else {
                    // console.warn("Section151Form not found.");
                }
            }
        } else {
            // console.log("'Section151NextButton' not found.");
        }

        if (qcItem146?.DATE_INSPECTED) {
            // console.log("Setting DATE_INSPECTED:", qcItem146.DATE_INSPECTED);
            const dateControl = section146.getControl('Section146Date');
            if (dateControl) {
                await dateControl.setValue(qcItem146.DATE_INSPECTED);
            } else {
                // console.warn("Section146Date control not found.");
            }
        }

        if (qcItem146?.INSPECTED_BY) {
            // console.log("Setting INSPECTED_BY:", qcItem146.INSPECTED_BY);
            const inspectedByControl = section146.getControl('Section146InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem146.INSPECTED_BY]);
            } else {
                // console.warn("Section146InspectedBy control not found.");
            }
        }

        if (qcItem146?.METHOD) {
            // console.log("Setting METHOD:", qcItem146.METHOD);
            const methodControl = section146.getControl('Section146Method');
            if (methodControl) {
                await methodControl.setValue(qcItem146.METHOD);
            } else {
                // console.warn("Section146Method control not found.");
            }
        }

        if (qcItem146?.DECISION_TAKEN) {
            // console.log("Setting DECISION_TAKEN:", qcItem146.DECISION_TAKEN);
            const decisionControl = section146.getControl('Section146DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem146.DECISION_TAKEN]);
            } else {
                // console.warn("Section146DecisionTaken control not found.");
            }
        }

        // console.log("Section146 data loading complete.");
    } catch (error) {
        // console.error("Error loading Section146 data:", error);
    }
}