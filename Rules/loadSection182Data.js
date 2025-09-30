export async function loadSection182Data(
    pageProxy,
    qcItem182,
    FormSectionedTable,
    attachments,
    flags,
    testdataArray
) {
    try {
        const Section182 = FormSectionedTable.getSection('Section182Form');
        if (!Section182) {
            throw new Error("Section182Form not found in FormSectionedTable.");
        }

        // Always make Section182 visible
        await Section182.setVisible(true);

        // --- Hide Next button after loading ---
        const nextButton = Section182.getControl('Section183NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        // --- Conditionally open Section182 if next flag is false ---
        if (flags?.next === false) {
            const Section182Form = FormSectionedTable.getSection('Section183Form');
            if (Section182Form) {
                await Section182Form.setVisible(true);
            }
        }

        // --- Populate fields if values exist ---
        if (qcItem182?.DATE_INSPECTED) {
            const dateControl = Section182.getControl('Section182Date');
            if (dateControl) {
                await dateControl.setValue(qcItem182.DATE_INSPECTED);
            }
        }

        if (qcItem182?.INSPECTED_BY) {
            const inspectedByControl = Section182.getControl('Section182InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem182.INSPECTED_BY);
            }
        }

        if (qcItem182?.METHOD) {
            const methodControl = Section182.getControl('Section182Method');
            if (methodControl) {
                await methodControl.setValue(qcItem182.METHOD);
            }
        }

        if (qcItem182?.DECISION_TAKEN) {
            const decisionControl = Section182.getControl('Section182DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem182.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section182 data:", error);
    }
}