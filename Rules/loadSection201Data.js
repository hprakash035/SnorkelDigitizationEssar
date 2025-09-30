export async function loadSection201Data(pageProxy, qcItem201, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const section201 = FormSectionedTable.getSection('Section201Form');
        if (!section201) {
            throw new Error("Section201Form not found.");
        }

        const nextButton = section201.getControl('Section202NextButton');

        // ✅ Determine if metadata is available (you can customize this condition)
        // const hasMetaData = qcItem201?.DATE_INSPECTED || qcItem201?.INSPECTED_BY || qcItem201?.METHOD || qcItem201?.DECISION_TAKEN;

        if (nextButton) {
            await nextButton.setVisible(false); // Hide if metadata is available
        }

        await section201.setVisible(true);

        if (qcItem201?.DATE_INSPECTED) {
            const dateControl = section201.getControl('Section201Date');
            if (dateControl) {
                await dateControl.setValue(qcItem201.DATE_INSPECTED);
            }
        }

        if (qcItem201?.INSPECTED_BY) {
            const inspectedByControl = section201.getControl('Section201InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem201.INSPECTED_BY);
            }
            
      
            await nextButton.setVisible(false); // Hide if metadata is available
        
        }

        if (qcItem201?.METHOD) {
            const methodControl = section201.getControl('Section201Method');
            if (methodControl) {
                await methodControl.setValue(qcItem201.METHOD);
            }
        }

        if (qcItem201?.DECISION_TAKEN) {
            const decisionControl = section201.getControl('Section201DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem201.DECISION_TAKEN);
            }
        }

        const dynamicImageSection = FormSectionedTable.getSection('Section201DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section201UserInputForm');
        const staticImageSection = FormSectionedTable.getSection('Section201StaticImage');

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
                binding.imageUri = 'TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
                await dynamicImageSection.setVisible(false);
                await dynamicImageSection.redraw();

                if (userInputImageSection) {
                    await userInputImageSection.setVisible(true);
                }
            }

            FormSectionedTable.getSection('Section202Form').setVisible(true);
        } else {
            binding.imageUri = 'TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
            await dynamicImageSection?.setVisible(false);
            await dynamicImageSection?.redraw();

            if (userInputImageSection) {
                await userInputImageSection.setVisible(true);
            }
        }

    } catch (error) {
        // Handle errors appropriately
        console.error("Error loading Section201 data:", error);
    }
}