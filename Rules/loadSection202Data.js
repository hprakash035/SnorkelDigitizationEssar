export async function loadSection202Data(pageProxy, qcItem202, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section202 = FormSectionedTable.getSection('Section202Form');
        if (!Section202) {
            throw new Error("Section202Form not found in FormSectionedTable.");
        }

        await Section202.setVisible(true);

        const nextButton = Section202.getControl('Section202NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section202Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section202.setVisible(true);

        if (qcItem202?.DATE_INSPECTED) {
            const dateControl = Section202.getControl('Section202Date');
            if (dateControl) {
                await dateControl.setValue(qcItem202.DATE_INSPECTED);
            }
        }

        if (qcItem202?.INSPECTED_BY) {
            const inspectedByControl = Section202.getControl('Section202InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem202.INSPECTED_BY);
            }
        }

        if (qcItem202?.METHOD) {
            const methodControl = Section202.getControl('Section202Method');
            if (methodControl) {
                await methodControl.setValue(qcItem202.METHOD);
            }
        }

        if (qcItem202?.DECISION_TAKEN) {
            const decisionControl = Section202.getControl('Section202DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem202.DECISION_TAKEN);
            }
        }


        
    // --- Dynamic image logic ---
    const dynamicImageSection = FormSectionedTable.getSection('Section202DynamicImage');
    const staticImageSection = FormSectionedTable.getSection('Section202StaticImage');
    const userInputImageSection = FormSectionedTable.getSection('Section202UserInputImage');
    const binding = pageProxy.getBindingObject();

    if (staticImageSection) await staticImageSection.setVisible(true);

    if (dynamicImageSection && attachments?.length > 0) {
      const first = attachments[0];
      const base64 = first?.file;
      const mime = first?.mimeType || 'image/png';

      if (base64 && base64.length > 100) {
        binding.imageUri = `data:${mime};base64,${base64}`;

        await dynamicImageSection.setVisible(true);
        await dynamicImageSection.redraw();
        await userInputImageSection?.setVisible(false);
      } else {
        await userInputImageSection?.setVisible(true);
      }
    } else {
      await userInputImageSection?.setVisible(true);
    }

    } catch (error) {
        console.error("Error loading Section202 data:", error);
    }
}
