export async function loadSection92Data(pageProxy, qcItem92, FormSectionedTable, attachments, flags, testdataArray) {
    try {
        const Section92 = FormSectionedTable.getSection('Section92Form');
        if (!Section92) {
            throw new Error("Section92Form not found in FormSectionedTable.");
        }

        await Section92.setVisible(true);

        const nextButton = Section92.getControl('Section101NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            
            if (flags?.next === false) {
              
                const Section41Form = FormSectionedTable.getSection('Section91TestNameForm');
                if (Section41Form) {
                    await Section41Form.setVisible(true);
                }
                const Section91TestForm = FormSectionedTable.getSection('Section91TestForm');
                if (Section91TestForm) {
                    await Section91TestForm.setVisible(true);
                }
            }
           
        }
       

        const Section92Date31Control = Section92.getControl('Section92Date');
        if (Section92Date31Control && qcItem92.DATE_INSPECTED) {
            await Section92Date31Control.setValue(qcItem92.DATE_INSPECTED); 
        }

        const Section92InspectedBy31Control = Section92.getControl('Section92InspectedBy');
        if (Section92InspectedBy31Control && qcItem92.INSPECTED_BY) {
            await Section92InspectedBy31Control.setValue([qcItem92.INSPECTED_BY]);
        }

        const Section92InspectionMethod31Control = Section92.getControl('Section92Method');
        if (Section92InspectionMethod31Control && qcItem92.METHOD) {
            await Section92InspectionMethod31Control.setValue(qcItem92.METHOD);
        }

        const Section92DecisionTaken31Control = Section92.getControl('Section92DecisionTaken');
        if (Section92DecisionTaken31Control && qcItem92.DECISION_TAKEN) {
            await Section92DecisionTaken31Control.setValue([qcItem92.DECISION_TAKEN]);
        }

        
    try {
        // Get the Section header & form
        const Section91TestName = FormSectionedTable.getSection('Section91TestName');
        const Section91TestForm = FormSectionedTable.getSection('Section91TestForm');

        if (!Section91TestName || !Section91TestForm) {
            console.warn("⚠️ Section91 form or header not found.");
            return;
        }

        // Make both visible
        await Section91TestName.setVisible(true);
        await Section91TestForm.setVisible(true);

        // Define mapping: position → control suffix (1, 2, 3)
        const positionMap = {
            '1': 1, 'ROW 1': 1,
            '2': 2, 'ROW 2': 2,
            '3': 3, 'ROW 3': 3
        };

        // Optional: sort by row number
        const sortedTestData = [...testdataArray].sort((a, b) => {
            const posA = parseInt((a.position || '').replace(/\D/g, ''), 10) || 0;
            const posB = parseInt((b.position || '').replace(/\D/g, ''), 10) || 0;
            return posA - posB;
        });

        // Loop over test data and populate fields
        for (const test of sortedTestData) {
            const rawPos = (test.position || '').toUpperCase().trim();
            const suffix = positionMap[rawPos];
            if (!suffix) {
                console.warn(`⚠️ [Section91] Unknown position: ${test.position}`);
                continue;
            }

            // Map test field names from backend → control names in UI
            const controlMap = {
                waterCasting: `Section91TestWaterCasteing${suffix}`,
                ff: `Section91FF${suffix}`,
                tf: `Section91TF${suffix}`,
                settingTime: `Section91SettingTime${suffix}`,
                remark: suffix === 3 && !test.remark ? 'FormCellSimpleProperty0' : `Section91TestRemark${suffix}`
            };

            // Set values — only if they exist in test object
            for (const [fieldKey, controlId] of Object.entries(controlMap)) {
                if (test[fieldKey] !== undefined) {
                    const ctrl = Section91TestForm.getControl(controlId);
                    if (ctrl) {
                        await ctrl.setValue(test[fieldKey] || '');
                        await ctrl.redraw();
                    } else {
                        console.warn(`⚠️ Control not found: ${controlId}`);
                    }
                }
            }
        }

        // Handle Next button logic
        const nextButton = Section91TestForm.getControl('Section101NextButton');
        if (nextButton) {
            await nextButton.setVisible(false);
            if (flags?.next === false) {
                const Section101Form = FormSectionedTable.getSection('Section101Form');
                if (Section101Form) {
                    await Section101Form.setVisible(true);
                }
            }
        }

    } catch (error) {
        console.error("❌ Error in loadSection91Data:", error);
    }



    } catch (error) {
        console.error("Error in loadSection92Data:", error);
    }
}
