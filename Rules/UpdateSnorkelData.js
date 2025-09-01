import LoadSnorkelData from './LoadSnorkelData';

export default async function UpdateSnorkelData(clientAPI) {
    clientAPI.showActivityIndicator("...");
    try {
        // console.log('🚀 Starting UpdateSnorkelData');

        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';

        // 🔹 Read QC_HEADER by SNORKEL_NO
        const snorkelNo = headerSection.getControl('SnorkelNo').getValue();
        const headerResults = await clientAPI.read(service, 'QC_HEADER', [], `$filter=SNORKEL_NO eq '${snorkelNo}'`);
        if (!headerResults || !Array.isArray(headerResults._array) || headerResults._array.length !== 1) {
            throw new Error(`❌ QC_HEADER not found or multiple found`);
        }
        const header = headerResults._array[0];
        const headerReadLink = header['@odata.readLink'];

        // 🔹 Load QC_ITEMs
        const itemsResult = await clientAPI.read(service, `${headerReadLink}/qc_ITEMS`, [], '');
        const items = itemsResult?._array || [];
         console.log(`🔍 Found ${items.length} QC_ITEMs`);

        // 🔹 Update QC_ITEMs
        for (const item of items) {
            const question = item.QUESTION || '';
            const sectionKey = question.match(/^(\d+\.\d+)/)?.[1];
            //  console.log(`➡️ Processing item ID: ${item.ID}, Question: ${question}, Section Key: ${sectionKey}`);

            if (!sectionKey) continue;

            const sectionId = getSectionFormId(sectionKey);
            const section = FormSectionedTable.getSection(sectionId);  // ✅ FIXED

            if (!section) {
                 console.warn(`⚠️ No section found for ID: ${sectionId}`);
                continue;
            }

            if (!section.getVisible()) {
                 console.warn(`⚠️ Section ${sectionId} not visible`);
                continue;
            }

            const values = await getUpdatedValuesForSection(sectionKey, section);
            if (Object.keys(values).length === 0) {
                 console.warn(`⚠️ No values to update for item ${item.ID}`);
                continue;
            }

            const itemReadLink = item['@odata.readLink'] || `QC_ITEM(${item.ID})`;

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
                // console.log(`✅ Updated QC_ITEM: ${itemReadLink}`, values);
            } catch (err) {
                // console.error(`❌ Failed to update QC_ITEM ${itemReadLink}:`, err);
            }
        }

        // 🔹 Update QC_HEADER
        const headerValues = await getHeaderValues(headerSection);
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
            // console.log(`✅ Updated QC_HEADER: ${headerReadLink}`);
        }

        // 🔄 Reload UI
        await LoadSnorkelData(clientAPI);
        clientAPI.dismissActivityIndicator();
    
    } catch (error) {
         clientAPI.dismissActivityIndicator();
        // console.error('❌ Error in UpdateSnorkelData:', error);
    }

    // Map sectionKey → SectionId
    function getSectionFormId(key) {
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
            '11.1': 'Section111Form',
            '11.2': 'Section112Form',
            '11.3': 'Section113Form',
            '12.1': 'Section121Form',
            '12.2': 'Section122Form',
            '12.3': 'Section123Form',
            '13.1': 'Section131Form',
            '13.2': 'Section132Form',
            '13.3': 'Section133Form',
            '13.4': 'Section134Form',
            '13.5': 'Section135Form',
            '13.6': 'Section136Form',
            '14.1': 'Section141Form',
            '14.2': 'Section142Form',
            '14.3': 'Section143Form',
            '14.4': 'Section144Form',
            '14.5': 'Section145Form',
            '15.1': 'Section151Form',
            '16.1': 'Section161Form',
            '17.1': 'Section171Form',
            '18.1': 'Section181Form',
            '18.2': 'Section182Form',
            '18.3': 'Section183Form',
            '18.4': 'Section184Form',
            '19.1': 'Section191Form',
            '19.2': 'Section192Form',
            '19.3': 'Section193Form',
            '19.4': 'Section194Form',
        }[key];
    }


    // Extract values from section form
    async function getUpdatedValuesForSection(key, section) {
        const updated = {};

        const getDate = async (controlName) => {
            const val = await section.getControl(controlName).getValue();
            return val ? new Date(val).toISOString() : undefined;
        };

        if (key === '1.1') {
            updated.DATE_INSPECTED = await getDate('Section1Date1');
            updated.INSPECTED_BY = (await section.getControl('Section1InspectedBy1').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section1InspectionMethod1').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section1DecisionTaken1').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '2.1') {
            updated.DATE_INSPECTED = await getDate('Section2InspectionDate2');
            updated.INSPECTED_BY = (await section.getControl('Section2InspectedBy2').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section2InspectionMethod2').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section2DecisionTaken2').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '3.1') {
            updated.DATE_INSPECTED = await getDate('Section31Date');
            updated.INSPECTED_BY = (await section.getControl('Section31InspectedBy').getValue())?.[0]?.ReturnValue || '';
            // updated.METHOD = await section.getControl('Section31Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section31DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '3.2') {
            updated.DATE_INSPECTED = await getDate('Section32Date');
            updated.INSPECTED_BY = (await section.getControl('Section32InspectedBy').getValue())?.[0]?.ReturnValue || '';
            // updated.METHOD = await section.getControl('Section32Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section32DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '4.1') {
            updated.DATE_INSPECTED = await getDate('Section41Date');
            updated.INSPECTED_BY = (await section.getControl('Section41InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section41Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section41DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '4.2') {
            updated.DATE_INSPECTED = await getDate('Section42Date');
            updated.INSPECTED_BY = (await section.getControl('Section42InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section42Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section42DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '5.1') {
            updated.DATE_INSPECTED = await getDate('Section51Date');
            updated.INSPECTED_BY = (await section.getControl('Section51InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section51Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section51DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
          if (key === '5.2') {
            updated.DATE_INSPECTED = await getDate('Section52Date');
            updated.INSPECTED_BY = (await section.getControl('Section52InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section52Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section52DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '5.3') {
            updated.DATE_INSPECTED = await getDate('Section53Date');
            updated.INSPECTED_BY = (await section.getControl('Section53InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section53Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section53DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '6.1') {
            updated.DATE_INSPECTED = await getDate('Section61Date');
            updated.INSPECTED_BY = (await section.getControl('Section61InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section61Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section61DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '6.2') {
            updated.DATE_INSPECTED = await getDate('Section62Date');
            updated.INSPECTED_BY = (await section.getControl('Section62InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section62Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section62DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
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
        }
        if (key === '10.3') {
            updated.DATE_INSPECTED = await getDate('Section103Date');
            updated.INSPECTED_BY = (await section.getControl('Section103InspectedBy').getValue())?.[0]?.ReturnValue || '';
            // updated.METHOD = await section.getControl('Section103InspectionMethod').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section103DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '11.1') {
            updated.DATE_INSPECTED = await getDate('Section111Date');
            updated.INSPECTED_BY = (await section.getControl('Section111InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section111InspectionMethod').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section111DecisionTaken').getValue())?.[0]?.ReturnValue || '';
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
        if (key === '13.1') {
            updated.DATE_INSPECTED = await getDate('Section131Date');
            updated.INSPECTED_BY = (await section.getControl('Section131InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section131Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section131DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '13.2') {
            updated.DATE_INSPECTED = await getDate('Section132Date');
            updated.INSPECTED_BY = (await section.getControl('Section132InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section132Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section132DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '13.3') {
            updated.DATE_INSPECTED = await getDate('Section133Date');
            updated.INSPECTED_BY = (await section.getControl('Section133InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section133Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section133DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '13.4') {
            updated.DATE_INSPECTED = await getDate('Section134Date');
            updated.INSPECTED_BY = (await section.getControl('Section134InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section134Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section134DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '13.5') {
            updated.DATE_INSPECTED = await getDate('Section135Date');
            updated.INSPECTED_BY = (await section.getControl('Section135InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section135Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section135DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '13.6') {
            updated.DATE_INSPECTED = await getDate('Section136Date');
            updated.INSPECTED_BY = (await section.getControl('Section136InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section136Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section136DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
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

    async function getHeaderValues(section) {
        return {
            CUSTOMER_NAME: await section.getControl('Company').getValue(),
            SNORKEL_NO: await section.getControl('SnorkelNo').getValue(),
            TYPE: (await section.getControl('TypeList').getValue())?.[0]?.ReturnValue ?? '',
            PRODUCTION_NO: await section.getControl('ProductionNo').getValue(),
            DATE_STARTED: await section.getControl('StartDate').getValue(),
            DATE_ENDED: await section.getControl('EndDate').getValue(),
            CHECKER:  await section.getControl('Checker').getValue()
        };
    }
}
