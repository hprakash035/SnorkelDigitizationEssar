export async function loadSection202Data(pageProxy, qcItem202, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section202 = FormSectionedTable.getSection('Section202Form');
        if (!Section202) {
            throw new Error("Section202Form not found in FormSectionedTable.");
        }

        await Section202.setVisible(true);

        const nextButton = Section202.getControl('Section203NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        if (flags?.next === false) {
            // Optionally show the next section if flag requires it
            const SectionNext = FormSectionedTable.getSection('Section203Form');
            if (SectionNext) {
                await SectionNext.setVisible(true);
            }
        }

        // Populate metadata fields
        if (qcItem202?.DATE_INSPECTED) {
            const dateControl = Section202.getControl('Section202Date');
            if (dateControl) {
                await dateControl.setValue(qcItem202.DATE_INSPECTED);
            }
        }

        if (qcItem202?.INSPECTED_BY) {
            const inspectedByControl = Section202.getControl('Section202InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem202.INSPECTED_BY);
            }
        }

        if (qcItem202?.METHOD) {
            const methodControl = Section202.getControl('Section202Method');
            if (methodControl) {
                await methodControl.setValue(qcItem202.METHOD);
            }
        }

        if (qcItem202?.DECISION_TAKEN) {
            const decisionControl = Section202.getControl('Section202DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem202.DECISION_TAKEN);
            }
        }

        // --- Image section handling ---
        const dynamicImageSection = FormSectionedTable.getSection('Section202DynamicImage');
        const staticImageSection = FormSectionedTable.getSection('Section202StaticImage');
        const userInputImageSection = FormSectionedTable.getSection('Section202UserInputImage');
        const binding = pageProxy.getBindingObject();

        await staticImageSection?.setVisible(true);
        await userInputImageSection?.setVisible(true); // Default visible

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
                binding.imageUri = '/TRL_Snorkel_Digitization_TSL/Images/NoImageAvailable.png';
                await dynamicImageSection.setVisible(false);
                await dynamicImageSection.redraw();

                await userInputImageSection?.setVisible(true);
            }

            // If you want to show next form (e.g., Section203) like in Section211 logic
            const nextSection = FormSectionedTable.getSection('Section203Form');
            if (nextSection) {
                await nextSection.setVisible(true);
            }

        } else {
            binding.imageUri = '/TRL_Snorkel_Digitization_TSL/Images/NoImageAvailable.png';
            await dynamicImageSection?.setVisible(false);
            await dynamicImageSection?.redraw();

            await userInputImageSection?.setVisible(true);
        }

    } catch (error) {
        console.error("Error loading Section202 data:", error);
    }
}
