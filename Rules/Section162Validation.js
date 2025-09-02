/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section162Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        //  const headerSection = FormSectionedTable.getSection('HeaderSection');
        // const snorkelNoControl = headerSection.getControl('SnorkelNo');
        // const snorkelNo = snorkelNoControl.getValue();

        // if (!snorkelNo) {
        //     return clientAPI.executeAction({
        //         Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
        //     });
        // }

        const Section162 = FormSectionedTable.getSection('Section162Form');
        const decisionTakenCtrl = Section162.getControl('Section162DecisionTaken');
        const inspectedByCtrl = Section162.getControl('Section162InspectedBy');
        const inspectionMethodCtrl = Section162.getControl('Section162Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section162UserInputImage1 =FormSectionedTable.getSection('Section162TestForm');
    Section162UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section162TestName').setVisible(true);
    FormSectionedTable.getSection('Section162Form').getControl('Section162TestNextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section162Create.action'
            });
           
        } else {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action'
            });
        }

    } catch (error) {
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ErrorMessage.action',
            Properties: {
                Message: 'Unexpected error during Section 16.1 validation. Please try again.'
            }
        });
    }
}

