export async function loadSection135Data(pageProxy, qcItem135, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        // console.log("Starting loadSection135Data");

        const section135 = FormSectionedTable.getSection('Section135Form');
        if (!section135) {
            throw new Error("Section135Form not found.");
        }
        // console.log("Section135Form found.");

        const nextButton = section135.getControl('SectionNextButton');
        if (nextButton) {
            // console.log("Hiding SectionNextButton");
            await nextButton.setVisible(false);
        }

        await section135.setVisible(true);
        // console.log("Section135Form set to visible");

        if (qcItem135?.DATE_INSPECTED) {
            const dateControl = section135.getControl('Section135Date');
            if (dateControl) {
                // console.log("Setting DATE_INSPECTED:", qcItem135.DATE_INSPECTED);
                await dateControl.setValue(qcItem135.DATE_INSPECTED);
            }
        }

        if (qcItem135?.INSPECTED_BY) {
            const inspectedByControl = section135.getControl('Section135InspectedBy');
            if (inspectedByControl) {
                // console.log("Setting INSPECTED_BY:", qcItem135.INSPECTED_BY);
                await inspectedByControl.setValue(qcItem135.INSPECTED_BY);
            }
        }

        if (qcItem135?.METHOD) {
            const methodControl = section135.getControl('Section135Method');
            if (methodControl) {
                // console.log("Setting METHOD:", qcItem135.METHOD);
                await methodControl.setValue(qcItem135.METHOD);
            }
        }

        if (qcItem135?.DECISION_TAKEN) {
            const decisionControl = section135.getControl('Section135DecisionTaken');
            if (decisionControl) {
                // console.log("Setting DECISION_TAKEN:", qcItem135.DECISION_TAKEN);
                await decisionControl.setValue(qcItem135.DECISION_TAKEN);
            }
        }

        // console.log("Making static image section visible");
        

        const dynamicImageSection = FormSectionedTable.getSection('Section135DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section135UserInputImage');
        userInputImageSection.setVisible(true);
const staticImageSection = FormSectionedTable.getSection('Section135StaticImage').setVisible(true);
        const binding = pageProxy.getBindingObject();

        // console.log("Attachments:", attachments);

        if (dynamicImageSection && attachments.length > 0) {
            const firstAttachment = attachments[0];
            const base64 = firstAttachment?.file;
            const mimeType = firstAttachment?.mimeType || 'image/png';

            // console.log("Processing first attachment:", firstAttachment);

            if (base64 && base64.length > 100) {
                // console.log("Valid image attachment found, setting image URI");
                binding.imageUri = `data:${mimeType};base64,${base64}`;
                await dynamicImageSection.setVisible(true);
                await dynamicImageSection.redraw();

                if (userInputImageSection) {
                    // console.log("Hiding user input image section");
                    await userInputImageSection.setVisible(false);
                }
            } else {
                // console.warn("Attachment too short or missing, using placeholder image");
                binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
                await dynamicImageSection.setVisible(false);
                await dynamicImageSection.redraw();

                if (userInputImageSection) {
                    // console.log("Showing user input image section");
                    await userInputImageSection.setVisible(true);
                }
            }

            // console.log("Showing Section141Form");
            FormSectionedTable.getSection('Section136Form').setVisible(true);
        } else {
            // console.warn("No dynamic image section or no attachments, using fallback image");
            binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
            await dynamicImageSection?.setVisible(false);
            await dynamicImageSection?.redraw();

            if (userInputImageSection) {
                // console.log("Showing user input image section (fallback)");
                await userInputImageSection.setVisible(true);
            }
        }

        // console.log("Section135 data loaded successfully");

    } catch (error) {
        // console.error("Error loading Section135 data:", error);
    }
}
