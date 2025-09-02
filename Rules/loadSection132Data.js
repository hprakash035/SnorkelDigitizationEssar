export async function loadSection132Data(
  pageProxy,
  qcItem132,
  FormSectionedTable,
  attachments = [],
  flags,
  testdataArray = []
) {
  try {
    // --- Sections ---
    const section132 = FormSectionedTable.getSection('Section132Form');
    if (!section132) throw new Error('❌ Section132Form not found');

    const testHeader = FormSectionedTable.getSection('Section132TestFormName');
    const testForm = FormSectionedTable.getSection('Section132TestForm');

    await section132.setVisible(true);
    await testHeader?.setVisible(true);
    await testForm?.setVisible(true);

    // --- Helpers ---
    const setHeaderValue = async (ctrlName, value, { asArray = false } = {}) => {
      const c = section132.getControl(ctrlName);
      if (!c) {
        return;
      }
      const v = asArray
        ? (value !== undefined && value !== null ? [value] : [])
        : (value ?? '');
      await c.setValue(v);
      if (c.redraw) await c.redraw();
    };

    const setTestValue = async (ctrlName, value) => {
      if (!testForm) return;
      const c = testForm.getControl(ctrlName);
      if (!c) {
        return;
      }
      await c.setValue(value ?? '');
      if (c.redraw) await c.redraw();
    };

    const compat = (obj, ...keys) =>
      keys.reduce((acc, k) => (acc !== undefined && acc !== null ? acc : obj?.[k]), undefined);

    // --- Header values ---
    const rawDate = qcItem132?.DATE_INSPECTED;
    const dateVal = rawDate ? new Date(rawDate) : undefined;

    await setHeaderValue('Section132Date', dateVal);
    await setHeaderValue('Section132InspectedBy', qcItem132?.INSPECTED_BY, { asArray: true });
    await setHeaderValue('Section132Method', qcItem132?.METHOD);
    await setHeaderValue('Section132DecisionTaken', qcItem132?.DECISION_TAKEN, { asArray: true });

    // --- Dynamic image logic ---
    const dynamicImageSection = FormSectionedTable.getSection('Section132DynamicImage');
    const staticImageSection = FormSectionedTable.getSection('Section132StaticImage');
    const userInputImageSection = FormSectionedTable.getSection('Section132UserInputImage123');
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

    // --- Filter and sort test data for Section 132 ---
    const testsFor132 = Array.isArray(testdataArray)
      ? testdataArray.filter((t) => {
          const q = (compat(t, 'QUESTION', 'question', 'testname') || '').toLowerCase();
          return (
            q.includes('*8') ||
            q.includes('13.2') ||
            q.includes('gap measurement between 2nd ring brick') ||
            q.includes('center position of the ring brick')
          );
        })
      : [];

    // --- Sort by position label suffix: e.g., Gap-A, Gap-B, etc.
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

    // --- Map up to 4 test entries into the controls
    for (let i = 0; i < Math.min(sortedTests.length, 4); i++) {
      const t = sortedTests[i];
      const idx = i + 1;

      const position = compat(t, 'POSITION', 'position') ?? '';
      const tolerance = compat(t, 'TOLERANCE', 'tolerance') ?? '';
      const method = compat(t, 'METHOD', 'method');
      const actualValue = compat(t, 'ACTUAL_VALUE', 'actualvalue', 'actual_value') ?? '';

      await setTestValue(`Section132Position${idx}`, position);
      await setTestValue(`Section132Tolerence${idx}`, tolerance);
      if (method !== undefined && method !== null) {
        await setTestValue(`Section132Method${idx}`, method);
      }
      await setTestValue(`Section132ActualValue${idx}`, actualValue);
    }

    // --- Next button logic ---
    if (testForm) {
      const nextBtn = testForm.getControl('Section133NextButton');
      if (nextBtn) {
        if (sortedTests.length > 0) {
          await nextBtn.setVisible(false);
          if (flags?.next === false) {
            const nextSection = FormSectionedTable.getSection('Section133Form');
            await nextSection?.setVisible(true);
          }
        } else {
          await nextBtn.setVisible(true);
        }
      }
    }
  } catch (error) {
    // Handle error if needed, or silently ignore
  }
}
