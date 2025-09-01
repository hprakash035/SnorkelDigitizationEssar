export async function loadSection113Data(pageProxy, qcItem113, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section113 = FormSectionedTable.getSection('Section113Form');
        if (!Section113) {
            throw new Error("Section113Form not found in FormSectionedTable.");
        }

        await Section113.setVisible(true);

        const nextButton = Section113.getControl('Section113StaticNextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section113StaticImage');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
                  const Section41Form1 = FormSectionedTable.getSection('Section113UserInputImage');
                if (Section41Form) {
                    await Section41Form1.setVisible(true);
                }
                
            }
           
        }

        const Section113Date31Control = Section113.getControl('Section113Date');
        if (Section113Date31Control && qcItem113.DATE_INSPECTED) {
            await Section113Date31Control.setValue(qcItem113.DATE_INSPECTED); 
        }

        const Section113InspectedBy31Control = Section113.getControl('Section113InspectedBy');
        if (Section113InspectedBy31Control && qcItem113.INSPECTED_BY) {
            await Section113InspectedBy31Control.setValue([qcItem113.INSPECTED_BY]);
        }

        const Section113InspectionMethod31Control = Section113.getControl('Section113Method');
        if (Section113InspectionMethod31Control && qcItem113.METHOD) {
            await Section113InspectionMethod31Control.setValue(qcItem113.METHOD);
        }

        const Section113DecisionTaken31Control = Section113.getControl('Section113DecisionTaken');
        if (Section113DecisionTaken31Control && qcItem113.DECISION_TAKEN) {
            await Section113DecisionTaken31Control.setValue([qcItem113.DECISION_TAKEN]);
        }
      
        const dynamicImageSection = FormSectionedTable.getSection('Section113DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section113UserInputImage');
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
          const Section113Form = FormSectionedTable.getSection('Section121Form');
            if (Section113Form) {
                await Section113Form.setVisible(true);
            }
    } catch (error) {
        console.error("Error in loadSection113Data:", error);
    }
}
