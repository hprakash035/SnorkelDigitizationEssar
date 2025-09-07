 /**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section202Validation(clientAPI) {
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

        const Section202 = FormSectionedTable.getSection('Section202Form');
        const decisionTakenCtrl = Section202.getControl('Section202DecisionTaken');
        const inspectedByCtrl = Section202.getControl('Section202InspectedBy');
        const inspectionMethodCtrl = Section202.getControl('Section202Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section203Form =FormSectionedTable.getSection('Section203Form');
    Section203Form.setVisible('true');
    // const Section202UserInputImage1 =FormSectionedTable.getSection('Section202StaticImage');
    // Section202UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section202Form').getControl('Section203NextButton').setVisible(false);

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section202Create.action'
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
                Message: 'Unexpected error during Section 20.2 validation. Please try again.'
            }
        });
    }
}

