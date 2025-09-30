export async function loadSection161Data(pageProxy, qcItem161, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section161 = FormSectionedTable.getSection('Section161Form');
        if (!Section161) throw new Error("❌ Section161Form not found in FormSectionedTable.");

        await Section161.setVisible(true);

        // --- Helpers ---
        const setValueIfPresent = async (section, controlName, value) => {
            const control = section?.getControl(controlName);
            if (control && value !== undefined && value !== null) {
                await control.setValue(value);
            }
        };

        const setButtonVisibility = async (section, buttonName, visible) => {
            const btn = section?.getControl(buttonName);
            if (btn) {
                await btn.setVisible(visible);
            }
        };

        // --- Header Values ---
        let headerHasData = false;

        if (qcItem161?.DATE_INSPECTED) {
            await setValueIfPresent(Section161, 'Section161Date', qcItem161.DATE_INSPECTED);
            headerHasData = true;
        }

        if (qcItem161?.INSPECTED_BY) {
            await setValueIfPresent(Section161, 'Section161InspectedBy', qcItem161.INSPECTED_BY);
            headerHasData = true;
        }

        if (qcItem161?.METHOD) {
            await setValueIfPresent(Section161, 'Section161Method', qcItem161.METHOD);
            headerHasData = true;
        }

        if (qcItem161?.DECISION_TAKEN) {
            await setValueIfPresent(Section161, 'Section161DecisionTaken', qcItem161.DECISION_TAKEN);
            headerHasData = true;
        }

        // --- Button Visibility Logic ---
        await setButtonVisibility(Section161, 'Section162NextButton', !headerHasData);

        // --- Show Section152Form if flags.next === false ---
        if (flags?.next === false && headerHasData) {
            const Section162Form = FormSectionedTable.getSection('Section162Form');
            if (Section162Form) {
                await Section162Form.setVisible(true);
            }
        }

        // console.log("✅ loadSection161Data executed. Header has data:", headerHasData);
    } catch (error) {
        console.error("❌ Error loading Section161 data:", error);
    }
}