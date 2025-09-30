export async function loadSection212Data(pageProxy, qcItem212, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section212 = FormSectionedTable.getSection('Section212Form');
        if (!section212) {
            throw new Error("Section212Form not found.");
        }

        const nextButton = section212.getControl('Section212StaticNextButton');

        // ✅ Determine if metadata is available (you can customize this condition)
        // const hasMetaData = qcItem212?.DATE_INSPECTED || qcItem212?.INSPECTED_BY || qcItem212?.METHOD || qcItem212?.DECISION_TAKEN;

        if (nextButton) {
            await nextButton.setVisible(false); // Hide if metadata is available
        }

        await section212.setVisible(true);

        if (qcItem212?.DATE_INSPECTED) {
            const dateControl = section212.getControl('Section212Date');
            if (dateControl) {
                await dateControl.setValue(qcItem212.DATE_INSPECTED);
            }
        }

        if (qcItem212?.INSPECTED_BY) {
            const inspectedByControl = section212.getControl('Section212InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem212.INSPECTED_BY);
            }
            
      
            await nextButton.setVisible(false); // Hide if metadata is available
        
        }

        if (qcItem212?.METHOD) {
            const methodControl = section212.getControl('Section212Method');
            if (methodControl) {
                await methodControl.setValue(qcItem212.METHOD);
            }
        }

        if (qcItem212?.DECISION_TAKEN) {
            const decisionControl = section212.getControl('Section212DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem212.DECISION_TAKEN);
            }
        }

        const dynamicImageSection = FormSectionedTable.getSection('Section212DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section212UserInputForm');
        const staticImageSection = FormSectionedTable.getSection('Section212StaticImage');

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

            FormSectionedTable.getSection('Section213Form').setVisible(true);
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
        console.error("Error loading Section212 data:", error);
    }
}