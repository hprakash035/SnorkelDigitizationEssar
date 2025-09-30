// Section141.js
export async function loadSection141Data(pageProxy, qcItem141, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        // console.log("Starting to load Section141 data...");

        const section141 = FormSectionedTable.getSection('Section141Form');
        if (!section141) {
            // console.error("Section141Form not found.");
            throw new Error("Section141Form not found.");
        }
        // console.log("Section141Form found.");

        await section141.setVisible(true);

        const nextButton = section141.getControl('Section142NextButton');
        if (nextButton) {
            // console.log("Hiding 'Section135NextButton'...");
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                // console.log("flags.next is false. Making Section135Form visible...");
                const section135 = FormSectionedTable.getSection('Section142Form');
                if (section135) {
                    await section135.setVisible(true);
                    // console.log("Section135Form set to visible.");
                } else {
                    // console.warn("Section135Form not found.");
                }
            }
        } else {
            // console.log("'Section135NextButton' not found.");
        }

        if (qcItem141?.DATE_INSPECTED) {
            // console.log("Setting DATE_INSPECTED:", qcItem141.DATE_INSPECTED);
            const dateControl = section141.getControl('Section141Date');
            if (dateControl) {
                await dateControl.setValue(qcItem141.DATE_INSPECTED);
            } else {
                // console.warn("Section141Date control not found.");
            }
        }

        if (qcItem141?.INSPECTED_BY) {
            // console.log("Setting INSPECTED_BY:", qcItem141.INSPECTED_BY);
            const inspectedByControl = section141.getControl('Section141InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem141.INSPECTED_BY]);
            } else {
                // console.warn("Section141InspectedBy control not found.");
            }
        }

        if (qcItem141?.METHOD) {
            // console.log("Setting METHOD:", qcItem141.METHOD);
            const methodControl = section141.getControl('Section141Method');
            if (methodControl) {
                await methodControl.setValue(qcItem141.METHOD);
            } else {
                // console.warn("Section141Method control not found.");
            }
        }

        if (qcItem141?.DECISION_TAKEN) {
            // console.log("Setting DECISION_TAKEN:", qcItem141.DECISION_TAKEN);
            const decisionControl = section141.getControl('Section141DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem141.DECISION_TAKEN]);
            } else {
                // console.warn("Section141DecisionTaken control not found.");
            }
        }

        // console.log("Section141 data loading complete.");
    } catch (error) {
        // console.error("Error loading Section141 data:", error);
    }
}