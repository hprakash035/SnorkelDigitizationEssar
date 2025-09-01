/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section183Validation(clientAPI) {
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

        const Section183 = FormSectionedTable.getSection('Section183Form');
        const decisionTakenCtrl = Section183.getControl('Section183DecisionTaken');
        const inspectedByCtrl = Section183.getControl('Section183InspectedBy');
        const inspectionMethodCtrl = Section183.getControl('Section183Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section183UserInputImage1 =FormSectionedTable.getSection('Section184Form');
    Section183UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section183Form').getControl('Section184NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section183Create.action'
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
                Message: 'Unexpected error during Section 18.3 validation. Please try again.'
            }
        });
    }
}

