/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section132Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        // const headerSection = FormSectionedTable.getSection('HeaderSection');
        // const snorkelNoControl = headerSection.getControl('SnorkelNo');
        // const snorkelNo = snorkelNoControl.getValue();
        
        const Section132 = FormSectionedTable.getSection('Section132Form');
        const decisionTakenCtrl = Section132.getControl('Section132DecisionTaken');
        const inspectedByCtrl = Section132.getControl('Section132InspectedBy');
        const inspectionMethodCtrl = Section132.getControl('Section132Method');
        
        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {
            const Section132UserInputImage = FormSectionedTable.getSection('Section132UserInputImage123');
            Section132UserInputImage.setVisible(true);
            const takePhotoControl = Section132UserInputImage.getControl('Section132TakePhoto123');
            takePhotoControl.setVisible(true);
            const Section132Form = FormSectionedTable.getSection('Section132StaticImage');
            Section132Form.setVisible(true);

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section132Create.action'
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
