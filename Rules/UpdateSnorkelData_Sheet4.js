import LoadSnorkelData4 from './LoadSnorkelData4';

export default async function UpdateSnorkelData_Sheet4(clientAPI) {
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

        await LoadSnorkelData4(clientAPI);

        clientAPI.dismissActivityIndicator();
    } catch (error) {
        clientAPI.dismissActivityIndicator();
    }

    function getSectionFormId(key) {
        return {
           '13.1': 'Section131Form',
            '13.2': 'Section132Form',
            '13.3': 'Section133Form',
            '13.4': 'Section134Form',
            '13.5': 'Section135Form',
            '13.6': 'Section136Form',
        }[key];
    }

    async function getUpdatedValuesForSection(key, section) {
        const updated = {};

        const getDate = async (controlName) => {
            const val = await section.getControl(controlName).getValue();
            return val ? new Date(val).toISOString() : undefined;
        };

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
            await UpdateSection132TestValues(clientAPI);
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

        Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);
        return updated;
    }

 async function UpdateSection132TestValues(clientAPI) {
    const snorkelNo = clientAPI.binding.SNORKEL_NO;
    const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
    const pageProxy = clientAPI.getPageProxy();
    const testForm = pageProxy.getControl('FormSectionedTable').getSection('Section132TestForm');
    const positionMap = ['Gap-A', 'Gap-B', 'Gap-C', 'Gap-D'];

    try {
        const result = await clientAPI.read(service, 'QC_Test_Table', [], `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}'`);
        const allTests = result?._array || [];

        const section132Tests = allTests.filter(t =>
            (t.testname || '').toLowerCase().includes('gap measurement between 2nd ring brick')
        );

        const updatePromises = positionMap.map(async (positionLabel, index) => {
            const testItem = section132Tests.find(t => (t.position || '').toLowerCase() === positionLabel.toLowerCase());

            if (!testItem) {
                return null;
            }

            const idx = index + 1;

            const actualValueCtrl = testForm.getControl(`Section132ActualValue${idx}`);
            const methodCtrl = testForm.getControl(`Section132Method${idx}`);
            const toleranceCtrl = testForm.getControl(`Section132Tolerence${idx}`);

            const updatedData = {
                actualvalue: await actualValueCtrl.getValue(),
                method: await methodCtrl.getValue(),
                tolerance: await toleranceCtrl.getValue()
            };

            const readLink = testItem['@odata.readLink'] || `QC_Test_Table(${testItem.ID})`;

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                Properties: {
                    Target: {
                        EntitySet: 'QC_Test_Table',
                        Service: service,
                        ReadLink: readLink
                    },
                    Properties: updatedData
                }
            });
        });

        await Promise.all(updatePromises);

    } catch (error) {
    }
}
}
