export async function loadSection113Data(pageProxy, qcItem113, FormSectionedTable, attachments = [], flags, testdataArray = []) {
  try {
    // -------------------------------
    // Section lookup
    // -------------------------------
    const Section113 = FormSectionedTable.getSection('Section113Form');
    if (!Section113) throw new Error("❌ Section113Form not found in FormSectionedTable.");

    await Section113.setVisible(true);

    // -------------------------------
    // Hide NEXT button immediately
    // -------------------------------
    const nextButton = Section113.getControl('Section113StaticNextButton');
    if (nextButton) {
      await nextButton.setVisible(false);

      // If flags block navigation, show static + user input image
      if (flags?.next === false) {
        const staticImageSection = FormSectionedTable.getSection('Section113StaticImage');
        const userInputImageSection = FormSectionedTable.getSection('Section113UserInputImage');

        await staticImageSection?.setVisible(true);
        await userInputImageSection?.setVisible(true);
      }
    }

    // -------------------------------
    // Metadata population
    // -------------------------------
    let hasMetadata = false;

    const setValueIfPresent = async (controlName, value) => {
      const control = Section113.getControl(controlName);
      if (control && value !== undefined && value !== null) {
        await control.setValue(value);
        hasMetadata = true;
      }
    };

    await setValueIfPresent('Section113Date', qcItem113.DATE_INSPECTED);
    await setValueIfPresent('Section113InspectedBy', qcItem113.INSPECTED_BY ? [qcItem113.INSPECTED_BY] : undefined);
    await setValueIfPresent('Section113Method', qcItem113.METHOD);
    await setValueIfPresent('Section113DecisionTaken', qcItem113.DECISION_TAKEN ? [qcItem113.DECISION_TAKEN] : undefined);

    // -------------------------------
    // Image handling (only if metadata exists)
    // -------------------------------
    const dynamicImageSection = FormSectionedTable.getSection('Section113DynamicImage');
    const staticImageSection = FormSectionedTable.getSection('Section113StaticImage');
    const userInputImageSection = FormSectionedTable.getSection('Section113UserInputImage');
    const binding = pageProxy.getBindingObject();

    let hasDynamicImage = false;

    if (hasMetadata) {
      if (dynamicImageSection && attachments.length > 0) {
        const firstAttachment = attachments[0];
        const base64 = firstAttachment?.file;
        const mimeType = firstAttachment?.mimeType || 'image/png';

        if (base64 && base64.length > 100) {
          binding.imageUri = `data:${mimeType};base64,${base64}`;
          await dynamicImageSection.setVisible(true);
          await dynamicImageSection.redraw();

          hasDynamicImage = true;

          await staticImageSection?.setVisible(true);
          await userInputImageSection?.setVisible(false);
        }
      }

      if (!hasDynamicImage) {
        binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
        await dynamicImageSection?.setVisible(false);
        await dynamicImageSection?.redraw();

        await staticImageSection?.setVisible(true);
        await userInputImageSection?.setVisible(true);
      }
    } else {
      // Hide all image sections if no metadata
      await dynamicImageSection?.setVisible(false);
      await staticImageSection?.setVisible(false);
      await userInputImageSection?.setVisible(false);
    }

    // -------------------------------
    // Section 121 visibility (✅ only if dynamic image exists)
    // -------------------------------
    const Section121Form = FormSectionedTable.getSection('Section121Form');
    if (Section121Form) {
      await Section121Form.setVisible(hasDynamicImage);
    }
  } catch (error) {
    console.error("❌ Error in loadSection113Data:", error);
  }
}
