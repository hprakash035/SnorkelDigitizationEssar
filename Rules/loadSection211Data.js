export async function loadSection211Data(pageProxy, qcItem211, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section211 = FormSectionedTable.getSection('Section211Form');
        if (!section211) {
            throw new Error("Section211Form not found.");
        }

        const nextButton = section211.getControl('Section211StaticNextButton');

        // ✅ Determine if metadata is available (you can customize this condition)
        // const hasMetaData = qcItem211?.DATE_INSPECTED || qcItem211?.INSPECTED_BY || qcItem211?.METHOD || qcItem211?.DECISION_TAKEN;

        if (nextButton) {
            await nextButton.setVisible(false); // Hide if metadata is available
        }

        await section211.setVisible(true);

        if (qcItem211?.DATE_INSPECTED) {
            const dateControl = section211.getControl('Section211Date');
            if (dateControl) {
                await dateControl.setValue(qcItem211.DATE_INSPECTED);
            }
        }

        if (qcItem211?.INSPECTED_BY) {
            const inspectedByControl = section211.getControl('Section211InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem211.INSPECTED_BY);
            }
            
      
            await nextButton.setVisible(false); // Hide if metadata is available
        
        }

        if (qcItem211?.METHOD) {
            const methodControl = section211.getControl('Section211Method');
            if (methodControl) {
                await methodControl.setValue(qcItem211.METHOD);
            }
        }

        if (qcItem211?.DECISION_TAKEN) {
            const decisionControl = section211.getControl('Section211DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem211.DECISION_TAKEN);
            }
        }

        const dynamicImageSection = FormSectionedTable.getSection('Section211DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section211UserInputForm');
        const staticImageSection = FormSectionedTable.getSection('Section211StaticImage');

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

            FormSectionedTable.getSection('Section212Form').setVisible(true);
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
        console.error("Error loading Section211 data:", error);
    }
}