import LoadSnorkelData5 from './LoadSnorkelData5';

export default async function UpdateSnorkelData_Sheet5(clientAPI) {
    // console.log('🚀 Entered UpdateSnorkelData_Sheet3');
    clientAPI.showActivityIndicator("...");
    const snorkelNo = clientAPI.binding.SNORKEL_NO;
    const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
    try {
        const pageProxy = clientAPI.getPageProxy();
        // console.log('📌 Got pageProxy:', pageProxy);

        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        // console.log('📌 Got FormSectionedTable:', FormSectionedTable);

        const binding = pageProxy.getBindingObject();
        // console.log('📌 Got binding object:', binding);

        // console.log('🔗 Service Path:', service);

        // console.log('🔍 SnorkelNo Value:', snorkelNo);

        const headerResults = await clientAPI.read(service, 'QC_HEADER', [], `$filter=SNORKEL_NO eq '${snorkelNo}'`);
        // console.log('📥 headerResults:', headerResults);

        if (!headerResults || !Array.isArray(headerResults._array) || headerResults._array.length !== 1) {
            // console.error('❌ QC_HEADER not found or multiple found', headerResults);
            throw new Error(`❌ QC_HEADER not found or multiple found`);
        }

        const header = headerResults._array[0];
        // console.log('📌 Loaded header:', header);

        const headerReadLink = header['@odata.readLink'];
        // console.log('🔗 headerReadLink:', headerReadLink);

        const itemsResult = await clientAPI.read(service, `${headerReadLink}/qc_ITEMS`, [], '');
        // console.log('📥 itemsResult:', itemsResult);

        const items = itemsResult?._array || [];
        // console.log(`🔍 Found ${items.length} QC_ITEMs`);

        for (const item of items) {
            const question = item.QUESTION || '';
            const sectionKey = question.match(/^(\d+\.\d+)/)?.[1];
            // console.log(`➡️ Processing item ID: ${item.ID}, Question: ${question}, SectionKey: ${sectionKey}`);

            if (!sectionKey) {
                // console.warn(`⚠️ No sectionKey extracted for item ${item.ID}`);
                continue;
            }

            const sectionId = getSectionFormId(sectionKey);
            // console.log(`🔗 Mapped sectionKey ${sectionKey} → sectionId ${sectionId}`);

            const section = FormSectionedTable.getSection(sectionId);
            // console.log(`📌 Section object for ${sectionId}:`, section);

            if (!section) {
                // console.warn(`⚠️ No section found for ID: ${sectionId}`);
                continue;
            }

            if (!section.getVisible()) {
                // console.warn(`⚠️ Section ${sectionId} not visible`);
                continue;
            }

            const values = await getUpdatedValuesForSection(sectionKey, section);
            // console.log(`📥 Extracted values for item ${item.ID}:`, values);

            if (Object.keys(values).length === 0) {
                // console.warn(`⚠️ No values to update for item ${item.ID}`);
                continue;
            }

            const itemReadLink = item['@odata.readLink'] || `QC_ITEM(${item.ID})`;
            // console.log(`🔗 itemReadLink for update: ${itemReadLink}`);

            try {
                await clientAPI.executeAction({
                    Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                    Properties: {
                        Target: {
                            EntitySet: 'QC_ITEM',
                            Service: service,
                            ReadLink: itemReadLink
                        },
                        Properties: values
                    }
                });
                // console.log(`✅ Successfully updated QC_ITEM: ${itemReadLink}`, values);
            } catch (err) {
                // console.error(`❌ Failed to update QC_ITEM ${itemReadLink}:`, err);
            }
        }

        // console.log('🔄 Reloading UI via LoadSnorkelData3');
        await LoadSnorkelData5(clientAPI);

        clientAPI.dismissActivityIndicator();
        // console.log('🎉 UpdateSnorkelData_Sheet3 completed successfully');
    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error('❌ Error in UpdateSnorkelData_Sheet3:', error);
    }

    function getSectionFormId(key) {
        // console.log(`📌 getSectionFormId called with key: ${key}`);
        return {
            '14.1': 'Section141Form',
            '14.2': 'Section142Form',
            '14.3': 'Section143Form',
            '14.4': 'Section144Form',
            '14.5': 'Section145Form',
            '15.1': 'Section151Form',
            '16.1': 'Section161Form',
            '16.2': 'Section162Form'

        }[key];
    }

    async function getUpdatedValuesForSection(key, section) {
        const updated = {};

        const getDate = async (controlName) => {
            const val = await section.getControl(controlName).getValue();
            return val ? new Date(val).toISOString() : undefined;
        };

               if (key === '14.1') {
            updated.DATE_INSPECTED = await getDate('Section141Date');
            updated.INSPECTED_BY = (await section.getControl('Section141InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section141Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section141DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '14.2') {
            updated.DATE_INSPECTED = await getDate('Section142Date');
            updated.INSPECTED_BY = (await section.getControl('Section142InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section142Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section142DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '14.3') {
            updated.DATE_INSPECTED = await getDate('Section143Date');
            updated.INSPECTED_BY = (await section.getControl('Section143InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section143Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section143DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '14.4') {
            updated.DATE_INSPECTED = await getDate('Section144Date');
            updated.INSPECTED_BY = (await section.getControl('Section144InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section144Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section144DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '14.5') {
            updated.DATE_INSPECTED = await getDate('Section145Date');
            updated.INSPECTED_BY = (await section.getControl('Section145InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section145Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section145DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '15.1') {
            updated.DATE_INSPECTED = await getDate('Section151Date');
            updated.INSPECTED_BY = (await section.getControl('Section151InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section151Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section151DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '16.1') {
            updated.DATE_INSPECTED = await getDate('Section161Date');
            updated.INSPECTED_BY = (await section.getControl('Section161InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section161Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section161DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
         if (key === '16.2') {
            updated.DATE_INSPECTED = await getDate('Section162Date');
            updated.INSPECTED_BY = (await section.getControl('Section162InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section162Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section162DecisionTaken').getValue())?.[0]?.ReturnValue || '';
          await UpdateSection162TestForm(clientAPI);
        await  UpdateSection162Test2Form(clientAPI);
        }

        Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);
        return updated;
    }

  async function UpdateSection162TestForm(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section162 = form.getSection('Section162TestForm');

        const snorkelNo = pageProxy.binding?.SNORKEL_NO;
        if (!snorkelNo) {
            throw new Error("❌ Missing SNORKEL_NO in binding");
        }

        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';

        // 🔎 Read existing QC_Test_Table entries for Section 162
        const results = await clientAPI.read(
            service,
            'QC_Test_Table',
            [],
            `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and testname eq '*10  Actual situation for mixing the outer castable'`
        );
        const tests = results?._array || [];

        if (tests.length === 0) {
            // console.warn("⚠️ No QC_Test_Table records found for Section 162:", snorkelNo);
            return;
        }

        // Map UI controls → backend entity
        const testInputs = [
            {
                fluidity: section162.getControl('Section162FludityOfCastable1')?.getValue()?.[0]?.ReturnValue,
                powder: section162.getControl('Section162PowerWeight1')?.getValue(),
                remark: section162.getControl('Section162Remark1')?.getValue(),
                vibration: section162.getControl('Section162AddingVibration1')?.getValue(),
                water: section162.getControl('Section162WaterCasting1')?.getValue(),
                entity: tests[0]
            },
            {
                fluidity: section162.getControl('Section162FludityOfCastable2')?.getValue()?.[0]?.ReturnValue,
                powder: section162.getControl('Section162PowerWeight2')?.getValue(),
                remark: section162.getControl('Section162Remark2')?.getValue(),
                vibration: section162.getControl('Section162AddingVibration2')?.getValue(),
                water: section162.getControl('Section162WaterCasting2')?.getValue(),
                entity: tests[1]
            },
            {
                fluidity: section162.getControl('Section162FludityOfCastable3')?.getValue()?.[0]?.ReturnValue,
                powder: section162.getControl('Section162PowerWeight3')?.getValue(),
                remark: section162.getControl('Section162Remark3')?.getValue(),
                vibration: section162.getControl('Section162AddingVibration3')?.getValue(),
                water: section162.getControl('Section162WaterCasting3')?.getValue(),
                entity: tests[2]
            },
            {
                fluidity: section162.getControl('Section162FludityOfCastable4')?.getValue()?.[0]?.ReturnValue,
                powder: section162.getControl('Section162PowerWeight4')?.getValue(),
                remark: section162.getControl('Section162Remark4')?.getValue(),
                vibration: section162.getControl('Section162AddingVibration4')?.getValue(),
                water: section162.getControl('Section162WaterCasting4')?.getValue(),
                entity: tests[3]
            },
            {
                fluidity: section162.getControl('Section162FludityOfCastable5')?.getValue()?.[0]?.ReturnValue,
                powder: section162.getControl('Section162PowerWeight5')?.getValue(),
                remark: section162.getControl('Section162Remark5')?.getValue(),
                vibration: section162.getControl('Section162AddingVibration5')?.getValue(),
                water: section162.getControl('Section162WaterCasting5')?.getValue(),
                entity: tests[4]
            }
        ];

        // Loop through & update
        for (const [i, test] of testInputs.entries()) {
            if (!test.entity) {
                // console.warn(`⚠️ No entity found for Section 162 Test ${i+1}, skipping`);
                continue;
            }

            const values = {
                fluidity: test.fluidity || '',
                powderweight: test.powder || '',
                remark: test.remark || '',
                vibration: test.vibration || '',
                watercasting: test.water || ''
            };

            // remove undefined
            Object.keys(values).forEach(k => values[k] === undefined && delete values[k]);

            if (Object.keys(values).length === 0) {
                // console.log(`⚠️ No updates for Section 162 Test ${i+1}`);
                continue;
            }

            const readLink = test.entity['@odata.readLink'];
            // console.log(`🔗 Updating Section 162 Test ${i+1} → ${readLink}`, values);

            await clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                Properties: {
                    Target: {
                        EntitySet: 'QC_Test_Table',
                        Service: service,
                        ReadLink: readLink
                    },
                    Properties: values
                }
            });

            // console.log(`✅ Successfully updated Section 162 Test ${i+1}`);
        }

    } catch (e) {
        // console.error("❌ Error in UpdateSection162TestForm:", e);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: { Message: "Update failed: " + e.message }
        });
    }
}
async function UpdateSection162Test2Form(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section162 = form.getSection('Section162Test2Form');

        const snorkelNo = pageProxy.binding?.SNORKEL_NO;
        if (!snorkelNo) {
            throw new Error("❌ Missing SNORKEL_NO in binding");
        }

        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';

        // 🔎 Read existing QC_Test_Table entries for this test
        const results = await clientAPI.read(
            service,
            'QC_Test_Table',
            [],
            `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and testname eq '*11 The gap between the top of brick surface to the top face of castable (*12, 3, 6, and 9 oclock-wise direction should be inspected)'`
        );
        const tests = results?._array || [];

        if (tests.length === 0) {
            // console.warn("⚠️ No QC_Test_Table records found for Section 162 Test2:", snorkelNo);
            return;
        }

        // Map UI controls → backend entity
        const testInputs = [
            {
                actual: section162.getControl('Section162TestActualGapA')?.getValue(),
                method: section162.getControl('Section162TestMethodA')?.getValue(),
                position: section162.getControl('Section162TestPositionGapA')?.getValue(),
                tolerance: section162.getControl('Section162TestToleranceA')?.getValue(),
                entity: tests[0]
            },
            {
                actual: section162.getControl('Section162TestActualGapB')?.getValue(),
                method: section162.getControl('Section162TestMethodB')?.getValue(),
                position: section162.getControl('Section162TestPositionGapB')?.getValue(),
                tolerance: section162.getControl('Section162TestToleranceB')?.getValue(),
                entity: tests[1]
            },
            {
                actual: section162.getControl('Section162TestActualGapC')?.getValue(),
                method: section162.getControl('Section162TestMethodC')?.getValue(),
                position: section162.getControl('Section162TestPositionGapC')?.getValue(),
                tolerance: section162.getControl('Section162TestToleranceC')?.getValue(),
                entity: tests[2]
            },
            {
                actual: section162.getControl('Section162TestActualGapD')?.getValue(),
                method: section162.getControl('Section162TestMethodD')?.getValue(),
                position: section162.getControl('Section162TestPositionGapD')?.getValue(),
                tolerance: section162.getControl('Section162TestToleranceD')?.getValue(),
                entity: tests[3]
            }
        ];

        // Loop through & update
        for (const [i, test] of testInputs.entries()) {
            if (!test.entity) {
                // console.warn(`⚠️ No entity found for Section 162 Test2 row ${i+1}, skipping`);
                continue;
            }

            const values = {
                actualvalue: test.actual || '',
                method: test.method || '',
                position: test.position || '',
                tolerance: test.tolerance || ''
            };

            // remove undefined
            Object.keys(values).forEach(k => values[k] === undefined && delete values[k]);

            if (Object.keys(values).length === 0) {
                // console.log(`⚠️ No updates for Section 162 Test2 row ${i+1}`);
                continue;
            }

            const readLink = test.entity['@odata.readLink'];
            // console.log(`🔗 Updating Section 162 Test2 row ${i+1} → ${readLink}`, values);

            await clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                Properties: {
                    Target: {
                        EntitySet: 'QC_Test_Table',
                        Service: service,
                        ReadLink: readLink
                    },
                    Properties: values
                }
            });

            // console.log(`✅ Successfully updated Section 162 Test2 row ${i+1}`);
        }

    } catch (e) {
        // console.error("❌ Error in UpdateSection162Test2Form:", e);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: { Message: "Update failed: " + e.message }
        });
    }
}

}
