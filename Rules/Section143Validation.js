/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section143Validation(clientAPI) {
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

        const Section143 = FormSectionedTable.getSection('Section143Form');
        const decisionTakenCtrl = Section143.getControl('Section143DecisionTaken');
        const inspectedByCtrl = Section143.getControl('Section143InspectedBy');
        const inspectionMethodCtrl = Section143.getControl('Section143Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  

 
    const Section143UserInputImage1 =FormSectionedTable.getSection('Section144Form');
    Section143UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section143Form').getControl('Section144NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section143Create.action'
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
                Message: 'Unexpected error during Section 14.3 validation. Please try again.'
            }
        });
    }
}

