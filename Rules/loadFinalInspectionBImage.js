/**
 * Load Final Inspection B Image Section with dynamic and user input image toggle
 * @param {IPageProxy} pageProxy
 * @param {IControlProxy} FormSectionedTable
 * @param {Object[]} attachments - qc_ATTACHMENTS array from backend
 */
export async function loadFinalInspectionBImage(pageProxy, FormSectionedTable, attachments = []) {
  const dynamicImageSection = FormSectionedTable.getSection('SectionFinalBDynamicImage');
  const userInputImageSection = FormSectionedTable.getSection('SectionFinalUserInputImageB');
  const binding = pageProxy.getBindingObject();

  const QUESTION_KEY = "Final Inspection B"; // backend "question"

  async function setSectionVisibility(section, visible) {
    if (section) {
      await section.setVisible(visible);
      await section.redraw();
    }
  }

  try {
    if (!dynamicImageSection) throw new Error(" SectionFinalBDynamicImage not found");
    if (!userInputImageSection) throw new Error(" SectionFinalUserInputImageB not found");

    // Filter attachments for this question
    const filteredAttachments = attachments.filter(att => att.question === QUESTION_KEY);

    if (filteredAttachments.length > 0) {
      const file = filteredAttachments[0];
      const base64 = file?.file;
      const mimeType = file?.mimeType || "image/png";

      if (base64 && base64.length > 100) {
        binding.imageBUri = `data:${mimeType};base64,${base64}`;
        await setSectionVisibility(dynamicImageSection, true);
        await setSectionVisibility(userInputImageSection, false);
        return;
      }
    }

    //  No valid attachment found → fallback
    binding.imageBUri = "/TRL_RH_SnorkelApp/Images/NoImageAvailable.png";
    await setSectionVisibility(dynamicImageSection, false);
    await setSectionVisibility(userInputImageSection, true);

  } catch (error) {
    console.error(" Error loading Final Inspection B image:", error);
  }
}