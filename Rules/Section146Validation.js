/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section146Validation(clientAPI) {
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

        const Section146 = FormSectionedTable.getSection('Section146Form');
        const decisionTakenCtrl = Section146.getControl('Section146DecisionTaken');
        const inspectedByCtrl = Section146.getControl('Section146InspectedBy');
        const inspectionMethodCtrl = Section146.getControl('Section146Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  

 
    const Section146UserInputImage1 =FormSectionedTable.getSection('Section151Form');
    Section146UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section146Form').getControl('Section151NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section146Create.action'
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
                Message: 'Unexpected error during Section 14.6 validation. Please try again.'
            }
        });
    }
}

