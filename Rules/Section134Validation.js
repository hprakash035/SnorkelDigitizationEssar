/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section134Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
         const headerSection = FormSectionedTable.getSection('HeaderSection');
        const snorkelNoControl = headerSection.getControl('SnorkelNo');
        const snorkelNo = snorkelNoControl.getValue();

        if (!snorkelNo) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            });
        }

        const Section134 = FormSectionedTable.getSection('Section134Form');
        const decisionTakenCtrl = Section134.getControl('Section134DecisionTaken');
        const inspectedByCtrl = Section134.getControl('Section134InspectedBy');
        const inspectionMethodCtrl = Section134.getControl('Section134Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  

    const Section134UserInputImage =FormSectionedTable.getSection('Section135Form');
    Section134UserInputImage.setVisible('true');
    FormSectionedTable.getSection('Section134Form').getControl('Section135NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section134Create.action'
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
                Message: 'Unexpected error during Section 13.4 validation. Please try again.'
            }
        });
    }
}

