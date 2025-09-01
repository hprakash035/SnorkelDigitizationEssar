/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section203Validation(clientAPI) {
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

        const Section203 = FormSectionedTable.getSection('Section203Form');
        const decisionTakenCtrl = Section203.getControl('Section203DecisionTaken');
        const inspectedByCtrl = Section203.getControl('Section203InspectedBy');
        const inspectionMethodCtrl = Section203.getControl('Section203Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section203UserInputImage1 =FormSectionedTable.getSection('Section203StaticImage');
    Section203UserInputImage1.setVisible('true');
    const Section203TakePhoto =FormSectionedTable.getSection('Section203TakePhoto');
    Section203TakePhoto.setVisible('true');
    FormSectionedTable.getSection('Section203Form').getControl('Section203StaticNextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section203Create.action'
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
                Message: 'Unexpected error during Section 20.3 validation. Please try again.'
            }
        });
    }
}

