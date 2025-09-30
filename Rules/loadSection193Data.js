export async function loadSection193Data(
    pageProxy,
    qcItem193,
    FormSectionedTable,
    attachments,
    flags,
    testdataArray
) {
    try {
        const Section193 = FormSectionedTable.getSection('Section193Form');
        if (!Section193) {
            throw new Error("Section193Form not found in FormSectionedTable.");
        }

        // Always make Section193 visible
        await Section193.setVisible(true);

        // --- Hide Next button after loading ---
        const nextButton = Section193.getControl('Section194NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        // --- Conditionally open Section193 if next flag is false ---
        if (flags?.next === false) {
            const Section193Form = FormSectionedTable.getSection('Section194Form');
            if (Section193Form) {
                await Section193Form.setVisible(true);
            }
        }

        // --- Populate fields if values exist ---
        if (qcItem193?.DATE_INSPECTED) {
            const dateControl = Section193.getControl('Section193Date');
            if (dateControl) {
                await dateControl.setValue(qcItem193.DATE_INSPECTED);
            }
        }

        if (qcItem193?.INSPECTED_BY) {
            const inspectedByControl = Section193.getControl('Section193InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem193.INSPECTED_BY);
            }
        }

        if (qcItem193?.METHOD) {
            const methodControl = Section193.getControl('Section193Method');
            if (methodControl) {
                await methodControl.setValue(qcItem193.METHOD);
            }
        }

        if (qcItem193?.DECISION_TAKEN) {
            const decisionControl = Section193.getControl('Section193DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem193.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section193 data:", error);
    }
}