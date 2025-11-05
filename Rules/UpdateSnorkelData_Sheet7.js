import LoadSnorkelData7 from './LoadSnorkelData7';

export default async function UpdateSnorkelData_Sheet7(clientAPI) {
    clientAPI.showActivityIndicator("...");
    const snorkelNo = clientAPI.binding.SNORKEL_NO;
    const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
    try {
        const pageProxy = clientAPI.getPageProxy();

        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');

        const binding = pageProxy.getBindingObject();

        const headerResults = await clientAPI.read(service, 'QC_HEADER', [], `$filter=SNORKEL_NO eq '${snorkelNo}'`);

        if (!headerResults || !Array.isArray(headerResults._array) || headerResults._array.length !== 1) {
            throw new Error(`❌ QC_HEADER not found or multiple found`);
        }

        const header = headerResults._array[0];

        const headerReadLink = header['@odata.readLink'];

        const itemsResult = await clientAPI.read(service, `${headerReadLink}/qc_ITEMS`, [], '');

        const items = itemsResult?._array || [];

        for (const item of items) {
            const question = item.QUESTION || '';
            const sectionKey = question.match(/^(\d+\.\d+)/)?.[1];

            if (!sectionKey) {
                continue;
            }

            const sectionId = getSectionFormId(sectionKey);

            const section = FormSectionedTable.getSection(sectionId);

            if (!section) {
                continue;
            }

            if (!section.getVisible()) {
                continue;
            }

            const values = await getUpdatedValuesForSection(sectionKey, section);

            if (Object.keys(values).length === 0) {
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
            } catch (err) {
            }
        }

        await LoadSnorkelData7(clientAPI);

        clientAPI.dismissActivityIndicator();
    } catch (error) {
        clientAPI.dismissActivityIndicator();
    }

    function getSectionFormId(key) {
        return {
           '20.1': 'Section201Form',
                   '20.2': 'Section202Form',
                   '20.3': 'Section203Form',
                   '20.4': 'Section204Form',
                 
                   '21.1': 'Section211Form',
                   '21.2': 'Section212Form',
                   '21.3': 'Section213Form',
                   '21.4': 'Section214Form'
        }[key];
    }

    async function getUpdatedValuesForSection(key, section) {
        const updated = {};

        const getDate = async (controlName) => {
            const val = await section.getControl(controlName).getValue();
            return val ? new Date(val).toISOString() : undefined;
        };

     
        if (key === '20.1') {
            updated.DATE_INSPECTED = await getDate('Section201Date');
            updated.INSPECTED_BY = (await section.getControl('Section201InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section201Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section201DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }
        if (key === '20.2') {
            updated.DATE_INSPECTED = await getDate('Section202Date');
            updated.INSPECTED_BY = (await section.getControl('Section202InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section202Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section202DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '20.3') {
            updated.DATE_INSPECTED = await getDate('Section203Date');
            updated.INSPECTED_BY = (await section.getControl('Section203InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section203Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section203DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '20.4') {
            updated.DATE_INSPECTED = await getDate('Section204Date');
            updated.INSPECTED_BY = (await section.getControl('Section204InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section204Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section204DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '21.1') {
            updated.DATE_INSPECTED = await getDate('Section211Date');
            updated.INSPECTED_BY = (await section.getControl('Section211InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section211Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section211DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '21.2') {
            updated.DATE_INSPECTED = await getDate('Section212Date');
            updated.INSPECTED_BY = (await section.getControl('Section212InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section212Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section212DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '21.3') {
            updated.DATE_INSPECTED = await getDate('Section213Date');
            updated.INSPECTED_BY = (await section.getControl('Section213InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section213Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section213DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '21.4') {
            updated.DATE_INSPECTED = await getDate('Section214Date');
            updated.INSPECTED_BY = (await section.getControl('Section214InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section214Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section214DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        
        Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);
        return updated;
    }

}
