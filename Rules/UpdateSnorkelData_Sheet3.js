import LoadSnorkelData3 from './LoadSnorkelData3';

export default async function UpdateSnorkelData_Sheet3(clientAPI) {
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
        await LoadSnorkelData3(clientAPI);

        clientAPI.dismissActivityIndicator();
        // console.log('🎉 UpdateSnorkelData_Sheet3 completed successfully');
    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error('❌ Error in UpdateSnorkelData_Sheet3:', error);
    }

    function getSectionFormId(key) {
        // console.log(`📌 getSectionFormId called with key: ${key}`);
        return {
            '11.1': 'Section111Form',
            '11.2': 'Section112Form',
            '11.3': 'Section113Form',
            '12.1': 'Section121Form',
            '12.2': 'Section122Form',
            '12.3': 'Section123Form',
        }[key];
    }

    async function getUpdatedValuesForSection(key, section) {
        const updated = {};

        const getDate = async (controlName) => {
            const val = await section.getControl(controlName).getValue();
            return val ? new Date(val).toISOString() : undefined;
        };

        if (key === '11.1') {
            updated.DATE_INSPECTED = await getDate('Section111Date');
            updated.INSPECTED_BY = (await section.getControl('Section111InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section111InspectionMethod').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section111DecisionTaken').getValue())?.[0]?.ReturnValue || '';
            await UpdateSection111Tests(clientAPI);
        }
        if (key === '11.2') {
            updated.DATE_INSPECTED = await getDate('Section112Date');
            updated.INSPECTED_BY = (await section.getControl('Section112InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section112Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section112DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '11.3') {
            updated.DATE_INSPECTED = await getDate('Section113Date');
            updated.INSPECTED_BY = (await section.getControl('Section113InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section113Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section113DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '12.1') {
            updated.DATE_INSPECTED = await getDate('Section121Date');
            updated.INSPECTED_BY = (await section.getControl('Section121InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section121Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section121DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '12.2') {
            updated.DATE_INSPECTED = await getDate('Section122Date');
            updated.INSPECTED_BY = (await section.getControl('Section122InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section122Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section122DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '12.3') {
            updated.DATE_INSPECTED = await getDate('Section123Date');
            updated.INSPECTED_BY = (await section.getControl('Section123InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section123Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section123DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);
        return updated;
    }

    async function UpdateSection111Tests(clientAPI) {
        // console.log("🚀 Entered UpdateSection111Tests");
        clientAPI.showActivityIndicator("Updating MOR test results...");

        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        const snorkelNo = clientAPI.binding.SNORKEL_NO;

        try {
            const pageProxy = clientAPI.getPageProxy();
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
            const testForm = FormSectionedTable.getSection('Section111TestForm');
            if (!testForm) {
                throw new Error("❌ Section111TestForm not found");
            }

            const existingTests = await clientAPI.read(
                service,
                "QC_Test_Table",
                [],
                `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and testname eq '*6 MOR test result'`
            );

            const existingArray = existingTests?._array || [];
            // console.log(`📥 Found ${existingArray.length} existing MOR tests`);

            for (let i = 1; i <= 4; i++) {
                const date = await testForm.getControl(`Section111TestDate${i}`).getValue();
                const specification = await testForm.getControl(`Section111TestSpecification${i}`).getValue();
                const method = await testForm.getControl(`Section111TestMethod${i}`).getValue();
                const actualvalue = await testForm.getControl(`Section111TestActualValue${i}`).getValue();

                if (!date && !specification && !actualvalue) {
                    // console.warn(`⚠️ Skipping empty row ${i}`);
                    continue;
                }

                let existing = existingArray[i - 1];
                let values = {
                    date: date ? new Date(date).toISOString() : null,
                    specification,
                    method,
                    actualvalue,
                    testname: "*6 MOR test result",
                    qC_HEADER_SNORKEL_NO: snorkelNo
                };

                if (existing) {
                    // console.log(`✏️ Updating MOR test row ${i} (${existing.ID})`, values);
                    await clientAPI.executeAction({
                        Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                        Properties: {
                            Target: {
                                EntitySet: 'QC_Test_Table',
                                Service: service,
                                ReadLink: existing['@odata.readLink']
                            },
                            Properties: values
                        }
                    });
                } else {
                    // console.log(`➕ Creating MOR test row ${i}`, values);
                    await clientAPI.executeAction({
                        Name: '/TRL_RH_SnorkelApp/Actions/CreateEntity.action',
                        Properties: {
                            Target: {
                                EntitySet: 'QC_Test_Table',
                                Service: service
                            },
                            Properties: values
                        }
                    });
                }
            }

            clientAPI.dismissActivityIndicator();
            // console.log("✅ UpdateSection111Tests completed successfully");

        } catch (error) {
            clientAPI.dismissActivityIndicator();
            // console.error("❌ Error in UpdateSection111Tests:", error);
        }
    }
}
