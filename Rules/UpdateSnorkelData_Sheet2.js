import LoadSnorkelData2 from './LoadSnorkelData2';

export default async function UpdateSnorkelData_Sheet1(clientAPI) {
    console.log('🚀 Entered UpdateSnorkelData_Sheet2');
    clientAPI.showActivityIndicator("...");
const snorkelNo =clientAPI.binding.SNORKEL_NO;
  const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
    try {
        const pageProxy = clientAPI.getPageProxy();
        console.log('📌 Got pageProxy:', pageProxy);

        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        console.log('📌 Got FormSectionedTable:', FormSectionedTable);

        const binding = pageProxy.getBindingObject();

        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        console.log('🔗 Service Path:', service);

          const snorkelNo =clientAPI.binding.SNORKEL_NO;
        console.log('🔍 SnorkelNo Value:', snorkelNo);

        const headerResults = await clientAPI.read(service, 'QC_HEADER', [], `$filter=SNORKEL_NO eq '${snorkelNo}'`);
        console.log('📥 headerResults:', headerResults);

        if (!headerResults || !Array.isArray(headerResults._array) || headerResults._array.length !== 1) {
            // console.error('❌ QC_HEADER not found or multiple found', headerResults);
            throw new Error(`❌ QC_HEADER not found or multiple found`);
        }

        const header = headerResults._array[0];
        console.log('📌 Loaded header:', header);

        const headerReadLink = header['@odata.readLink'];
        console.log('🔗 headerReadLink:', headerReadLink);

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

     
       
        // console.log('🔄 Reloading UI via LoadSnorkelData');
        await LoadSnorkelData2(clientAPI);

        clientAPI.dismissActivityIndicator();
        // console.log('🎉 UpdateSnorkelData_Sheet1 completed successfully');
    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error('❌ Error in UpdateSnorkelData_Sheet1:', error);
    }

    function getSectionFormId(key) {
        // console.log(`📌 getSectionFormId called with key: ${key}`);
        return {
            '7.1': 'Section71Form',
            '7.2': 'Section72Form',
            '8.1': 'Section81Form',
            '8.2': 'Section82Form',
            '8.3': 'Section83Form',
            '8.4': 'Section84Form',
            '9.1': 'Section91Form',
            '9.2': 'Section92Form',
            '10.1': 'Section101Form',
            '10.2': 'Section102Form',
            '10.3': 'Section103Form',
        }[key];
    }

     async function getUpdatedValuesForSection(key, section,service) {
        const updated = {};

        const getDate = async (controlName) => {
            const val = await section.getControl(controlName).getValue();
            return val ? new Date(val).toISOString() : undefined;
        };

    
        if (key === '7.1') {
            updated.DATE_INSPECTED = await getDate('Section71Date');
            updated.INSPECTED_BY = (await section.getControl('Section71InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section71Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section71DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '7.2') {
            updated.DATE_INSPECTED = await getDate('Section72Date');
            updated.INSPECTED_BY = (await section.getControl('Section72InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section72Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section72DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '8.1') {
            updated.DATE_INSPECTED = await getDate('Section81Date');
            updated.INSPECTED_BY = (await section.getControl('Section81InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section81Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section81DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '8.2') {
            updated.DATE_INSPECTED = await getDate('Section82Date');
            updated.INSPECTED_BY = (await section.getControl('Section82InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section82Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section82DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '8.3') {
            updated.DATE_INSPECTED = await getDate('Section83Date');
            updated.INSPECTED_BY = (await section.getControl('Section83InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section83Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section83DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '8.4') {
            updated.DATE_INSPECTED = await getDate('Section84Date');
            updated.INSPECTED_BY = (await section.getControl('Section84InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section84Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section84DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
       if (key === '9.1') {
    updated.DATE_INSPECTED = await getDate('Section91Date');
    updated.INSPECTED_BY = (await section.getControl('Section91InspectedBy').getValue())?.[0]?.ReturnValue || '';
    updated.METHOD = await section.getControl('Section91Method').getValue();
    updated.DECISION_TAKEN = (await section.getControl('Section91DecisionTaken').getValue())?.[0]?.ReturnValue || '';
UpdateSection91TestForm(clientAPI);

}

        if (key === '9.2') {
            updated.DATE_INSPECTED = await getDate('Section92Date');
            updated.INSPECTED_BY = (await section.getControl('Section92InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section92Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section92DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '10.1') {
            updated.DATE_INSPECTED = await getDate('Section101Date');
            updated.INSPECTED_BY = (await section.getControl('Section101InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section101Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section101DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '10.2') {
            updated.DATE_INSPECTED = await getDate('Section102Date');
            updated.INSPECTED_BY = (await section.getControl('Section102InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section102Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section102DecisionTaken').getValue())?.[0]?.ReturnValue || '';
         await UpdateSection102TestForm(clientAPI);
        await  UpdateSection102Test2Form(clientAPI)
        
        }
        if (key === '10.3') {
            updated.DATE_INSPECTED = await getDate('Section103Date');
            updated.INSPECTED_BY = (await section.getControl('Section103InspectedBy').getValue())?.[0]?.ReturnValue || '';
            // updated.METHOD = await section.getControl('Section103InspectionMethod').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section103DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
      





        Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);
        return updated;
    } 

 async function UpdateSection91TestForm(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section91 = form.getSection('Section91TestForm');

        const snorkelNo = pageProxy.binding?.SNORKEL_NO;
        if (!snorkelNo) {
            throw new Error("❌ Missing SNORKEL_NO in binding");
        }

        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';

        // 🔎 Read existing QC_Test_Table entries for this header/snorkel
        const results = await clientAPI.read(service, 'QC_Test_Table', [], `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and testname eq '*3 Inspection result of outer castable workablity'`);
        const tests = results?._array || [];

        if (tests.length === 0) {
            // console.warn("⚠️ No QC_Test_Table records found for snorkel:", snorkelNo);
            return;
        }

        // Map UI controls to entity properties
        const testInputs = [
            {
                water: section91.getControl('Section91TestWaterCasteing1')?.getValue(),
                ff: section91.getControl('Section91FF1')?.getValue(),
                tf: section91.getControl('Section91TF1')?.getValue(),
                setting: section91.getControl('Section91SettingTime1')?.getValue(),
                remark: section91.getControl('Section91TestRemark1')?.getValue(),
                entity: tests[0]
            },
            {
                water: section91.getControl('Section91TestWaterCasteing2')?.getValue(),
                ff: section91.getControl('Section91FF2')?.getValue(),
                tf: section91.getControl('Section91TF2')?.getValue(),
                setting: section91.getControl('Section91SettingTime2')?.getValue(),
                remark: section91.getControl('Section91TestRemark2')?.getValue(),
                entity: tests[1]
            },
            {
                water: section91.getControl('Section91TestWaterCasteing3')?.getValue(),
                ff: section91.getControl('Section91FF3')?.getValue(),
                tf: section91.getControl('Section91TF3')?.getValue(),
                setting: section91.getControl('Section91SettingTime3')?.getValue(),
                remark: section91.getControl('Section91TestRemark3')?.getValue(),
                entity: tests[2]
            }
        ];

        for (const [i, test] of testInputs.entries()) {
            if (!test.entity) {
                // console.warn(`⚠️ No entity found for Test ${i+1}, skipping`);
                continue;
            }

            const values = {
                watercasting: test.water || '',
                ff: test.ff || '',
                tf: test.tf || '',
                settleduration: test.setting || '',
                remark: test.remark || ''
            };

            // Remove undefined values
            Object.keys(values).forEach(k => values[k] === undefined && delete values[k]);

            if (Object.keys(values).length === 0) {
                // console.log(`⚠️ No updates for Test ${i+1}`);
                continue;
            }

            const readLink = test.entity['@odata.readLink'];
            // console.log(`🔗 Updating Test ${i+1} → ${readLink}`, values);

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

            // console.log(`✅ Successfully updated Test ${i+1}`);
        }

    } catch (e) {
        // console.error("❌ Error in UpdateSection91TestForm:", e);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: { Message: "Update failed: " + e.message }
        });
    }
}

async function UpdateSection102TestForm(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section102 = form.getSection('Section102TestForm');

        const snorkelNo = pageProxy.binding?.SNORKEL_NO;
        if (!snorkelNo) {
            throw new Error("❌ Missing SNORKEL_NO in binding");
        }

        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';

        // 🔎 Read existing QC_Test_Table entries for Section 102
        const results = await clientAPI.read(
            service,
            'QC_Test_Table',
            [],
            `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and testname eq '*4 Actual situation for mixing the outer castable'`
        );
        const tests = results?._array || [];

        if (tests.length === 0) {
            // console.warn("⚠️ No QC_Test_Table records found for Section 102:", snorkelNo);
            return;
        }

        // Map UI controls → backend entity
        const testInputs = [
            {
                fluidity: section102.getControl('Section102FludityOfCastable1')?.getValue()?.[0]?.ReturnValue,
                powder: section102.getControl('Section102PowerWeight1')?.getValue(),
                remark: section102.getControl('Section102Remark1')?.getValue(),
                vibration: section102.getControl('Section102AddingVibration1')?.getValue(),
                water: section102.getControl('Section102WaterCasting1')?.getValue(),
                entity: tests[0]
            },
            {
                fluidity: section102.getControl('Section102FludityOfCastable2')?.getValue()?.[0]?.ReturnValue,
                powder: section102.getControl('Section102PowerWeight2')?.getValue(),
                remark: section102.getControl('Section102Remark2')?.getValue(),
                vibration: section102.getControl('Section102AddingVibration2')?.getValue(),
                water: section102.getControl('Section102WaterCasting2')?.getValue(),
                entity: tests[1]
            },
            {
                fluidity: section102.getControl('Section102FludityOfCastable3')?.getValue()?.[0]?.ReturnValue,
                powder: section102.getControl('Section102PowerWeight3')?.getValue(),
                remark: section102.getControl('Section102Remark3')?.getValue(),
                vibration: section102.getControl('Section102AddingVibration3')?.getValue(),
                water: section102.getControl('Section102WaterCasting3')?.getValue(),
                entity: tests[2]
            },
            {
                fluidity: section102.getControl('Section102FludityOfCastable4')?.getValue()?.[0]?.ReturnValue,
                powder: section102.getControl('Section102PowerWeight4')?.getValue(),
                remark: section102.getControl('Section102Remark4')?.getValue(),
                vibration: section102.getControl('Section102AddingVibration4')?.getValue(),
                water: section102.getControl('Section102WaterCasting4')?.getValue(),
                entity: tests[3]
            },
            {
                fluidity: section102.getControl('Section102FludityOfCastable5')?.getValue()?.[0]?.ReturnValue,
                powder: section102.getControl('Section102PowerWeight5')?.getValue(),
                remark: section102.getControl('Section102Remark5')?.getValue(),
                vibration: section102.getControl('Section102AddingVibration5')?.getValue(),
                water: section102.getControl('Section102WaterCasting5')?.getValue(),
                entity: tests[4]
            }
        ];

        // Loop through & update
        for (const [i, test] of testInputs.entries()) {
            if (!test.entity) {
                // console.warn(`⚠️ No entity found for Section 102 Test ${i+1}, skipping`);
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
                // console.log(`⚠️ No updates for Section 102 Test ${i+1}`);
                continue;
            }

            const readLink = test.entity['@odata.readLink'];
            // console.log(`🔗 Updating Section 102 Test ${i+1} → ${readLink}`, values);

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

            // console.log(`✅ Successfully updated Section 102 Test ${i+1}`);
        }

    } catch (e) {
        // console.error("❌ Error in UpdateSection102TestForm:", e);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: { Message: "Update failed: " + e.message }
        });
    }
}
async function UpdateSection102Test2Form(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section102 = form.getSection('Section102Test2Form');

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
            `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and testname eq '*5 The gap between the top of casting mould and the top face of castable'`
        );
        const tests = results?._array || [];

        if (tests.length === 0) {
            // console.warn("⚠️ No QC_Test_Table records found for Section 102 Test2:", snorkelNo);
            return;
        }

        // Map UI controls → backend entity
        const testInputs = [
            {
                actual: section102.getControl('Section102TestActualGapA')?.getValue(),
                method: section102.getControl('Section102TestMethodA')?.getValue(),
                position: section102.getControl('Section102TestPositionGapA')?.getValue(),
                tolerance: section102.getControl('Section102TestToleranceA')?.getValue(),
                entity: tests[0]
            },
            {
                actual: section102.getControl('Section102TestActualGapB')?.getValue(),
                method: section102.getControl('Section102TestMethodB')?.getValue(),
                position: section102.getControl('Section102TestPositionGapB')?.getValue(),
                tolerance: section102.getControl('Section102TestToleranceB')?.getValue(),
                entity: tests[1]
            },
            {
                actual: section102.getControl('Section102TestActualGapC')?.getValue(),
                method: section102.getControl('Section102TestMethodC')?.getValue(),
                position: section102.getControl('Section102TestPositionGapC')?.getValue(),
                tolerance: section102.getControl('Section102TestToleranceC')?.getValue(),
                entity: tests[2]
            },
            {
                actual: section102.getControl('Section102TestActualGapD')?.getValue(),
                method: section102.getControl('Section102TestMethodD')?.getValue(),
                position: section102.getControl('Section102TestPositionGapD')?.getValue(),
                tolerance: section102.getControl('Section102TestToleranceD')?.getValue(),
                entity: tests[3]
            }
        ];

        // Loop through & update
        for (const [i, test] of testInputs.entries()) {
            if (!test.entity) {
                // console.warn(`⚠️ No entity found for Section 102 Test2 row ${i+1}, skipping`);
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
                // console.log(`⚠️ No updates for Section 102 Test2 row ${i+1}`);
                continue;
            }

            const readLink = test.entity['@odata.readLink'];
            // console.log(`🔗 Updating Section 102 Test2 row ${i+1} → ${readLink}`, values);

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

            // console.log(`✅ Successfully updated Section 102 Test2 row ${i+1}`);
        }

    } catch (e) {
        // console.error("❌ Error in UpdateSection102Test2Form:", e);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: { Message: "Update failed: " + e.message }
        });
    }
}



}

