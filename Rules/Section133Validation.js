/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section133Validation(clientAPI) {
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

        const Section133 = FormSectionedTable.getSection('Section133Form');
        const decisionTakenCtrl = Section133.getControl('Section133DecisionTaken');
        const inspectedByCtrl = Section133.getControl('Section133InspectedBy');
        const inspectionMethodCtrl = Section133.getControl('Section133Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  

    const Section133UserInputImage =FormSectionedTable.getSection('Section134Form');
    Section133UserInputImage.setVisible('true');
    FormSectionedTable.getSection('Section133Form').getControl('Section134NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section133Create.action'
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
                Message: 'Unexpected error during Section 13.3 validation. Please try again.'
            }
        });
    }
}

