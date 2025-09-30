/**
 * Load Final Inspection A Image Section with dynamic and user input image toggle
 * @param {IPageProxy} pageProxy
 * @param {IControlProxy} FormSectionedTable
 * @param {Object[]} attachments - qc_ATTACHMENTS array from backend
 */
/**
 * Load Final Inspection A Image Section with dynamic and user input image toggle
 * @param {IPageProxy} pageProxy
 * @param {IControlProxy} FormSectionedTable
 * @param {Object[]} attachments - qc_ATTACHMENTS array from backend
 */
export async function loadFinalInspectionAImage(pageProxy, FormSectionedTable, attachments = []) {
  const dynamicImageSection = FormSectionedTable.getSection('SectionFinalADynamicImage');
  const userInputImageSection = FormSectionedTable.getSection('SectionFinalUserInputImageA');
  const binding = pageProxy.getBindingObject();

  const QUESTION_KEY = "Final Inspection A"; //  match backend "question"

  async function setSectionVisibility(section, visible) {
    if (section) {
      await section.setVisible(visible);
      await section.redraw();
    }
  }

  try {
    if (!dynamicImageSection) throw new Error(" SectionFinalADynamicImage not found");
    if (!userInputImageSection) throw new Error(" SectionFinalUserInputImageA not found");

    //  Filter attachments for this question
    const filteredAttachments = attachments.filter(att => att.question === QUESTION_KEY);

    if (filteredAttachments.length > 0) {
      const firstAttachment = filteredAttachments[0];
      const base64 = firstAttachment?.file;
      const mimeType = firstAttachment?.mimeType || 'image/png';

      if (base64 && base64.length > 100) {
        binding.imageUri = `data:${mimeType};base64,${base64}`;
        await setSectionVisibility(dynamicImageSection, true);
        await setSectionVisibility(userInputImageSection, false);
        return;
      }
    }

   
    binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
    await setSectionVisibility(dynamicImageSection, false);
    await setSectionVisibility(userInputImageSection, true);

  } catch (error) {
    console.error(" Error loading Final Inspection A image:", error);
  }
}
