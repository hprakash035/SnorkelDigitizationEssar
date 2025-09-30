// Section142.js
export async function loadSection142Data(pageProxy, qcItem142, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        // console.log("Starting to load Section142 data...");

        const section142 = FormSectionedTable.getSection('Section142Form');
        if (!section142) {
            // console.error("Section142Form not found.");
            throw new Error("Section142Form not found.");
        }
        // console.log("Section142Form found.");

        await section142.setVisible(true);

        const nextButton = section142.getControl('Section143NextButton');
        if (nextButton) {
            // console.log("Hiding 'Section135NextButton'...");
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                // console.log("flags.next is false. Making Section135Form visible...");
                const section135 = FormSectionedTable.getSection('Section143Form');
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

        if (qcItem142?.DATE_INSPECTED) {
            // console.log("Setting DATE_INSPECTED:", qcItem142.DATE_INSPECTED);
            const dateControl = section142.getControl('Section142Date');
            if (dateControl) {
                await dateControl.setValue(qcItem142.DATE_INSPECTED);
            } else {
                // console.warn("Section142Date control not found.");
            }
        }

        if (qcItem142?.INSPECTED_BY) {
            // console.log("Setting INSPECTED_BY:", qcItem142.INSPECTED_BY);
            const inspectedByControl = section142.getControl('Section142InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem142.INSPECTED_BY]);
            } else {
                // console.warn("Section142InspectedBy control not found.");
            }
        }

        if (qcItem142?.METHOD) {
            // console.log("Setting METHOD:", qcItem142.METHOD);
            const methodControl = section142.getControl('Section142Method');
            if (methodControl) {
                await methodControl.setValue(qcItem142.METHOD);
            } else {
                // console.warn("Section142Method control not found.");
            }
        }

        if (qcItem142?.DECISION_TAKEN) {
            // console.log("Setting DECISION_TAKEN:", qcItem142.DECISION_TAKEN);
            const decisionControl = section142.getControl('Section142DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem142.DECISION_TAKEN]);
            } else {
                // console.warn("Section142DecisionTaken control not found.");
            }
        }

        // console.log("Section142 data loading complete.");
    } catch (error) {
        // console.error("Error loading Section142 data:", error);
    }
}