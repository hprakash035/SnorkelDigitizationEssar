/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section193Validation(clientAPI) {
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

        const Section193 = FormSectionedTable.getSection('Section193Form');
        const decisionTakenCtrl = Section193.getControl('Section193DecisionTaken');
        const inspectedByCtrl = Section193.getControl('Section193InspectedBy');
        const inspectionMethodCtrl = Section193.getControl('Section193Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section193UserInputImage1 =FormSectionedTable.getSection('Section194Form');
    Section193UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section193Form').getControl('Section194NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section193Create.action'
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
                Message: 'Unexpected error during Section 19.3 validation. Please try again.'
            }
        });
    }
}

