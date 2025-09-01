/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section131Validation(clientAPI) {
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

        const Section131 = FormSectionedTable.getSection('Section131Form');
        const decisionTakenCtrl = Section131.getControl('Section131DecisionTaken');
        const inspectedByCtrl = Section131.getControl('Section131InspectedBy');
        const inspectionMethodCtrl = Section131.getControl('Section131Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  
    const Section131Form =FormSectionedTable.getSection('Section131StaticImage');
    Section131Form.setVisible('true');
    const Section131UserInputImage =FormSectionedTable.getSection('Section131UserInputImage');
    Section131UserInputImage.setVisible('true');
    FormSectionedTable.getSection('Section131Form').getControl('Secion131StaticButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section131Create.action'
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
                Message: 'Unexpected error during Section 13.1 validation. Please try again.'
            }
        });
    }
}

