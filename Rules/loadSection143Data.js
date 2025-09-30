// Section143.js
export async function loadSection143Data(pageProxy, qcItem143, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        // console.log("Starting to load Section143 data...");

        const section143 = FormSectionedTable.getSection('Section143Form');
        if (!section143) {
            // console.error("Section143Form not found.");
            throw new Error("Section143Form not found.");
        }
        // console.log("Section143Form found.");

        await section143.setVisible(true);

        const nextButton = section143.getControl('Section144NextButton');
        if (nextButton) {
            // console.log("Hiding 'Section144NextButton'...");
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                // console.log("flags.next is false. Making Section144Form visible...");
                const section144 = FormSectionedTable.getSection('Section144Form');
                if (section144) {
                    await section144.setVisible(true);
                    // console.log("Section144Form set to visible.");
                } else {
                    // console.warn("Section144Form not found.");
                }
            }
        } else {
            // console.log("'Section144NextButton' not found.");
        }

        if (qcItem143?.DATE_INSPECTED) {
            // console.log("Setting DATE_INSPECTED:", qcItem143.DATE_INSPECTED);
            const dateControl = section143.getControl('Section143Date');
            if (dateControl) {
                await dateControl.setValue(qcItem143.DATE_INSPECTED);
            } else {
                // console.warn("Section143Date control not found.");
            }
        }

        if (qcItem143?.INSPECTED_BY) {
            // console.log("Setting INSPECTED_BY:", qcItem143.INSPECTED_BY);
            const inspectedByControl = section143.getControl('Section143InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem143.INSPECTED_BY]);
            } else {
                // console.warn("Section143InspectedBy control not found.");
            }
        }

        if (qcItem143?.METHOD) {
            // console.log("Setting METHOD:", qcItem143.METHOD);
            const methodControl = section143.getControl('Section143Method');
            if (methodControl) {
                await methodControl.setValue(qcItem143.METHOD);
            } else {
                // console.warn("Section143Method control not found.");
            }
        }

        if (qcItem143?.DECISION_TAKEN) {
            // console.log("Setting DECISION_TAKEN:", qcItem143.DECISION_TAKEN);
            const decisionControl = section143.getControl('Section143DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem143.DECISION_TAKEN]);
            } else {
                // console.warn("Section143DecisionTaken control not found.");
            }
        }

        // console.log("Section143 data loading complete.");
    } catch (error) {
        // console.error("Error loading Section143 data:", error);
    }
}