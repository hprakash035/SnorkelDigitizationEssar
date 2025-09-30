export async function loadSection132Data(
  pageProxy,
  qcItem132,
  FormSectionedTable,
  attachments = [],
  flags,
  testdataArray = []
) {
  try {
    // console.log("🚀 Starting loadSection132Data");

    // -------------------------------
    // Section References
    // -------------------------------
    const section132 = FormSectionedTable.getSection('Section132Form');
    if (!section132) throw new Error('❌ Section132Form not found');

    const testHeader = FormSectionedTable.getSection('Section132TestFormName');
    const testForm = FormSectionedTable.getSection('Section132TestForm');

    const dynamicImageSection = FormSectionedTable.getSection('Section132DynamicImage');
    const staticImageSection = FormSectionedTable.getSection('Section132StaticImage');
    const userInputImageSection = FormSectionedTable.getSection('Section132UserInputImage123');

    const binding = pageProxy.getBindingObject();

    // -------------------------------
    // Helper Functions
    // -------------------------------
    const setValueIfPresent = async (controlName, value, section = section132, asArray = false) => {
      const control = section?.getControl(controlName);
      if (control && value !== undefined && value !== null) {
        // console.log(`📝 Setting control [${controlName}] =`, value);
        await control.setValue(asArray ? [value] : value);
      }
    };

    const hideNextButton = async (section, buttonName) => {
      if (section) {
        const btn = section.getControl(buttonName);
        if (btn) {
          // console.log(`🚫 Hiding button: ${buttonName}`);
          await btn.setVisible(false);
        }
      }
    };

    const compat = (obj, ...keys) =>
      keys.reduce((acc, k) => (acc !== undefined && acc !== null ? acc : obj?.[k]), undefined);

    // -------------------------------
    // Set Section132 Header Metadata
    // -------------------------------
    // console.log("📋 Populating Section132 header metadata");
    await section132.setVisible(true);

    const rawDate = qcItem132?.DATE_INSPECTED;
    const dateVal = rawDate ? new Date(rawDate) : undefined;

    await setValueIfPresent('Section132Date', dateVal);
    await setValueIfPresent('Section132InspectedBy', qcItem132?.INSPECTED_BY, section132, true);
    await setValueIfPresent('Section132Method', qcItem132?.METHOD);
    await setValueIfPresent('Section132DecisionTaken', qcItem132?.DECISION_TAKEN, section132, true);
    await hideNextButton(section132, 'Section132StaticNextButton');

    // -------------------------------
    // Image Handling
    // -------------------------------
    // console.log("🖼️ Handling image logic");

    if (staticImageSection) {
      // console.log("📷 Showing static image section");
      await staticImageSection.setVisible(true);
    }

    let hasDynamicImage = false;

    if (dynamicImageSection && attachments.length > 0) {
      // console.log("📂 Attachment found:", attachments);

      const first = attachments[0];
      const base64 = first?.file;
      const mime = first?.mimeType || 'image/png';

      // console.log("🔍 base64 length:", base64?.length);
      // console.log("🔍 mime type:", mime);

      if (base64 && base64.length > 100) {
        binding.imageUri = `data:${mime};base64,${base64}`;
        // console.log("✅ Set binding.imageUri to:", binding.imageUri);

        await dynamicImageSection.setVisible(true);
        await dynamicImageSection.redraw();
        hasDynamicImage = true;

        if (userInputImageSection) {
          // console.log("🙈 Hiding user input image section");
          await userInputImageSection.setVisible(false);
        }
      } else {
        // console.warn("⚠️ base64 is too short or invalid, showing fallback");
      }
    }

    if (!hasDynamicImage) {
      // console.log("❌ No valid dynamic image. Using fallback.");
      binding.imageUri = '/TRL_Snorkel_Digitization_TSL/Images/NoImageAvailable.png';
      await dynamicImageSection?.setVisible(false);
      await dynamicImageSection?.redraw();
      if (userInputImageSection) {
        // console.log("📤 Showing user input image section");
        await userInputImageSection.setVisible(true);
      }
    }

    // -------------------------------
    // Filter and Sort Test Data
    // -------------------------------
    // console.log("🔍 Filtering test data for Section132");
    const testsFor132 = Array.isArray(testdataArray)
      ? testdataArray.filter((t) => {
          const q = (compat(t, 'QUESTION', 'question', 'testname') || '').toLowerCase();
          return (
            q.includes('*7') ||
            q.includes('13.2') ||
            q.includes('gap measurement between 2nd ring brick') ||
            q.includes('center position of the ring brick')
          );
        })
      : [];

    // console.log("✅ Filtered tests:", testsFor132);

    const extractSuffixLetter = (str) => {
      const match = str?.match(/Gap-([A-Z])/i);
      return match ? match[1].toUpperCase() : 'Z'; // Default Z to sort unknowns last
    };

    const sortByPosition = (a, b) => {
      const aLetter = extractSuffixLetter(compat(a, 'POSITION', 'position'));
      const bLetter = extractSuffixLetter(compat(b, 'POSITION', 'position'));
      return aLetter.localeCompare(bLetter);
    };

    const sortedTests = [...testsFor132].sort(sortByPosition);
    // console.log("🔢 Sorted tests:", sortedTests);

    // -------------------------------
    // Populate Test Form (max 4 entries)
    // -------------------------------
    let hasTestData = false;

    if (sortedTests.length > 0 && testForm && testHeader) {
      // console.log("🧪 Populating test form with data");
      await testHeader.setVisible(true);
      await testForm.setVisible(true);
      hasTestData = true;

      for (let i = 0; i < Math.min(sortedTests.length, 4); i++) {
        const t = sortedTests[i];
        const idx = i + 1;

        const position = compat(t, 'POSITION', 'position') ?? '';
        const tolerance = compat(t, 'TOLERANCE', 'tolerance') ?? '';
        const method = compat(t, 'METHOD', 'method');
        const actualValue = compat(t, 'ACTUAL_VALUE', 'actualvalue', 'actual_value') ?? '';

        // console.log(`🔢 Entry ${idx}:`, { position, tolerance, method, actualValue });

        await setValueIfPresent(`Section132Position${idx}`, position, testForm);
        await setValueIfPresent(`Section132Tolerence${idx}`, tolerance, testForm);
        if (method !== undefined && method !== null) {
          await setValueIfPresent(`Section132Method${idx}`, method, testForm);
        }
        await setValueIfPresent(`Section132ActualValue${idx}`, actualValue, testForm);
      }

      await hideNextButton(testForm, 'Section133NextButton');
    } else {
      // console.warn("❌ No test data found → hiding test form");
      await testForm?.setVisible(true);
      await testHeader?.setVisible(true);
    }

    // -------------------------------
    // Optional: Section133 visibility based on flag
    // -------------------------------
    if (hasTestData && flags?.next === false) {
      const nextSection = FormSectionedTable.getSection('Section133Form');
      if (nextSection) {
        // console.log("➡️ Showing Section133Form");
        await nextSection.setVisible(true);
      }
    }

    // console.log("✅ loadSection132Data completed successfully");
  } catch (error) {
    // console.error("❌ Error in loadSection132Data:", error);
  }
}