export async function loadSection162Data(
    pageProxy,
    qcItem162,
    FormSectionedTable,
    attachments = [],
    flags = {},
    testdataArray = []
) {
    try {
        const section162 = FormSectionedTable.getSection('Section162Form');
        if (!section162) return;

        await section162.setVisible(true);

        // Next button of Section162
        const nextButton = section162.getControl('Section162TestNextButton');

        // Check if Section162 form has metadata
        const hasFormData =
            qcItem162?.DATE_INSPECTED ||
            qcItem162?.INSPECTED_BY ||
            qcItem162?.METHOD ||
            qcItem162?.DECISION_TAKEN;

        if (hasFormData) {
            if (nextButton) await nextButton.setVisible(false);

            // --- Populate metadata fields ---
            if (qcItem162?.DATE_INSPECTED) {
                const ctrl = section162.getControl('Section162Date');
                if (ctrl) await ctrl.setValue(qcItem162.DATE_INSPECTED);
            }

            if (qcItem162?.INSPECTED_BY) {
                const ctrl = section162.getControl('Section162InspectedBy');
                if (ctrl) await ctrl.setValue([qcItem162.INSPECTED_BY]); // ListPicker expects array
            }

            if (qcItem162?.METHOD) {
                const ctrl = section162.getControl('Section162Method');
                if (ctrl) await ctrl.setValue(qcItem162.METHOD);
            }

            if (qcItem162?.DECISION_TAKEN) {
                const ctrl = section162.getControl('Section162DecisionTaken');
                if (ctrl) await ctrl.setValue([qcItem162.DECISION_TAKEN]); // ListPicker expects array
            }

            // --- Show Test1 header & form
            const testHeader = FormSectionedTable.getSection('Section162TestName');
            const testForm = FormSectionedTable.getSection('Section162TestForm');
            if (testHeader) await testHeader.setVisible(true);
            if (testForm) await testForm.setVisible(true);

            // --- Test 1 (Mixing test data)
            const mixingTests = testdataArray.filter(t =>
                t.testname?.includes("*10  Actual situation for mixing the outer castable")
            );

            let hasTest1Data = false;

            if (mixingTests.length > 0 && testForm) {
                for (let i = 0; i < Math.min(mixingTests.length, 5); i++) {
                    const test = mixingTests[i];
                    const suffix = i + 1;

                    const setVal = async (ctrl, val) => {
                        const c = testForm.getControl(ctrl);
                        if (c && val != null) await c.setValue(val);
                    };

                    if (test.batchNo) {
                        hasTest1Data = true;
                        await setVal(`Section162TestBatchNo${suffix}`, test.batchNo);
                    }
                    if (test.powderweight) {
                        hasTest1Data = true;
                        await setVal(`Section162PowerWeight${suffix}`, test.powderweight);
                    }
                    if (test.watercasting) {
                        hasTest1Data = true;
                        await setVal(`Section162WaterCasting${suffix}`, test.watercasting);
                    }
                    if (test.fluidity) {
                        hasTest1Data = true;
                        await setVal(`Section162FludityOfCastable${suffix}`, [test.fluidity.toLowerCase()]);
                    }
                    if (test.vibration) {
                        hasTest1Data = true;
                        await setVal(`Section162AddingVibration${suffix}`, [test.vibration.toLowerCase()]);
                    }
                    if (test.remark) {
                        hasTest1Data = true;
                        await setVal(`Section162Remark${suffix}`, test.remark);
                    }
                }

                // Hide Test1 Next button if data filled
                const test1Next = testForm.getControl('Section162Test2NextButton');
                if (hasTest1Data && test1Next) await test1Next.setVisible(false);
            }

            // --- Show image sections ONLY if TestForm has data ---
            let hasDynamicImage = false;
            if (hasTest1Data) {
                const staticImg = FormSectionedTable.getSection('Section162StaticImage');
                if (staticImg) await staticImg.setVisible(true);

                const dynamicImg = FormSectionedTable.getSection('Section162DynamicImage');
                const userInputImg = FormSectionedTable.getSection('Section162UserInputImage');
                const binding = pageProxy.getBindingObject();

                if (dynamicImg && attachments.length > 0) {
                    const file = attachments[0]?.file;
                    const mimeType = attachments[0]?.mimeType || 'image/png';

                    if (file && file.length > 100) {
                        binding.imageUri = `data:${mimeType};base64,${file}`;
                        await dynamicImg.setVisible(true);
                        await dynamicImg.redraw();
                        if (userInputImg) await userInputImg.setVisible(false);
                        hasDynamicImage = true;
                    } else {
                        binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
                        await dynamicImg.setVisible(false);
                        await userInputImg?.setVisible(true);
                    }
                } else {
                    binding.imageUri = '/TRL_RH_SnorkelApp/Images/NoImageAvailable.png';
                    await dynamicImg?.setVisible(false);
                    await userInputImg?.setVisible(true);
                }
            }

            // --- Test 2 (Gap test, only if Test1 data + dynamic image exist)
            if ( hasDynamicImage) {
                const gapHeader = FormSectionedTable.getSection('SectionFormCell5');
                const gapForm = FormSectionedTable.getSection('Section162Test2Form');

                if (gapHeader) await gapHeader.setVisible(true);
                if (gapForm) {
                    await gapForm.setVisible(true);

                    const positionMap = {
                        "12:00 direction": "A",
                        "3:00 direction": "B",
                        "6:00 direction": "C",
                        "9:00 direction": "D"
                    };

                    const gapTests = testdataArray.filter(t =>
                        t.testname?.includes("*11 The gap between the top of brick surface to the top face of castable")
                    );

                    let hasGapData = false;

                    for (const gap of gapTests) {
                        const suffix = positionMap[gap.position];
                        if (!suffix) continue;

                        const ctrl = gapForm.getControl(`Section162TestActualGap${suffix}`);
                        if (ctrl && gap.actualvalue) {
                            await ctrl.setValue(gap.actualvalue);
                            hasGapData = true;
                            //   FormSectionedTable.getSection('Section151FormOutlet').setVisible(true);
                              gapForm.getControl('Section162StaticNextButton').setVisible(false);;
                        }
                    }

                  
                }
            } else {
                // Hide Test2 if either Test1 data or dynamic image is missing
                await FormSectionedTable.getSection('Section162Test2FormName')?.setVisible(false);
                await FormSectionedTable.getSection('Section162Test2Form')?.setVisible(false);
            }
        } else {
            if (nextButton) await nextButton.setVisible(true);
        }
    } catch (err) {
        console.error("❌ Error in loadSection162Data:", err);
    }
}