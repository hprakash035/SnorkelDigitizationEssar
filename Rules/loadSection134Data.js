// Section134.js
export async function loadSection134Data(pageProxy, qcItem134, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        // console.log("Starting to load Section134 data...");

        const section134 = FormSectionedTable.getSection('Section134Form');
        if (!section134) {
            // console.error("Section134Form not found.");
            throw new Error("Section134Form not found.");
        }
        // console.log("Section134Form found.");

        await section134.setVisible(true);

        const nextButton = section134.getControl('Section135NextButton');
        if (nextButton) {
            // console.log("Hiding 'Section135NextButton'...");
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                // console.log("flags.next is false. Making Section135Form visible...");
                const section135 = FormSectionedTable.getSection('Section135Form');
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

        if (qcItem134?.DATE_INSPECTED) {
            // console.log("Setting DATE_INSPECTED:", qcItem134.DATE_INSPECTED);
            const dateControl = section134.getControl('Section134Date');
            if (dateControl) {
                await dateControl.setValue(qcItem134.DATE_INSPECTED);
            } else {
                // console.warn("Section134Date control not found.");
            }
        }

        if (qcItem134?.INSPECTED_BY) {
            // console.log("Setting INSPECTED_BY:", qcItem134.INSPECTED_BY);
            const inspectedByControl = section134.getControl('Section134InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem134.INSPECTED_BY]);
            } else {
                // console.warn("Section134InspectedBy control not found.");
            }
        }

        if (qcItem134?.METHOD) {
            // console.log("Setting METHOD:", qcItem134.METHOD);
            const methodControl = section134.getControl('Section134Method');
            if (methodControl) {
                await methodControl.setValue(qcItem134.METHOD);
            } else {
                // console.warn("Section134Method control not found.");
            }
        }

        if (qcItem134?.DECISION_TAKEN) {
            // console.log("Setting DECISION_TAKEN:", qcItem134.DECISION_TAKEN);
            const decisionControl = section134.getControl('Section134DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem134.DECISION_TAKEN]);
            } else {
                // console.warn("Section134DecisionTaken control not found.");
            }
        }

        // console.log("Section134 data loading complete.");
    } catch (error) {
        // console.error("Error loading Section134 data:", error);
    }
}