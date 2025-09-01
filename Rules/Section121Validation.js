/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section121Validation(clientAPI) {
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

        const Section121 = FormSectionedTable.getSection('Section121Form');
        const decisionTakenCtrl = Section121.getControl('Section121DecisionTaken');
        const inspectedByCtrl = Section121.getControl('Section121InspectedBy');
        const inspectionMethodCtrl = Section121.getControl('Section121Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  
    const Section122Form =FormSectionedTable.getSection('Section122Form');
    Section122Form.setVisible('true');
    FormSectionedTable.getSection('Section121Form').getControl('FormCellButton0').setVisible(false);
   
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section121Create.action'
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
                Message: 'Unexpected error during Section 12.1 validation. Please try again.'
            }
        });
    }
}

