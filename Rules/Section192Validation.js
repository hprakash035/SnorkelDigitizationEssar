/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section192Validation(clientAPI) {
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

        const Section192 = FormSectionedTable.getSection('Section192Form');
        const decisionTakenCtrl = Section192.getControl('Section192DecisionTaken');
        const inspectedByCtrl = Section192.getControl('Section192InspectedBy');
        const inspectionMethodCtrl = Section192.getControl('Section192Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section192UserInputImage1 =FormSectionedTable.getSection('Section193Form');
    Section192UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section192Form').getControl('Section193NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section192Create.action'
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
                Message: 'Unexpected error during Section 19.2 validation. Please try again.'
            }
        });
    }
}

