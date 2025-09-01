/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section112Validation(clientAPI) {
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

        const Section112 = FormSectionedTable.getSection('Section112Form');
        const decisionTakenCtrl = Section112.getControl('Section112DecisionTaken');
        const inspectedByCtrl = Section112.getControl('Section112InspectedBy');
        const inspectionMethodCtrl = Section112.getControl('Section112Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section112Form').getControl('Section112StaticNextButton').setVisible(false);
    const Section112StaticImage =FormSectionedTable.getSection('Section112StaticImage');
    Section112StaticImage.setVisible('true');
    const Section112UserInputImage =FormSectionedTable.getSection('Section112UserInputImage');
    Section112UserInputImage.setVisible('true');
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section112Create.action'
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
                Message: 'Unexpected error during Section 11.2 validation. Please try again.'
            }
        });
    }
}

