/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section136Validation(clientAPI) {
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

        const Section136 = FormSectionedTable.getSection('Section136Form');
        const decisionTakenCtrl = Section136.getControl('Section136DecisionTaken');
        const inspectedByCtrl = Section136.getControl('Section136InspectedBy');
        const inspectionMethodCtrl = Section136.getControl('Section136Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  

   
            clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section136Create.action'
            });
             return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Nav2Sheet5.action'
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
                Message: 'Unexpected error during Section 13.6 validation. Please try again.'
            }
        });
    }
}

