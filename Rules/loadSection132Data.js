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

    // These two must exist so we can write into the test controls
    const testHeader = FormSectionedTable.getSection('Section132TestFormName');
    const testForm   = FormSectionedTable.getSection('Section132TestForm');

    // Make everything we need visible before writing values
    await section132.setVisible(true);
    await testHeader?.setVisible(true);
    await testForm?.setVisible(true);

    // --- Helpers ---
    const setHeaderValue = async (ctrlName, value, {asArray = false} = {}) => {
      const c = section132.getControl(ctrlName);
      if (!c) {
        console.warn(`⚠️ Header control not found: ${ctrlName}`);
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
        console.warn(`⚠️ Test control not found: ${ctrlName}`);
        return;
      }
      await c.setValue(value ?? '');
      if (c.redraw) await c.redraw();
    };

    const compat = (obj, ...keys) =>
      keys.reduce((acc, k) => (acc !== undefined && acc !== null ? acc : obj?.[k]), undefined);

    // --- Header values (Date, ListPickers need arrays) ---
    const rawDate = qcItem132?.DATE_INSPECTED;
    const dateVal = rawDate ? new Date(rawDate) : undefined; // MDK DatePicker accepts Date object
    await setHeaderValue('Section132Date', dateVal);
    await setHeaderValue('Section132InspectedBy', qcItem132?.INSPECTED_BY, { asArray: true });
    await setHeaderValue('Section132Method', qcItem132?.METHOD);
    await setHeaderValue('Section132DecisionTaken', qcItem132?.DECISION_TAKEN, { asArray: true });

    // --- Dynamic image (safe, optional) ---
    const dynamicImageSection = FormSectionedTable.getSection('Section132DynamicImage');
    const Section132StaticImage = FormSectionedTable.getSection('Section132StaticImage');
    Section132StaticImage.setVisible(true);
    const userInputImageSection = FormSectionedTable.getSection('Section132UserInputImage123');
    const binding = pageProxy.getBindingObject();

   if (dynamicImageSection && attachments?.length > 0) {
  const first = attachments[0];
  const base64 = first?.file;
  const mime   = first?.mimeType || 'image/png';
  if (base64 && base64.length > 100) {
    // Show dynamic image only
    binding.imageUri = `data:${mime};base64,${base64}`;
    await dynamicImageSection.setVisible(true);
    await dynamicImageSection.redraw();
    await userInputImageSection?.setVisible(false);
  } else {
    // No valid image, show both static and user input image sections
    // binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
    // await dynamicImageSection.setVisible(true); // Make static image visible
    // await dynamicImageSection.redraw();
    await userInputImageSection?.setVisible(true);
  }
} else {
  // No attachments at all
  // binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
  // await dynamicImageSection?.setVisible(true); // Show static image
  // await dynamicImageSection?.redraw();
  await userInputImageSection?.setVisible(true); // Show input image
}


    // --- Filter test rows for *this* section (like your Section102 logic) ---
    // Your payload sample has QUESTION: "13.2 Center position of the ring brick  *8"
    // The Section header caption is "*8 Gap measurement between 2nd ring brick and the Core Shell"
    // We'll match on "*8" OR "13.2" OR the phrase to be safe.
    const testsFor132 = Array.isArray(testdataArray)
      ? testdataArray.filter(t => {
          const q = (compat(t, 'QUESTION', 'question', 'testname') || '').toString().toLowerCase();
          return q.includes('*8') ||
                 q.includes('13.2') ||
                 q.includes('gap measurement between 2nd ring brick') ||
                 q.includes('center position of the ring brick');
        })
      : [];

    // Sort by POSITION if present (1..4), otherwise keep incoming order
    const toNum = (v) => {
      const n = Number(String(v).replace(/\D+/g, '') || NaN);
      return Number.isNaN(n) ? 9999 : n;
    };
    const sorted = [...testsFor132].sort((a, b) => toNum(compat(a,'POSITION','position')) - toNum(compat(b,'POSITION','position')));

    // --- Map up to 4 rows into controls 1..4 ---
    for (let i = 0; i < Math.min(sorted.length, 4); i++) {
      const t = sorted[i];
      const idx = i + 1;

      const POSITION     = compat(t, 'POSITION','position');
      const TOLERANCE    = compat(t, 'TOLERANCE','tolerance');
      const METHOD       = compat(t, 'METHOD','method');
      const ACTUAL_VALUE = compat(t, 'ACTUAL_VALUE','actualvalue','actual_value');

      await setTestValue(`Section132Position${idx}`, POSITION ?? '');
      // Note: control name is "Tolerence" (with 'e'), matching your JSON
      await setTestValue(`Section132Tolerence${idx}`, TOLERANCE ?? '');
      // If METHOD missing, keep whatever default is already in the control
      if (METHOD !== undefined && METHOD !== null) {
        await setTestValue(`Section132Method${idx}`, METHOD);
      }
      await setTestValue(`Section132ActualValue${idx}`, ACTUAL_VALUE ?? '');
    }

    // --- Next button logic like Section41/102 ---
    if (testForm) {
      const nextBtn = testForm.getControl('Section133NextButton');
      if (nextBtn) {
        if (sorted.length > 0) {
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

    console.log('✅ loadSection132Data completed');
  } catch (error) {
    console.error('❌ Error in loadSection132Data:', error);
  }
}
