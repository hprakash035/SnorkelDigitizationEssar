export async function loadSection184Data(
    pageProxy,
    qcItem184,
    FormSectionedTable,
    attachments,
    flags,
    testdataArray
) {
    try {
        const Section184 = FormSectionedTable.getSection('Section184Form');
        if (!Section184) {
            throw new Error("Section184Form not found in FormSectionedTable.");
        }

        // Always make Section184 visible
        await Section184.setVisible(true);

        // --- Hide Next button after loading ---
        const nextButton = Section184.getControl('Section191NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        // --- Conditionally open Section184 if next flag is false ---
        if (flags?.next === false) {
            const Section184Form = FormSectionedTable.getSection('Section191Form');
            if (Section184Form) {
                await Section184Form.setVisible(true);
            }
        }

        // --- Populate fields if values exist ---
        if (qcItem184?.DATE_INSPECTED) {
            const dateControl = Section184.getControl('Section184Date');
            if (dateControl) {
                await dateControl.setValue(qcItem184.DATE_INSPECTED);
            }
        }

        if (qcItem184?.INSPECTED_BY) {
            const inspectedByControl = Section184.getControl('Section184InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem184.INSPECTED_BY);
            }
        }

        if (qcItem184?.METHOD) {
            const methodControl = Section184.getControl('Section184Method');
            if (methodControl) {
                await methodControl.setValue(qcItem184.METHOD);
            }
        }

        if (qcItem184?.DECISION_TAKEN) {
            const decisionControl = Section184.getControl('Section184DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem184.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section184 data:", error);
    }
}