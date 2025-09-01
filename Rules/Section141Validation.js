/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section141Validation(clientAPI) {
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

        const Section141 = FormSectionedTable.getSection('Section141Form');
        const decisionTakenCtrl = Section141.getControl('Section141DecisionTaken');
        const inspectedByCtrl = Section141.getControl('Section141InspectedBy');
        const inspectionMethodCtrl = Section141.getControl('Section141Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  

 
    const Section141UserInputImage1 =FormSectionedTable.getSection('Section142Form');
    Section141UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section141Form').getControl('Section142NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section141Create.action'
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
                Message: 'Unexpected error during Section 14.1 validation. Please try again.'
            }
        });
    }
}

