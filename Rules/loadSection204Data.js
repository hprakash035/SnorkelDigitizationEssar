export async function loadSection204Data(pageProxy, qcItem204, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section204 = FormSectionedTable.getSection('Section204Form');
        if (!Section204) {
            throw new Error("Section204Form not found in FormSectionedTable.");
        }

        await Section204.setVisible(true);

        const nextButton = Section204.getControl('Section211NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        // Optionally show next section if flag is false
        if (flags?.next === false) {
            const nextSection = FormSectionedTable.getSection('Section211Form');
            if (nextSection) {
                await nextSection.setVisible(true);
            }
        }

        // --- Set metadata fields ---
        if (qcItem204?.DATE_INSPECTED) {
            const dateControl = Section204.getControl('Section204Date');
            if (dateControl) {
                await dateControl.setValue(qcItem204.DATE_INSPECTED);
            }
        }

        if (qcItem204?.INSPECTED_BY) {
            const inspectedByControl = Section204.getControl('Section204InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem204.INSPECTED_BY);
            }
        }

        if (qcItem204?.METHOD) {
            const methodControl = Section204.getControl('Section204Method');
            if (methodControl) {
                await methodControl.setValue(qcItem204.METHOD);
            }
        }

        if (qcItem204?.DECISION_TAKEN) {
            const decisionControl = Section204.getControl('Section204DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem204.DECISION_TAKEN);
            }
        }

        // --- Image section handling ---
        const dynamicImageSection = FormSectionedTable.getSection('Section204DynamicImage');
        const staticImageSection = FormSectionedTable.getSection('Section204StaticImage');
        const userInputImageSection = FormSectionedTable.getSection('Section204UserInputImage');

        const binding = pageProxy.getBindingObject();
        const fallbackImage = '/TRL_Snorkel_Digitization_TSL/Images/NoImageAvailable.png';

        await staticImageSection?.setVisible(true);
        await userInputImageSection?.setVisible(true); // Default

        if (dynamicImageSection && attachments?.length > 0) {
            const firstAttachment = attachments[0];
            const base64 = firstAttachment?.file;
            const mimeType = firstAttachment?.mimeType || 'image/png';

            if (base64 && base64.length > 100) {
                binding.imageUri = `data:${mimeType};base64,${base64}`;
                await dynamicImageSection.setVisible(true);
                await dynamicImageSection.redraw();
                await userInputImageSection?.setVisible(false);
            } else {
                binding.imageUri = fallbackImage;
                await dynamicImageSection.setVisible(false);
                await dynamicImageSection.redraw();
                await userInputImageSection?.setVisible(true);
            }

            // Show next form if applicable
            const nextForm = FormSectionedTable.getSection('Section205Form');
            if (nextForm) {
                await nextForm.setVisible(true);
            }
        } else {
            binding.imageUri = fallbackImage;
            await dynamicImageSection?.setVisible(false);
            await dynamicImageSection?.redraw();
            await userInputImageSection?.setVisible(true);
        }

    } catch (error) {
        console.error("Error loading Section204 data:", error);
    }
}
