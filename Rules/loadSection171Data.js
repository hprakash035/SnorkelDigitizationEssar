export async function loadSection171Data(
    pageProxy,
    qcItem171,
    FormSectionedTable,
    attachments,
    flags,
    testdataArray
) {
    try {
        const Section171 = FormSectionedTable.getSection('Section171Form');
        if (!Section171) {
            throw new Error("Section171Form not found in FormSectionedTable.");
        }

        // Always make Section171 visible
        await Section171.setVisible(true);

        // --- Hide Next button after loading ---
        const nextButton = Section171.getControl('Section181NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        // --- Conditionally open Section171 if next flag is false ---
        if (flags?.next === false) {
            const Section171Form = FormSectionedTable.getSection('Section181Form');
            if (Section171Form) {
                await Section171Form.setVisible(true);
            }
        }

        // --- Populate fields if values exist ---
        if (qcItem171?.DATE_INSPECTED) {
            const dateControl = Section171.getControl('Section171Date');
            if (dateControl) {
                await dateControl.setValue(qcItem171.DATE_INSPECTED);
            }
        }

        if (qcItem171?.INSPECTED_BY) {
            const inspectedByControl = Section171.getControl('Section171InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem171.INSPECTED_BY);
            }
        }

        if (qcItem171?.METHOD) {
            const methodControl = Section171.getControl('Section171Method');
            if (methodControl) {
                await methodControl.setValue(qcItem171.METHOD);
            }
        }

        if (qcItem171?.DECISION_TAKEN) {
            const decisionControl = Section171.getControl('Section171DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem171.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section171 data:", error);
    }
}