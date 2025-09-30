export async function loadSection192Data(
    pageProxy,
    qcItem192,
    FormSectionedTable,
    attachments,
    flags,
    testdataArray
) {
    try {
        const Section192 = FormSectionedTable.getSection('Section192Form');
        if (!Section192) {
            throw new Error("Section192Form not found in FormSectionedTable.");
        }

        // Always make Section192 visible
        await Section192.setVisible(true);

        // --- Hide Next button after loading ---
        const nextButton = Section192.getControl('Section193NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        // --- Conditionally open Section192 if next flag is false ---
        if (flags?.next === false) {
            const Section192Form = FormSectionedTable.getSection('Section193Form');
            if (Section192Form) {
                await Section192Form.setVisible(true);
            }
        }

        // --- Populate fields if values exist ---
        if (qcItem192?.DATE_INSPECTED) {
            const dateControl = Section192.getControl('Section192Date');
            if (dateControl) {
                await dateControl.setValue(qcItem192.DATE_INSPECTED);
            }
        }

        if (qcItem192?.INSPECTED_BY) {
            const inspectedByControl = Section192.getControl('Section192InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem192.INSPECTED_BY);
            }
        }

        if (qcItem192?.METHOD) {
            const methodControl = Section192.getControl('Section192Method');
            if (methodControl) {
                await methodControl.setValue(qcItem192.METHOD);
            }
        }

        if (qcItem192?.DECISION_TAKEN) {
            const decisionControl = Section192.getControl('Section192DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem192.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section192 data:", error);
    }
}