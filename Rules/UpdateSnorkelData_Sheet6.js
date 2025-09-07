import LoadSnorkelData6 from './LoadSnorkelData6';

export default async function UpdateSnorkelData_Sheet6(clientAPI) {
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
        await LoadSnorkelData6(clientAPI);

        clientAPI.dismissActivityIndicator();
        // console.log('🎉 UpdateSnorkelData_Sheet3 completed successfully');
    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error('❌ Error in UpdateSnorkelData_Sheet3:', error);
    }

    function getSectionFormId(key) {
        // console.log(`📌 getSectionFormId called with key: ${key}`);
        return {
            '17.1': 'Section171Form',
            '18.1': 'Section181Form',
            '18.2': 'Section182Form',
            '18.3': 'Section183Form',
            '18.4': 'Section184Form',
            '19.1': 'Section191Form',
            '19.2': 'Section192Form',
            '19.3': 'Section193Form',
            '19.4': 'Section194Form',
            
            '19.5': 'Section195Form'

        }[key];
    }

    async function getUpdatedValuesForSection(key, section) {
        const updated = {};

        const getDate = async (controlName) => {
            const val = await section.getControl(controlName).getValue();
            return val ? new Date(val).toISOString() : undefined;
        };

         if (key === '17.1') {
            updated.DATE_INSPECTED = await getDate('Section171Date');
            updated.INSPECTED_BY = (await section.getControl('Section171InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section171Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section171DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '18.1') {
            updated.DATE_INSPECTED = await getDate('Section181Date');
            updated.INSPECTED_BY = (await section.getControl('Section181InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section181Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section181DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '18.2') {
            updated.DATE_INSPECTED = await getDate('Section182Date');
            updated.INSPECTED_BY = (await section.getControl('Section182InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section182Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section182DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '18.3') {
            updated.DATE_INSPECTED = await getDate('Section183Date');
            updated.INSPECTED_BY = (await section.getControl('Section183InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section183Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section183DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '18.4') {
            updated.DATE_INSPECTED = await getDate('Section184Date');
            updated.INSPECTED_BY = (await section.getControl('Section184InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section184Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section184DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '19.1') {
            updated.DATE_INSPECTED = await getDate('Section191Date');
            updated.INSPECTED_BY = (await section.getControl('Section191InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section191Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section191DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '19.2') {
            updated.DATE_INSPECTED = await getDate('Section192Date');
            updated.INSPECTED_BY = (await section.getControl('Section192InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section192Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section192DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '19.3') {
            updated.DATE_INSPECTED = await getDate('Section193Date');
            updated.INSPECTED_BY = (await section.getControl('Section193InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section193Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section193DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '19.4') {
            updated.DATE_INSPECTED = await getDate('Section194Date');
            updated.INSPECTED_BY = (await section.getControl('Section194InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section194Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section194DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '19.5') {
            updated.DATE_INSPECTED = await getDate('Section195Date');
            updated.INSPECTED_BY = (await section.getControl('Section195InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section195Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section195DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);
        return updated;
    }

 

}
