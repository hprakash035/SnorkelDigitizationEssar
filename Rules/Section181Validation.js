/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section181Validation(clientAPI) {
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

        const Section181 = FormSectionedTable.getSection('Section181Form');
        const decisionTakenCtrl = Section181.getControl('Section181DecisionTaken');
        const inspectedByCtrl = Section181.getControl('Section181InspectedBy');
        const inspectionMethodCtrl = Section181.getControl('Section181Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section181UserInputImage1 =FormSectionedTable.getSection('Section182Form');
    Section181UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section181Form').getControl('Section182NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section181Create.action'
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
                Message: 'Unexpected error during Section 18.1 validation. Please try again.'
            }
        });
    }
}

