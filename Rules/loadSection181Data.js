export async function loadSection181Data(
    pageProxy,
    qcItem181,
    FormSectionedTable,
    attachments,
    flags,
    testdataArray
) {
    try {
        const Section181 = FormSectionedTable.getSection('Section181Form');
        if (!Section181) {
            throw new Error("Section181Form not found in FormSectionedTable.");
        }

        // Always make Section181 visible
        await Section181.setVisible(true);

        // --- Hide Next button after loading ---
        const nextButton = Section181.getControl('Section182NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        // --- Conditionally open Section181 if next flag is false ---
        if (flags?.next === false) {
            const Section181Form = FormSectionedTable.getSection('Section182Form');
            if (Section181Form) {
                await Section181Form.setVisible(true);
            }
        }

        // --- Populate fields if values exist ---
        if (qcItem181?.DATE_INSPECTED) {
            const dateControl = Section181.getControl('Section181Date');
            if (dateControl) {
                await dateControl.setValue(qcItem181.DATE_INSPECTED);
            }
        }

        if (qcItem181?.INSPECTED_BY) {
            const inspectedByControl = Section181.getControl('Section181InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem181.INSPECTED_BY);
            }
        }

        if (qcItem181?.METHOD) {
            const methodControl = Section181.getControl('Section181Method');
            if (methodControl) {
                await methodControl.setValue(qcItem181.METHOD);
            }
        }

        if (qcItem181?.DECISION_TAKEN) {
            const decisionControl = Section181.getControl('Section181DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem181.DECISION_TAKEN);
            }
        }

    } catch (error) {
        console.error("Error loading Section181 data:", error);
    }
}