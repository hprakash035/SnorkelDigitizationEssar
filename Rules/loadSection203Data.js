export async function loadSection203Data(pageProxy, qcItem203, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section203 = FormSectionedTable.getSection('Section203Form');
        if (!Section203) {
            throw new Error("Section203Form not found in FormSectionedTable.");
        }

        await Section203.setVisible(true);

        const nextButton = Section203.getControl('Section204NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        if (flags?.next === false) {
            // Optionally show the next section if flag requires it
            const SectionNext = FormSectionedTable.getSection('Section204Form');
            if (SectionNext) {
                await SectionNext.setVisible(true);
            }
        }

        // Populate metadata fields
        if (qcItem203?.DATE_INSPECTED) {
            const dateControl = Section203.getControl('Section203Date');
            if (dateControl) {
                await dateControl.setValue(qcItem203.DATE_INSPECTED);
            }
        }

        if (qcItem203?.INSPECTED_BY) {
            const inspectedByControl = Section203.getControl('Section203InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem203.INSPECTED_BY);
            }
        }

        if (qcItem203?.METHOD) {
            const methodControl = Section203.getControl('Section203Method');
            if (methodControl) {
                await methodControl.setValue(qcItem203.METHOD);
            }
        }

        if (qcItem203?.DECISION_TAKEN) {
            const decisionControl = Section203.getControl('Section203DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem203.DECISION_TAKEN);
            }
        }

        // --- Image section handling ---
        const dynamicImageSection = FormSectionedTable.getSection('Section203DynamicImage');
        const staticImageSection = FormSectionedTable.getSection('Section203StaticImage');
        const userInputImageSection = FormSectionedTable.getSection('Section203UserInputForm');
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
            const nextSection = FormSectionedTable.getSection('Section204Form');
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
        console.error("Error loading Section203 data:", error);
    }
}
