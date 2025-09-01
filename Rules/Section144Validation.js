/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section144Validation(clientAPI) {
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

        const Section144 = FormSectionedTable.getSection('Section144Form');
        const decisionTakenCtrl = Section144.getControl('Section144DecisionTaken');
        const inspectedByCtrl = Section144.getControl('Section144InspectedBy');
        const inspectionMethodCtrl = Section144.getControl('Section144Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  

 
    const Section144UserInputImage1 =FormSectionedTable.getSection('Section145Form');
    Section144UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section144Form').getControl('Section145NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section144Create.action'
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
                Message: 'Unexpected error during Section 14.4 validation. Please try again.'
            }
        });
    }
}

