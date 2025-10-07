import LoadSnorkelData1 from './LoadSnorkelData1';

export default async function UpdateSnorkelData_Sheet1(clientAPI) {
    // console.log(' Entered UpdateSnorkelData_Sheet1');
    clientAPI.showActivityIndicator("...");

    const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';

    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');

        //  Read QC_HEADER by SNORKEL_NO
        const snorkelNo = headerSection.getControl('SnorkelNo').getValue();

        const headerResults = await clientAPI.read(service, 'QC_HEADER', [], `$filter=SNORKEL_NO eq '${snorkelNo}'`);
        if (!headerResults || !Array.isArray(headerResults._array) || headerResults._array.length !== 1) {
            // console.error(' QC_HEADER not found or multiple found', headerResults);
            throw new Error(` QC_HEADER not found or multiple found`);
        }

        const header = headerResults._array[0];
        const headerReadLink = header['@odata.readLink'];

        //  Load QC_ITEMs
        const itemsResult = await clientAPI.read(service, `${headerReadLink}/qc_ITEMS`, [], '');
        const items = itemsResult?._array || [];

        for (const item of items) {
            const question = item.QUESTION || '';
            const sectionKey = question.match(/^(\d+\.\d+)/)?.[1];
            if (!sectionKey) continue;

            const sectionId = getSectionFormId(sectionKey);
            const section = FormSectionedTable.getSection(sectionId);
            if (!section || !section.getVisible()) continue;

            const values = await getUpdatedValuesForSection(sectionKey, section, service, snorkelNo);
            if (Object.keys(values).length === 0) continue;

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
                // console.error(` Failed to update QC_ITEM ${itemReadLink}:`, err);
            }
        }

        //  Update QC_HEADER
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
        }

        // Reload UI
        await LoadSnorkelData1(clientAPI);
        clientAPI.dismissActivityIndicator();
        // console.log(' UpdateSnorkelData_Sheet1 completed successfully');

    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error(' Error in UpdateSnorkelData_Sheet1:', error);
    }

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
            '6.3': 'Section63Form',
        }[key];
    }

    async function getHeaderValues(section) {
        return {
            CUSTOMER_NAME: (await section.getControl('Company').getValue())?.[0]?.ReturnValue ?? '',
            SNORKEL_NO: await section.getControl('SnorkelNo').getValue(),
            TYPE: (await section.getControl('TypeList').getValue())?.[0]?.ReturnValue ?? '',
            PRODUCTION_NO: await section.getControl('ProductionNo').getValue(),
            DATE_STARTED: await section.getControl('StartDate').getValue(),
            DATE_ENDED: await section.getControl('EndDate').getValue()
        };
    }

    async function getUpdatedValuesForSection(key, section, service, snorkelNo) {
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
            updated.DECISION_TAKEN = (await section.getControl('Section31DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '3.2') {
            updated.DATE_INSPECTED = await getDate('Section32Date');
            updated.INSPECTED_BY = (await section.getControl('Section32InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.DECISION_TAKEN = (await section.getControl('Section32DecisionTaken').getValue())?.[0]?.ReturnValue || '';
        }

        if (key === '4.1') {
            updated.DATE_INSPECTED = await getDate('Section41Date');
            updated.INSPECTED_BY = (await section.getControl('Section41InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section41Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section41DecisionTaken').getValue())?.[0]?.ReturnValue || '';
            await updateSection41Tests(clientAPI, section, service, snorkelNo);
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

        if (key === '6.3') {
            updated.DATE_INSPECTED = await getDate('Section63Date');
            updated.INSPECTED_BY = (await section.getControl('Section63InspectedBy').getValue())?.[0]?.ReturnValue || '';
            updated.METHOD = await section.getControl('Section63Method').getValue();
            updated.DECISION_TAKEN = (await section.getControl('Section63DecisionTaken').getValue())?.[0]?.ReturnValue || '';
            await updateSection63Tests(clientAPI, section, service, snorkelNo);
        }

        Object.keys(updated).forEach(k => updated[k] === undefined && delete updated[k]);
        return updated;
    }
}

async function updateSection41Tests(clientAPI,) {
    try {
        const pageProxy = clientAPI.getPageProxy();

        const sectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = sectionedTable.getSection('HeaderSection');


        const snorkelNo = headerSection.getControl('SnorkelNo').getValue();
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        if (!sectionedTable) {
            // console.error('SectionedTable control not found.');
            return;
        }

        const section = sectionedTable.getSection('Section41TestForm');
        if (!section) {
            // console.error('Section41TestForm section not found.');
            return;
        }

        if (!section.getVisible()) {
            // console.warn('Section41TestForm is not visible. Controls cannot be accessed.');
            return;
        }

        const gaps = ['A', 'B', 'C', 'D'];

        for (const gap of gaps) {
            const actualCtrl = section.getControl(`Section41TestActualGap${gap}`);
            const methodCtrl = section.getControl(`Section41TestMethod${gap}`);
            const positionCtrl = section.getControl(`Section41TestPositionGap${gap}`);
            const toleranceCtrl = section.getControl(`Section41TestTolerance${gap}`);

            if (!actualCtrl || !methodCtrl || !positionCtrl || !toleranceCtrl) {
                // console.warn(`Skipping Gap ${gap}: Missing one or more controls.`);
                continue;
            }

            // Get values asynchronously in case controls are async
            const actualValue = await actualCtrl.getValue();
            const methodValue = await methodCtrl.getValue();
            const positionValue = await positionCtrl.getValue();
            const toleranceValue = await toleranceCtrl.getValue();

           

            const testProps = {
                actualvalue: actualValue,
                method: methodValue,
                position: positionValue,
                tolerance: toleranceValue,
                testname: '*1 Gap measurement between 1st ring brick and the Core Shell *(Actual Max - Actual Min) < 2mm',
                QUESTION: '4.1 Result of gap measurement  *1( Uniform gap is required in the circumference)',
                qC_HEADER_SNORKEL_NO: snorkelNo
            };

            try {
                // Check if record exists
                const query = `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and position eq '${positionValue}'`;
                const existing = await clientAPI.read(service, 'QC_Test_Table', [], query);

                if (existing && existing._array.length > 0) {
                    // Update existing record
                    const readLink = existing._array[0]['@odata.readLink'];
                    await clientAPI.executeAction({
                        Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                        Properties: {
                            Target: { EntitySet: 'QC_Test_Table', Service: service, ReadLink: readLink },
                            Properties: testProps
                        }
                    });
                    // console.log(` Updated QC_Test_Table for Gap ${gap}`);
                } else {
                    // Create new record
                    await clientAPI.executeAction({
                        Name: '/TRL_RH_SnorkelApp/Actions/CreateEntity.action',
                        Properties: {
                            Target: { EntitySet: 'QC_Test_Table', Service: service },
                            Properties: testProps
                        }
                    });
                    // console.log(` Created QC_Test_Table for Gap ${gap}`);
                }
            } catch (err) {
                // console.error(` Failed to update/create QC_Test_Table for Gap ${gap}:`, err);
            }
        }

    } catch (error) {
        // console.error('Error in updateSection41Tests:', error);
    }
}


async function updateSection63Tests(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const sectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = sectionedTable.getSection('HeaderSection');


        const snorkelNo = headerSection.getControl('SnorkelNo').getValue();
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
    const tests = [
        { suffix: 'Mesh', testname: '*2 Height measurement for Steel mesh & Y studs"' },
        { suffix: 'Studs', testname: '*2 Height measurement for Steel mesh & Y studs"' }
    ];

    for (const { suffix, testname } of tests) {
        const actualValue = await sectionedTable.getControl(`Section63TestActual${suffix}`).getValue();
        const position = await sectionedTable.getControl(`Section63TestPosition${suffix}`).getValue();
        const tolerance = await sectionedTable.getControl(`Section63TestTolerance${suffix}`).getValue();

        const testProps = {
            actualvalue: actualValue,
            position,
            tolerance,
            qC_HEADER_SNORKEL_NO: snorkelNo,
            testname,
            QUESTION:' 6.2 height of steel mesh & Y studs highest point *2',

        };

        try {
            const query = `$filter=qC_HEADER_SNORKEL_NO eq '${snorkelNo}' and position eq '${position}'`;
            const existing = await clientAPI.read(service, 'QC_Test_Table', [], query);
            if (existing && existing._array.length > 0) {
                const readLink = existing._array[0]['@odata.readLink'];
                await clientAPI.executeAction({
                    Name: '/TRL_RH_SnorkelApp/Actions/UpdateEntity.action',
                    Properties: {
                        Target: { EntitySet: 'QC_Test_Table', Service: service, ReadLink: readLink },
                        Properties: testProps
                    }
                });
            } else {
                await clientAPI.executeAction({
                    Name: '/TRL_RH_SnorkelApp/Actions/CreateEntity.action',
                    Properties: {
                        Target: { EntitySet: 'QC_Test_Table', Service: service },
                        Properties: testProps
                    }
                });
            }
        } catch (err) {
            // console.error(` Failed to update/create QC_Test_Table for ${suffix}:`, err);
        }
    }
}
