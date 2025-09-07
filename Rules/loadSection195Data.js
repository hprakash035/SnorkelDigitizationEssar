export async function loadSection195Data(pageProxy, qcItem195, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section195 = FormSectionedTable.getSection('Section195Form');
        if (!Section195) {
            throw new Error("Section195Form not found in FormSectionedTable.");
        }

        await Section195.setVisible(true);

        const nextButton = Section195.getControl('Section201NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section201Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section195.setVisible(true);

        if (qcItem195?.DATE_INSPECTED) {
            const dateControl = Section195.getControl('Section195Date');
            if (dateControl) {
                await dateControl.setValue(qcItem195.DATE_INSPECTED);
            }
        }

        if (qcItem195?.INSPECTED_BY) {
            const inspectedByControl = Section195.getControl('Section195InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem195.INSPECTED_BY);
            }
        }

        if (qcItem195?.METHOD) {
            const methodControl = Section195.getControl('Section195Method');
            if (methodControl) {
                await methodControl.setValue(qcItem195.METHOD);
            }
        }

        if (qcItem195?.DECISION_TAKEN) {
            const decisionControl = Section195.getControl('Section195DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem195.DECISION_TAKEN);
            }
        }


        
    // --- Dynamic image logic ---
    const dynamicImageSection = FormSectionedTable.getSection('Section195DynamicImage');
    const staticImageSection = FormSectionedTable.getSection('Section195StaticImage');
    const userInputImageSection = FormSectionedTable.getSection('Section195UserInputImage123');
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
        console.error("Error loading Section195 data:", error);
    }
}
