// Section144.js
export async function loadSection144Data(pageProxy, qcItem144, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        // console.log("Starting to load Section144 data...");

        const section144 = FormSectionedTable.getSection('Section144Form');
        if (!section144) {
            // console.error("Section144Form not found.");
            throw new Error("Section144Form not found.");
        }
        // console.log("Section144Form found.");

        await section144.setVisible(true);

        const nextButton = section144.getControl('Section145NextButton');
        if (nextButton) {
            // console.log("Hiding 'Section145NextButton'...");
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                // console.log("flags.next is false. Making Section145Form visible...");
                const section145 = FormSectionedTable.getSection('Section145Form');
                if (section145) {
                    await section145.setVisible(true);
                    // console.log("Section145Form set to visible.");
                } else {
                    // console.warn("Section145Form not found.");
                }
            }
        } else {
            // console.log("'Section145NextButton' not found.");
        }

        if (qcItem144?.DATE_INSPECTED) {
            // console.log("Setting DATE_INSPECTED:", qcItem144.DATE_INSPECTED);
            const dateControl = section144.getControl('Section144Date');
            if (dateControl) {
                await dateControl.setValue(qcItem144.DATE_INSPECTED);
            } else {
                // console.warn("Section144Date control not found.");
            }
        }

        if (qcItem144?.INSPECTED_BY) {
            // console.log("Setting INSPECTED_BY:", qcItem144.INSPECTED_BY);
            const inspectedByControl = section144.getControl('Section144InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem144.INSPECTED_BY]);
            } else {
                // console.warn("Section144InspectedBy control not found.");
            }
        }

        if (qcItem144?.METHOD) {
            // console.log("Setting METHOD:", qcItem144.METHOD);
            const methodControl = section144.getControl('Section144Method');
            if (methodControl) {
                await methodControl.setValue(qcItem144.METHOD);
            } else {
                // console.warn("Section144Method control not found.");
            }
        }

        if (qcItem144?.DECISION_TAKEN) {
            // console.log("Setting DECISION_TAKEN:", qcItem144.DECISION_TAKEN);
            const decisionControl = section144.getControl('Section144DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem144.DECISION_TAKEN]);
            } else {
                // console.warn("Section144DecisionTaken control not found.");
            }
        }

        // console.log("Section144 data loading complete.");
    } catch (error) {
        // console.error("Error loading Section144 data:", error);
    }
}