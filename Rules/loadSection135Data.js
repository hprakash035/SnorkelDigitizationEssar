export async function loadSection135Data(pageProxy, qcItem135, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section135 = FormSectionedTable.getSection('Section135Form');
        if (!section135) {
            throw new Error("Section135Form not found.");
        }

        const nextButton = section135.getControl('Section135StaticNextButton');

        // ✅ Determine if metadata is available (you can customize this condition)
        // const hasMetaData = qcItem135?.DATE_INSPECTED || qcItem135?.INSPECTED_BY || qcItem135?.METHOD || qcItem135?.DECISION_TAKEN;

        if (nextButton) {
            await nextButton.setVisible(false); // Hide if metadata is available
        }

        await section135.setVisible(true);

        if (qcItem135?.DATE_INSPECTED) {
            const dateControl = section135.getControl('Section135Date');
            if (dateControl) {
                await dateControl.setValue(qcItem135.DATE_INSPECTED);
            }
        }

        if (qcItem135?.INSPECTED_BY) {
            const inspectedByControl = section135.getControl('Section135InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem135.INSPECTED_BY);
            }
            
      
            await nextButton.setVisible(false); // Hide if metadata is available
        
        }

        if (qcItem135?.METHOD) {
            const methodControl = section135.getControl('Section135Method');
            if (methodControl) {
                await methodControl.setValue(qcItem135.METHOD);
            }
        }

        if (qcItem135?.DECISION_TAKEN) {
            const decisionControl = section135.getControl('Section135DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem135.DECISION_TAKEN);
            }
        }

        const dynamicImageSection = FormSectionedTable.getSection('Section135DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section135UserInputImage');
        const staticImageSection = FormSectionedTable.getSection('Section135StaticImage');

        await userInputImageSection?.setVisible(true);
        await staticImageSection?.setVisible(true);

        const binding = pageProxy.getBindingObject();

        if (dynamicImageSection && attachments.length > 0) {
            const firstAttachment = attachments[0];
            const base64 = firstAttachment?.file;
            const mimeType = firstAttachment?.mimeType || 'image/png';

            if (base64 && base64.length > 100) {
                binding.imageUri = `data:${mimeType};base64,${base64}`;
                await dynamicImageSection.setVisible(true);
                await dynamicImageSection.redraw();

                if (userInputImageSection) {
                    await userInputImageSection.setVisible(false);
                }
            } else {
                binding.imageUri = '/TRL_Snorkel_Digitization_TSL/Images/NoImageAvailable.png';
                await dynamicImageSection.setVisible(false);
                await dynamicImageSection.redraw();

                if (userInputImageSection) {
                    await userInputImageSection.setVisible(true);
                }
            }

            FormSectionedTable.getSection('Section136Form').setVisible(true);
        } else {
            binding.imageUri = '/TRL_Snorkel_Digitization_TSL/Images/NoImageAvailable.png';
            await dynamicImageSection?.setVisible(false);
            await dynamicImageSection?.redraw();

            if (userInputImageSection) {
                await userInputImageSection.setVisible(true);
            }
        }

    } catch (error) {
        // Handle errors appropriately
        console.error("Error loading Section135 data:", error);
    }
}