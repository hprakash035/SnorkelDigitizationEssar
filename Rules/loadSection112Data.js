export async function loadSection112Data(pageProxy, qcItem112, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section112 = FormSectionedTable.getSection('Section112Form');
        if (!Section112) {
            throw new Error("Section112Form not found in FormSectionedTable.");
        }

        await Section112.setVisible(true);

        const nextButton = Section112.getControl('Section112StaticNextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section112StaticImage');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
                  const Section41Form1 = FormSectionedTable.getSection('Section112UserInputImage');
                if (Section41Form) {
                    await Section41Form1.setVisible(true);
                }
                
            }
           
        }

        const Section112Date31Control = Section112.getControl('Section112Date');
        if (Section112Date31Control && qcItem112.DATE_INSPECTED) {
            await Section112Date31Control.setValue(qcItem112.DATE_INSPECTED); 
        }

        const Section112InspectedBy31Control = Section112.getControl('Section112InspectedBy');
        if (Section112InspectedBy31Control && qcItem112.INSPECTED_BY) {
            await Section112InspectedBy31Control.setValue([qcItem112.INSPECTED_BY]);
        }

        const Section112InspectionMethod31Control = Section112.getControl('Section112Method');
        if (Section112InspectionMethod31Control && qcItem112.METHOD) {
            await Section112InspectionMethod31Control.setValue(qcItem112.METHOD);
        }

        const Section112DecisionTaken31Control = Section112.getControl('Section112DecisionTaken');
        if (Section112DecisionTaken31Control && qcItem112.DECISION_TAKEN) {
            await Section112DecisionTaken31Control.setValue([qcItem112.DECISION_TAKEN]);
        }
      
        const dynamicImageSection = FormSectionedTable.getSection('Section112DynamicImage');
        const userInputImageSection = FormSectionedTable.getSection('Section112UserInputImage');
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
          const Section113Form = FormSectionedTable.getSection('Section113Form');
            if (Section113Form) {
                await Section113Form.setVisible(true);
            }
    } catch (error) {
        console.error("Error in loadSection112Data:", error);
    }
}
