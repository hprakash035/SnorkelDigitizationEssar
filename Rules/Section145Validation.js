/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section145Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        //  const headerSection = FormSectionedTable.getSection('HeaderSection');
        // const snorkelNoControl = headerSection.getControl('SnorkelNo');
        // const snorkelNo = snorkelNoControl.getValue();

        // if (!snorkelNo) {
        //     return clientAPI.executeAction({
        //         Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
        //     });
        // }

        const Section145 = FormSectionedTable.getSection('Section145Form');
        const decisionTakenCtrl = Section145.getControl('Section145DecisionTaken');
        const inspectedByCtrl = Section145.getControl('Section145InspectedBy');
        const inspectionMethodCtrl = Section145.getControl('Section145Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  

 
    const Section145UserInputImage1 =FormSectionedTable.getSection('Section146Form');
    Section145UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section145Form').getControl('Section146NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section145Create.action'
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
                Message: 'Unexpected error during Section 14.5 validation. Please try again.'
            }
        });
    }
}

