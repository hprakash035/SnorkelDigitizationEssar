export async function loadSection203Data(pageProxy, qcItem203, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section203 = FormSectionedTable.getSection('Section203Form');
        if (!Section203) {
            throw new Error("Section203Form not found in FormSectionedTable.");
        }

        await Section203.setVisible(true);

        const nextButton = Section203.getControl('Section203NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section203Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section203.setVisible(true);

        if (qcItem203?.DATE_INSPECTED) {
            const dateControl = Section203.getControl('Section203Date');
            if (dateControl) {
                await dateControl.setValue(qcItem203.DATE_INSPECTED);
            }
        }

        if (qcItem203?.INSPECTED_BY) {
            const inspectedByControl = Section203.getControl('Section203InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem203.INSPECTED_BY);
            }
        }

        if (qcItem203?.METHOD) {
            const methodControl = Section203.getControl('Section203Method');
            if (methodControl) {
                await methodControl.setValue(qcItem203.METHOD);
            }
        }

        if (qcItem203?.DECISION_TAKEN) {
            const decisionControl = Section203.getControl('Section203DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem203.DECISION_TAKEN);
            }
        }


        
    // --- Dynamic image logic ---
    const dynamicImageSection = FormSectionedTable.getSection('Section203DynamicImage');
    const staticImageSection = FormSectionedTable.getSection('Section203StaticImage');
    const userInputImageSection = FormSectionedTable.getSection('Section203UserInputImage');
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
        console.error("Error loading Section203 data:", error);
    }
}
