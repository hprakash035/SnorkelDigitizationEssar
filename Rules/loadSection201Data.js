export async function loadSection201Data(pageProxy, qcItem201, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section201 = FormSectionedTable.getSection('Section201Form');
        if (!Section201) {
            throw new Error("Section201Form not found in FormSectionedTable.");
        }

        await Section201.setVisible(true);

        const nextButton = Section201.getControl('Section202NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section202Form');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
            }
           
        }

        await Section201.setVisible(true);

        if (qcItem201?.DATE_INSPECTED) {
            const dateControl = Section201.getControl('Section201Date');
            if (dateControl) {
                await dateControl.setValue(qcItem201.DATE_INSPECTED);
            }
        }

        if (qcItem201?.INSPECTED_BY) {
            const inspectedByControl = Section201.getControl('Section201InspectedBy');
            if (inspectedByControl) {
                await inspectedByControl.setValue(qcItem201.INSPECTED_BY);
            }
        }

        if (qcItem201?.METHOD) {
            const methodControl = Section201.getControl('Section201Method');
            if (methodControl) {
                await methodControl.setValue(qcItem201.METHOD);
            }
        }

        if (qcItem201?.DECISION_TAKEN) {
            const decisionControl = Section201.getControl('Section201DecisionTaken');
            if (decisionControl) {
                await decisionControl.setValue(qcItem201.DECISION_TAKEN);
            }
        }


        
    // --- Dynamic image logic ---
    const dynamicImageSection = FormSectionedTable.getSection('Section201DynamicImage');
    const staticImageSection = FormSectionedTable.getSection('Section201StaticImage');
    const userInputImageSection = FormSectionedTable.getSection('Section201UserInputImage');
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
        console.error("Error loading Section201 data:", error);
    }
}
