export async function loadSection204Data(pageProxy, qcItem204, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section204 = FormSectionedTable.getSection('Section204Form');
        if (!Section204) {
            throw new Error("Section204Form not found in FormSectionedTable.");
        }

        await Section204.setVisible(true);

        const nextButton = Section204.getControl('Section204NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section204Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section204.setVisible(true);

        if (qcItem204?.DATE_INSPECTED) {
            const dateControl = Section204.getControl('Section204Date');
            if (dateControl) {
                await dateControl.setValue(qcItem204.DATE_INSPECTED);
            }
        }

        if (qcItem204?.INSPECTED_BY) {
            const inspectedByControl = Section204.getControl('Section204InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem204.INSPECTED_BY);
            }
        }

        if (qcItem204?.METHOD) {
            const methodControl = Section204.getControl('Section204Method');
            if (methodControl) {
                await methodControl.setValue(qcItem204.METHOD);
            }
        }

        if (qcItem204?.DECISION_TAKEN) {
            const decisionControl = Section204.getControl('Section204DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem204.DECISION_TAKEN);
            }
        }


        
    // --- Dynamic image logic ---
    const dynamicImageSection = FormSectionedTable.getSection('Section204DynamicImage');
    const staticImageSection = FormSectionedTable.getSection('Section204StaticImage');
    const userInputImageSection = FormSectionedTable.getSection('Section204UserInputImage');
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
        console.error("Error loading Section204 data:", error);
    }
}
