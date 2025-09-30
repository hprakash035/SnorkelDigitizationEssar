// Section145.js
export async function loadSection145Data(pageProxy, qcItem145, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        // console.log("Starting to load Section145 data...");

        const section145 = FormSectionedTable.getSection('Section145Form');
        if (!section145) {
            // console.error("Section145Form not found.");
            throw new Error("Section145Form not found.");
        }
        // console.log("Section145Form found.");

        await section145.setVisible(true);

        const nextButton = section145.getControl('Section146NextButton');
        if (nextButton) {
            // console.log("Hiding 'Section146NextButton'...");
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                // console.log("flags.next is false. Making Section146Form visible...");
                const section146 = FormSectionedTable.getSection('Section146Form');
                if (section146) {
                    await section146.setVisible(true);
                    // console.log("Section146Form set to visible.");
                } else {
                    // console.warn("Section146Form not found.");
                }
            }
        } else {
            // console.log("'Section146NextButton' not found.");
        }

        if (qcItem145?.DATE_INSPECTED) {
            // console.log("Setting DATE_INSPECTED:", qcItem145.DATE_INSPECTED);
            const dateControl = section145.getControl('Section145Date');
            if (dateControl) {
                await dateControl.setValue(qcItem145.DATE_INSPECTED);
            } else {
                // console.warn("Section145Date control not found.");
            }
        }

        if (qcItem145?.INSPECTED_BY) {
            // console.log("Setting INSPECTED_BY:", qcItem145.INSPECTED_BY);
            const inspectedByControl = section145.getControl('Section145InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem145.INSPECTED_BY]);
            } else {
                // console.warn("Section145InspectedBy control not found.");
            }
        }

        if (qcItem145?.METHOD) {
            // console.log("Setting METHOD:", qcItem145.METHOD);
            const methodControl = section145.getControl('Section145Method');
            if (methodControl) {
                await methodControl.setValue(qcItem145.METHOD);
            } else {
                // console.warn("Section145Method control not found.");
            }
        }

        if (qcItem145?.DECISION_TAKEN) {
            // console.log("Setting DECISION_TAKEN:", qcItem145.DECISION_TAKEN);
            const decisionControl = section145.getControl('Section145DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem145.DECISION_TAKEN]);
            } else {
                // console.warn("Section145DecisionTaken control not found.");
            }
        }

        // console.log("Section145 data loading complete.");
    } catch (error) {
        // console.error("Error loading Section145 data:", error);
    }
}