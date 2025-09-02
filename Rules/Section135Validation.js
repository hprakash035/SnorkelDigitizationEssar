/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section135Validation(clientAPI) {
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

        const Section135 = FormSectionedTable.getSection('Section135Form');
        const decisionTakenCtrl = Section135.getControl('Section135DecisionTaken');
        const inspectedByCtrl = Section135.getControl('Section135InspectedBy');
        const inspectionMethodCtrl = Section135.getControl('Section135Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
            const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  

    const Section135UserInputImage =FormSectionedTable.getSection('Section135StaticImage');
    Section135UserInputImage.setVisible('true');
    const Section135UserInputImage1 =FormSectionedTable.getSection('Section135UserInputImage');
    console.log(Section135UserInputImage1);
    Section135UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section135Form').getControl('Section135StaticNextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section135Create.action'
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
                Message: 'Unexpected error during Section 13.4 validation. Please try again.'
            }
        });
    }
}

