// Section133.js
export async function loadSection133Data(pageProxy, qcItem133, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        //  console.log("Starting to load Section133 data...");

        const section133 = FormSectionedTable.getSection('Section133Form');
        if (!section133) {
            //  console.error("Section133Form not found.");
            throw new Error("Section133Form not found.");
        }
        //  console.log("Section133Form found.");

        await section133.setVisible(true);

        const nextButton = section133.getControl('Section134NextButton');
        if (nextButton) {
            //  console.log("Hiding 'SectionNextButton'...");
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                //  console.log("flags.next is false. Making Section134Form visible...");
                const section134 = FormSectionedTable.getSection('Section134Form');
                if (section134) {
                    await section134.setVisible(true);
                    //  console.log("Section134Form set to visible.");
                } else {
                    //  console.warn("Section134Form not found.");
                }
            }
        } else {
            //  console.log("'SectionNextButton' not found.");
        }

        // Set DATE_INSPECTED
        if (qcItem133?.DATE_INSPECTED) {
            //  console.log("Setting DATE_INSPECTED:", qcItem133.DATE_INSPECTED);
            const dateControl = section133.getControl('Section133Date');
            if (dateControl) {
                await dateControl.setValue(qcItem133.DATE_INSPECTED);
            } else {
                //  console.warn("Section133Date control not found.");
            }
        }

        // Set INSPECTED_BY
        if (qcItem133?.INSPECTED_BY) {
            //  console.log("Setting INSPECTED_BY:", qcItem133.INSPECTED_BY);
            const inspectedByControl = section133.getControl('Section133InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue([qcItem133.INSPECTED_BY]); // assuming it's an array
            } else {
                //  console.warn("Section133InspectedBy control not found.");
            }
        }

        // Set METHOD
        if (qcItem133?.METHOD) {
            //  console.log("Setting METHOD:", qcItem133.METHOD);
            const methodControl = section133.getControl('Section133Method');
            if (methodControl) {
                await methodControl.setValue(qcItem133.METHOD);
            } else {
                //  console.warn("Section133Method control not found.");
            }
        }

        // Set DECISION_TAKEN
        if (qcItem133?.DECISION_TAKEN) {
            //  console.log("Setting DECISION_TAKEN:", qcItem133.DECISION_TAKEN);
            const decisionControl = section133.getControl('Section133DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue([qcItem133.DECISION_TAKEN]); // assuming it's an array
            } else {
                //  console.warn("Section133DecisionTaken control not found.");
            }
        }

        //  console.log("Section133 data loading complete.");
    } catch (error) {
        //  console.error("Error loading Section133 data:", error);
    }
}