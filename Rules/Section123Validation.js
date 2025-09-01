/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section123Validation(clientAPI) {
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

        const Section123 = FormSectionedTable.getSection('Section123Form');
        const decisionTakenCtrl = Section123.getControl('Section123DecisionTaken');
        const inspectedByCtrl = Section123.getControl('Section123InspectedBy');
        const inspectionMethodCtrl = Section123.getControl('Section123Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  
    const Section123Form =FormSectionedTable.getSection('Section123StaticImage');
    Section123Form.setVisible('true');
    const Section123UserInputImage =FormSectionedTable.getSection('Section123UserInputImage');
    Section123UserInputImage.setVisible('true');
    FormSectionedTable.getSection('Section123Form').getControl('Secion123StaticButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section123Create.action'
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
                Message: 'Unexpected error during Section 12.3 validation. Please try again.'
            }
        });
    }
}

