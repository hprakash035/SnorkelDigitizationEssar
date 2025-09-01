/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section113Validation(clientAPI) {
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

        const Section113 = FormSectionedTable.getSection('Section113Form');
        const decisionTakenCtrl = Section113.getControl('Section113DecisionTaken');
        const inspectedByCtrl = Section113.getControl('Section113InspectedBy');
        const inspectionMethodCtrl = Section113.getControl('Section113Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section113Form').getControl('Section113StaticNextButton').setVisible(false);
    const Section113StaticImage =FormSectionedTable.getSection('Section113StaticImage');
    Section113StaticImage.setVisible('true');
    const Section113UserInputImage =FormSectionedTable.getSection('Section113UserInputImage');
    Section113UserInputImage.setVisible('true');
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section113Create.action'
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
                Message: 'Unexpected error during Section 11.3 validation. Please try again.'
            }
        });
    }
}

