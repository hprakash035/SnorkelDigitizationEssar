import LoadSnorkelData1 from './LoadSnorkelData1';

export default async function UpdateSnorkelData_Sheet1(clientAPI) {
    // console.log('🚀 Entered UpdateSnorkelData_Sheet1');
    clientAPI.showActivityIndicator("...");
    try {
        const pageProxy = clientAPI.getPageProxy();
        // console.log('📌 Got pageProxy:', pageProxy);

        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        // console.log('📌 Got FormSectionedTable:', FormSectionedTable);

        const headerSection = FormSectionedTable.getSection('HeaderSection');
        // console.log('📌 Got headerSection:', headerSection);

        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        // console.log('🔗 Service Path:', service);

        // 🔹 Read QC_HEADER by SNORKEL_NO
        const snorkelNo = headerSection.getControl('SnorkelNo').getValue();
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

        // 🔹 Load QC_ITEMs
        const itemsResult = await clientAPI.read(service, `${headerReadLink}/qc_ITEMS`, [], '');
        // console.log('📥 itemsResult:', itemsResult);

        const items = itemsResult?._array || [];
        // console.log(`🔍 Found ${items.length} QC_ITEMs`);

        // 🔹 Update QC_ITEMs
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

        // 🔹 Update QC_HEADER
        const headerValues = await getHeaderValues(headerSection);
        // console.log('📥 Extracted headerValues:', headerValues);

        if (Object.keys(headerValues).length > 0) {
            await clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                Properties: {
                    Target: {
                        EntitySet: 'QC_HEADER',
                        Service: service,
                        ReadLink: headerReadLink
                    },
                    Properties: headerValues
                }
            });
            // console.log(`✅ Successfully updated QC_HEADER: ${headerReadLink}`, headerValues);
        } else {
            // console.warn('⚠️ No header values found to update.');
        }

        // 🔄 Reload UI
        //  console.log('🔄 Reloading UI via LoadSnorkelData');
         await LoadSnorkelData1(clientAPI);
    
        clientAPI.dismissActivityIndicator();
       
        // console.log('🎉 UpdateSnorkelData_Sheet1 completed successfully');
    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error('❌ Error in UpdateSnorkelData_Sheet1:', error);
    }

    // Map sectionKey → SectionId
    function getSectionFormId(key) {
        // console.log(`📌 getSectionFormId called with key: ${key}`);
        return {
            '1.1': 'Section1Form',
            '2.1': 'Section2Form',
            '3.1': 'Section31Form',
            '3.2': 'Section32Form',
            '4.1': 'Section41Form',
            '4.2': 'Section42Form',
            '5.1': 'Section51Form',
            '5.2': 'Section52Form',
            '5.3': 'Section53Form',
            '6.1': 'Section61Form',
            '6.2': 'Section62Form',
            '6.3': 'Section63Form',
        }[key];
    }

    // Extract values from section form
    async function getUpdatedValuesForSection(key, section) {
        // console.log(`📌 getUpdatedValuesForSection called for key: ${key}`);
        const updated = {};

        const getDate = async (controlName) => {
            const val = await section.getControl(controlName).getValue();
            // console.log(`📅 getDate(${controlName}) →`, val);
            return val ? new Date(val).toISOString() : undefined;
        };

        if (key === '1.1') {
            // console.log('📝 Extracting values for Section 1.1');
            updated.DATE_INSPECTED = await getDate('Section1Date1');
            updated.INSPECTED_BY = (await section.getControl('Section1InspectedBy1').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section1InspectionMethod1').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section1DecisionTaken1').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '2.1') {
            // console.log('📝 Extracting values for Section 2.1');
            updated.DATE_INSPECTED = await getDate('Section2InspectionDate2');
            updated.INSPECTED_BY = (await section.getControl('Section2InspectedBy2').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section2InspectionMethod2').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section2DecisionTaken2').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '3.1') {
            // console.log('📝 Extracting values for Section 3.1');
            updated.DATE_INSPECTED = await getDate('Section31Date');
            updated.INSPECTED_BY = (await section.getControl('Section31InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.DECISION_TAKEN = (await section.getControl('Section31DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '3.2') {
            // console.log('📝 Extracting values for Section 3.2');
            updated.DATE_INSPECTED = await getDate('Section32Date');
            updated.INSPECTED_BY = (await section.getControl('Section32InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.DECISION_TAKEN = (await section.getControl('Section32DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '4.1') {
            // console.log('📝 Extracting values for Section 4.1');
            updated.DATE_INSPECTED = await getDate('Section41Date');
            updated.INSPECTED_BY = (await section.getControl('Section41InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section41Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section41DecisionTaken').getValue())?.[0]?.ReturnValue || '';
             await updateSection41Tests(clientAPI, section, service, snorkelNo);
        }
        if (key === '4.2') {
            // console.log('📝 Extracting values for Section 4.2');
            updated.DATE_INSPECTED = await getDate('Section42Date');
            updated.INSPECTED_BY = (await section.getControl('Section42InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section42Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section42DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '5.1') {
            // console.log('📝 Extracting values for Section 5.1');
            updated.DATE_INSPECTED = await getDate('Section51Date');
            updated.INSPECTED_BY = (await section.getControl('Section51InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section51Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section51DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '5.2') {
            // console.log('📝 Extracting values for Section 5.2');
            updated.DATE_INSPECTED = await getDate('Section52Date');
            updated.INSPECTED_BY = (await section.getControl('Section52InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section52Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section52DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '5.3') {
            // console.log('📝 Extracting values for Section 5.3');
            updated.DATE_INSPECTED = await getDate('Section53Date');
            updated.INSPECTED_BY = (await section.getControl('Section53InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section53Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section53DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '6.1') {
            // console.log('📝 Extracting values for Section 6.1');
            updated.DATE_INSPECTED = await getDate('Section61Date');
            updated.INSPECTED_BY = (await section.getControl('Section61InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section61Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section61DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '6.2') {
            // console.log('📝 Extracting values for Section 6.2');
            updated.DATE_INSPECTED = await getDate('Section62Date');
            updated.INSPECTED_BY = (await section.getControl('Section62InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section62Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section62DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '6.3') {
            // console.log('📝 Extracting values for Section 6.3');
            updated.DATE_INSPECTED = await getDate('Section63Date');
            updated.INSPECTED_BY = (await section.getControl('Section63InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section63Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section63DecisionTaken').getValue())?.[0]?.ReturnValue || '';
             await updateSection63Tests(clientAPI, section, service, snorkelNo);
        }

        Object.keys(updated).forEach(k => {
            if (updated[k] === undefined) {
                // console.log(`🗑️ Removing undefined field: ${k}`);
                delete updated[k];
            }
        });

        // console.log(`✅ Final updated values for key ${key}:`, updated);
        return updated;
    }

    async function getHeaderValues(section) {
        // console.log('📌 getHeaderValues called');
        const values = {
            CUSTOMER_NAME: await section.getControl('Company').getValue(),
            SNORKEL_NO: await section.getControl('SnorkelNo').getValue(),
            TYPE: (await section.getControl('TypeList').getValue())?.[0]?.ReturnValue ?? '',
            PRODUCTION_NO: await section.getControl('ProductionNo').getValue(),
            DATE_STARTED: await section.getControl('StartDate').getValue(),
            DATE_ENDED: await section.getControl('EndDate').getValue(),
            CHECKER: (await section.getControl('Checker').getValue())?.[0]?.ReturnValue ?? '',
        };
        // console.log('✅ Extracted headerValues:', values);
        return values;
    }
}
async function updateSection41Tests(clientAPI, section, service, snorkelNo) {
    // console.log('🔄 Updating Section41 Tests (Gap A–D)...');

    const tests = ['A', 'B', 'C', 'D'];

    for (const suffix of tests) {
        const actualValue = await section.getControl(`Section41TestActualGap${suffix}`).getValue();
        const method = await section.getControl(`Section41TestMethod${suffix}`).getValue();
        const position = await section.getControl(`Section41TestPositionGap${suffix}`).getValue();
        const tolerance = await section.getControl(`Section41TestTolerance${suffix}`).getValue();

        const testProps = {
            actualvalue: actualValue,
            method,
            position,
            tolerance,
            qC_HEADER_SNORKEL_NO: snorkelNo,
            testname: "*1 Gap measurement between 1st ring brick and the Core Shell *(Actual Max - Actual Min) < 2mm",
        };

        try {
            // 🔍 First check if a QC_Test_Table entry already exists for this Gap
            const query = `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and position eq '${position}'`;
            const existing = await clientAPI.read(service, 'QC_Test_Table', [], query);

            if (existing && existing._array.length > 0) {
                // ✅ Update existing test
                const readLink = existing._array[0]['@odata.readLink'];
                await clientAPI.executeAction({
                    Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                    Properties: {
                        Target: {
                            EntitySet: 'QC_Test_Table',
                            Service: service,
                            ReadLink: readLink
                        },
                        Properties: testProps
                    }
                });
                // console.log(`✅ Updated QC_Test_Table for Gap ${suffix}`, testProps);
            } else {
                // ➕ Create new test entry
                await clientAPI.executeAction({
                    Name: '/TRL_RH_SnorkelApp/Actions/CreateEntity.action',
                    Properties: {
                        Target: {
                            EntitySet: 'QC_Test_Table',
                            Service: service
                        },
                        Properties: testProps
                    }
                });
                // console.log(`➕ Created QC_Test_Table for Gap ${suffix}`, testProps);
            }
        } catch (err) {
            // console.error(`❌ Failed to update/create QC_Test_Table for Gap ${suffix}:`, err);
        }
    }
}

async function updateSection63Tests(clientAPI, section, service, snorkelNo) {
    // console.log('🔄 Updating Section63 Tests (Mesh & Studs)...');

    // Define two test types
    const tests = [
        {
            suffix: 'Mesh',
            testname: '*6.3 Highest position for steel mesh 850mm +5, -10mm'
        },
        {
            suffix: 'Studs',
            testname: '*6.3 Highest position for Y studs 850mm +5, -10mm'
        }
    ];

    for (const { suffix, testname } of tests) {
        const actualValue = await section.getControl(`Section63TestActual${suffix}`).getValue();
        const position = await section.getControl(`Section63TestPosition${suffix}`).getValue();
        const tolerance = await section.getControl(`Section63TestTolerance${suffix}`).getValue();

        const testProps = {
            actualvalue: actualValue,
            position,
            tolerance,
            qC_HEADER_SNORKEL_NO: snorkelNo,
            testname
        };

        try {
            // 🔍 Check if entry already exists
            const query = `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and position eq '${position}'`;
            const existing = await clientAPI.read(service, 'QC_Test_Table', [], query);

            if (existing && existing._array.length > 0) {
                // ✅ Update existing
                const readLink = existing._array[0]['@odata.readLink'];
                await clientAPI.executeAction({
                    Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                    Properties: {
                        Target: {
                            EntitySet: 'QC_Test_Table',
                            Service: service,
                            ReadLink: readLink
                        },
                        Properties: testProps
                    }
                });
                // console.log(`✅ Updated QC_Test_Table for ${suffix}`, testProps);
            } else {
                // ➕ Create new
                await clientAPI.executeAction({
                    Name: '/TRL_RH_SnorkelApp/Actions/CreateEntity.action',
                    Properties: {
                        Target: {
                            EntitySet: 'QC_Test_Table',
                            Service: service
                        },
                        Properties: testProps
                    }
                });
                // console.log(`➕ Created QC_Test_Table for ${suffix}`, testProps);
            }
        } catch (err) {
            // console.error(`❌ Failed to update/create QC_Test_Table for ${suffix}:`, err);
        }
    }
}

