// Section131.js
export async function loadSection131Data(pageProxy, qcItem131, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section131 = FormSectionedTable.getSection('Section131Form');
        if (!section131) {
            throw new Error("Section131Form not found.");
        }

        const nextButton = section131.getControl('Secion131StaticButton');
        if (nextButton) {
            await nextButton.setVisible(false);
        }

        await section131.setVisible(true);

        if (qcItem131?.DATE_INSPECTED) {
            const dateControl = section131.getControl('Section131Date');
            if (dateControl) {
                await dateControl.setValue(qcItem131.DATE_INSPECTED);
            }
        }

        if (qcItem131?.INSPECTED_BY) {
            const inspectedByControl = section131.getControl('Section131InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem131.INSPECTED_BY);
            }
        }

        if (qcItem131?.METHOD) {
            const methodControl = section131.getControl('Section131Method');
            if (methodControl) {
                await methodControl.setValue(qcItem131.METHOD);
            }
        }

        if (qcItem131?.DECISION_TAKEN) {
            const decisionControl = section131.getControl('Section131DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem131.DECISION_TAKEN);
            }
        }
       
        const staticImageSection = FormSectionedTable.getSection('Section131StaticImage').setVisible(true);
        const dynamicImageSection = FormSectionedTable.getSection('Section131DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section131UserInputImage');
        const binding = pageProxy.getBindingObject();

        if (dynamicImageSection && attachments.length > 0) {
            const firstAttachment = attachments[0];
            const base64 = firstAttachment?.file;
            const mimeType = firstAttachment?.mimeType || 'image/png';

            if (base64 && base64.length > 100) {
                binding.imageUri = `data:${mimeType};base64,${base64}`;
                await dynamicImageSection.setVisible(true);
                await dynamicImageSection.redraw();

                // Hide user input image section
                if (userInputImageSection) {
                    await userInputImageSection.setVisible(false);
                }
            } else {
                binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
                await dynamicImageSection.setVisible(false);
                await dynamicImageSection.redraw();

                // Show user input image section
                if (userInputImageSection) {
                    await userInputImageSection.setVisible(true);
                }
            }

             FormSectionedTable.getSection('Section132Form').setVisible(true);
        } else {
            binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
            await dynamicImageSection?.setVisible(false);
            await dynamicImageSection?.redraw();

            // Show user input image section
            if (userInputImageSection) {
                await userInputImageSection.setVisible(true);
            }
        }



    } catch (error) {
        console.error("Error loading Section131 data:", error);
    }
}
