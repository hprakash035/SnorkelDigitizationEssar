export async function loadSection162Data(
    pageProxy,
    qcItem162,
    FormSectionedTable,
    attachments = [],
    flags = {},
    testdataArray = []
) {
    try {
        console.log("▶ loadSection162Data: Starting...");

        // Section 162
        const section162 = FormSectionedTable.getSection('Section162Form');
        if (!section162) {
            console.error("❌ Section162Form not found in FormSectionedTable.");
            return;
        }
        await section162.setVisible(true);
        console.log("✔ Section162Form made visible");

        // Next button handling
        const nextButton = section162.getControl('Section162NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            console.log("✔ Next button hidden in Section162Form");

            if (flags?.next === false) {
                const section171 = FormSectionedTable.getSection('Section171Form');
                if (section171) {
                    await section171.setVisible(true);
                    console.log("✔ Section171Form made visible due to flags.next = false");
                } else {
                    console.warn("⚠ Section171Form not found while handling navigation flag");
                }
            }
        } else {
            console.warn("⚠ Next button not found in Section162Form");
        }

        // Map QC item data
        const fieldMappings = {
            DATE_INSPECTED: 'Section162InspectionDate',
            INSPECTED_BY: 'Section162InspectedBy',
            METHOD: 'Section162InspectionMethod',
            DECISION_TAKEN: 'Section162DecisionTaken',
        };

        for (const [field, controlName] of Object.entries(fieldMappings)) {
            const value = qcItem162?.[field];
            console.log(` ⤷ Mapping ${field} → ${controlName}:`, value);
            if (value !== undefined && value !== null) {
                const control = section162.getControl(controlName);
                if (control) {
                    await control.setValue(value);
                    console.log(`   • Set ${controlName} to`, value);
                } else {
                    console.warn(`   • Control ${controlName} not found`);
                }
            }
        }

        // Mixing test section
        const testForm = FormSectionedTable.getSection('Section162TestForm');
        const testHeader = FormSectionedTable.getSection('Section162TestName');
        const mixingTests = testdataArray.filter(t =>
            t.testname?.includes("mixing the outer castable")
        );
        console.log("→ Found mixingTests:", mixingTests.length);

        if (testHeader) {
            await testHeader.setVisible(true);
            console.log("✔ testHeader (Section162TestName) made visible");
        } else {
            console.warn("⚠ testHeader (Section162TestName) not found");
        }

        if (testForm && mixingTests.length > 0) {
            await testForm.setVisible(true);
            console.log("✔ testForm (Section162TestForm) made visible");

            for (let i = 0; i < Math.min(mixingTests.length, 5); i++) {
                const test = mixingTests[i];
                const suffix = i + 1;
                console.log(` ⤷ Processing mixing test #${suffix}:`, test);

                const setFormValue = async (ctrl, val) => {
                    console.log(`   • Setting ${ctrl} →`, val);
                    const c = testForm.getControl(ctrl);
                    if (!c) return console.warn(`     - Control ${ctrl} not found`);
                    if (val !== undefined && val !== null) {
                        await c.setValue(val);
                        console.log(`     - Value set on control ${ctrl}`);
                    }
                };

                await setFormValue(`Section162PowerWeight${suffix}`, test.powderweight);
                await setFormValue(`Section162WaterCasting${suffix}`, test.watercasting);

                const fluidityValue = test.fluidity?.toLowerCase();
                console.log(`   • Fluidity processed to →`, fluidityValue);
                if (fluidityValue === "ok" || fluidityValue === "not_ok") {
                    await setFormValue(`Section162FludityOfCastable${suffix}`, [fluidityValue]);
                } else {
                    console.warn(`   • Invalid or missing fluidity for test #${suffix}:`, test.fluidity);
                }

                await setFormValue(`Section162AddingVibration${suffix}`, test.vibration);
                await setFormValue(`Section162Remark${suffix}`, test.remark);
            }
        } else {
            console.warn("⚠ testForm not found or no mixingTests to process");
        }

        // Gap test section
        const gapHeader = FormSectionedTable.getSection('SectionFormCell5');
        const gapForm = FormSectionedTable.getSection('Section162Test2Form');
        const positionMap = {
            "12:00 direction": "A",
            "3:00 direction": "B",
            "6:00 direction": "C",
            "9:00 direction": "D"
        };
        const gapTests = testdataArray.filter(t =>
            t.testname?.includes("gap between the top")
        );
        console.log("→ Found gapTests:", gapTests.length);

        if (gapHeader) {
            await gapHeader.setVisible(true);
            console.log("✔ gapHeader (SectionFormCell5) made visible");
        } else {
            console.warn("⚠ gapHeader not found");
        }

        if (gapForm && gapTests.length > 0) {
            await gapForm.setVisible(true);
            console.log("✔ gapForm (Section162Test2Form) made visible");

            gapTests.forEach(gap => {
                console.log(" ⤷ Processing gap test:", gap);
                const suffix = positionMap[gap.position];
                console.log(`   • Mapped position '${gap.position}' → suffix`, suffix);
                if (!suffix) {
                    return console.warn(`   • Unknown position value:`, gap.position);
                }

                const ctrlName = `Section162TestActualGap${suffix}`;
                const ctrl = gapForm.getControl(ctrlName);

                if (ctrl) {
                    try {
                        ctrl.setValue(gap.actualvalue ?? "0");
                        console.log(`   • Set ${ctrlName} →`, gap.actualvalue);
                    } catch (e) {
                        console.warn(`   • Failed to set ${ctrlName}:`, e);
                    }
                } else {
                    console.warn(`   • Control ${ctrlName} not found`);
                }
            });
        } else {
            console.warn("⚠ gapForm not found or no gapTests to process");
        }
const Section162StaticImage = FormSectionedTable.getSection('Section162StaticImage');
            if (Section162StaticImage) {
                Section162StaticImage.setVisible(true);
            }
        // Dynamic image section
        const dynamicImageSection = FormSectionedTable.getSection('Section162DynamicImage');
        const binding = pageProxy.getBindingObject();

        if (dynamicImageSection && attachments.length > 0) {
            const firstAttachment = attachments[0];
            const base64 = firstAttachment?.file;
            const mimeType = firstAttachment?.mimeType || 'image/png';

            if (base64 && base64.length > 100) {
                binding.imageUri = `data:${mimeType};base64,${base64}`;
                dynamicImageSection.setVisible(true);
                dynamicImageSection.redraw();
            } else {
                binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
                dynamicImageSection.setVisible(false);
                dynamicImageSection.redraw();
            }
        } else {
            binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
            dynamicImageSection?.setVisible(false);
            dynamicImageSection?.redraw();

            const Section162UserInputImage = FormSectionedTable.getSection('Section162UserInputImage');
            if (Section162UserInputImage) {
                Section162UserInputImage.setVisible(true);
            }
        }

        console.log("✔ loadSection162Data: Finished successfully.");
    } catch (error) {
        console.error("❌ Error loading Section162 data:", error);
    }
}
