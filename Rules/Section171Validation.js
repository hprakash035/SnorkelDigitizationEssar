/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section171Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        //  const headerSection = FormSectionedTable.getSection('HeaderSection');
        // const snorkelNoControl = headerSection.getControl('SnorkelNo');
        // const snorkelNo = snorkelNoControl.getValue();

       
        const Section171 = FormSectionedTable.getSection('Section171Form');
        const decisionTakenCtrl = Section171.getControl('Section171DecisionTaken');
        const inspectedByCtrl = Section171.getControl('Section171InspectedBy');
        const inspectionMethodCtrl = Section171.getControl('Section171Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section171UserInputImage1 =FormSectionedTable.getSection('Section181Form');
    Section171UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section171Form').getControl('Section181NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section171Create.action'
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
                Message: 'Unexpected error during Section 17.1 validation. Please try again.'
            }
        });
    }
}

