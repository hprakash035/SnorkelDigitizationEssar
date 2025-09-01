/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section204Validation(clientAPI) {
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

        const Section204 = FormSectionedTable.getSection('Section204Form');
        const decisionTakenCtrl = Section204.getControl('Section204DecisionTaken');
        const inspectedByCtrl = Section204.getControl('Section204InspectedBy');
        const inspectionMethodCtrl = Section204.getControl('Section204Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    // const Section204UserInputImage1 =FormSectionedTable.getSection('Section204StaticImage');
    // Section204UserInputImage1.setVisible('true');
    // const Section204TakePhoto =FormSectionedTable.getSection('Section204TakePhoto');
    // Section204TakePhoto.setVisible('true');
    FormSectionedTable.getSection('Section204Form').getControl('Section205NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section204Create.action'
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
                Message: 'Unexpected error during Section 20.4 validation. Please try again.'
            }
        });
    }
}

