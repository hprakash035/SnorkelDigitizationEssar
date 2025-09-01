/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section184Validation(clientAPI) {
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

        const Section184 = FormSectionedTable.getSection('Section184Form');
        const decisionTakenCtrl = Section184.getControl('Section184DecisionTaken');
        const inspectedByCtrl = Section184.getControl('Section184InspectedBy');
        const inspectionMethodCtrl = Section184.getControl('Section184Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section184UserInputImage1 =FormSectionedTable.getSection('Section191Form');
    Section184UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section184Form').getControl('Section191NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section184Create.action'
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
                Message: 'Unexpected error during Section 18.4 validation. Please try again.'
            }
        });
    }
}

