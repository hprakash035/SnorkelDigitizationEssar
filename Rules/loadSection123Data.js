export async function loadSection123Data(pageProxy, qcItem123, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section123 = FormSectionedTable.getSection('Section123Form');
        if (!Section123) {
            throw new Error("Section123Form not found in FormSectionedTable.");
        }

        await Section123.setVisible(true);

        const nextButton = Section123.getControl('Secion123StaticButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section123StaticImage');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
                  const Section41Form1 = FormSectionedTable.getSection('Section123UserInputImage');
                if (Section41Form) {
                    await Section41Form1.setVisible(true);
                }
                
            }
           
        }

        const Section123Date31Control = Section123.getControl('Section123Date');
        if (Section123Date31Control && qcItem123.DATE_INSPECTED) {
            await Section123Date31Control.setValue(qcItem123.DATE_INSPECTED); 
        }

        const Section123InspectedBy31Control = Section123.getControl('Section123InspectedBy');
        if (Section123InspectedBy31Control && qcItem123.INSPECTED_BY) {
            await Section123InspectedBy31Control.setValue([qcItem123.INSPECTED_BY]);
        }

        const Section123InspectionMethod31Control = Section123.getControl('Section123Method');
        if (Section123InspectionMethod31Control && qcItem123.METHOD) {
            await Section123InspectionMethod31Control.setValue(qcItem123.METHOD);
        }

        const Section123DecisionTaken31Control = Section123.getControl('Section123DecisionTaken');
        if (Section123DecisionTaken31Control && qcItem123.DECISION_TAKEN) {
            await Section123DecisionTaken31Control.setValue([qcItem123.DECISION_TAKEN]);
        }
      
        const dynamicImageSection = FormSectionedTable.getSection('Section123DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section123UserInputImage');
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
        } else {
            binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
            await dynamicImageSection?.setVisible(false);
            await dynamicImageSection?.redraw();

            // Show user input image section
            if (userInputImageSection) {
                await userInputImageSection.setVisible(true);
            }
        }
          const Section123Form = FormSectionedTable.getSection('Section131Form');
            if (Section123Form) {
                await Section123Form.setVisible(true);
            }
    } catch (error) {
        console.error("Error in loadSection123Data:", error);
    }
}
