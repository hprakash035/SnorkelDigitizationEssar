export async function loadSection162Data(
    pageProxy,
    qcItem162,
    FormSectionedTable,
    attachments = [],
    flags = {},
    testdataArray = []
) {
    try {
        const section162 = FormSectionedTable.getSection('Section162Form');
        if (!section162) {
            throw new Error("Section162Form not found in FormSectionedTable.");
        }

        // Show section 162
        await section162.setVisible(true);

        // Handle Next button visibility + navigation
        const nextButton = section162.getControl('Section162NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);

            if (flags?.next === false) {
                const section171 = FormSectionedTable.getSection('Section171Form');
                if (section171) {
                    await section171.setVisible(true);
                }
            }
        }

        // Map QC item data into controls
        const fieldMappings = {
            DATE_INSPECTED: 'Section162InspectionDate',
            INSPECTED_BY: 'Section162InspectedBy',
            METHOD: 'Section162InspectionMethod',
            DECISION_TAKEN: 'Section162DecisionTaken',
        };

        for (const [field, controlName] of Object.entries(fieldMappings)) {
            if (qcItem162?.[field] !== undefined && qcItem162?.[field] !== null) {
                const control = section162.getControl(controlName);
                if (control) {
                    await control.setValue(qcItem162[field]);
                }
            }
        }

    } catch (error) {
        console.error("❌ Error loading Section162 data:", error);
    }
}
