/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section122Validation(clientAPI) {
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

        const Section122 = FormSectionedTable.getSection('Section122Form');
        const decisionTakenCtrl = Section122.getControl('Section122DecisionTaken');
        const inspectedByCtrl = Section122.getControl('Section122InspectedBy');
        const inspectionMethodCtrl = Section122.getControl('Section122Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  
    const Section122Form =FormSectionedTable.getSection('Section123Form');
    Section122Form.setVisible(true);
 
    FormSectionedTable.getSection('Section122Form').getControl('Section123NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section122Create.action'
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
                Message: 'Unexpected error during Section 12.2 validation. Please try again.'
            }
        });
    }
}

