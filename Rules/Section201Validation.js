/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section201Validation(clientAPI) {
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

        const Section201 = FormSectionedTable.getSection('Section201Form');
        const decisionTakenCtrl = Section201.getControl('Section201DecisionTaken');
        const inspectedByCtrl = Section201.getControl('Section201InspectedBy');
        const inspectionMethodCtrl = Section201.getControl('Section201Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section201UserInputImage1 =FormSectionedTable.getSection('Section201StaticImage');
    Section201UserInputImage1.setVisible('true');
    
     const Section201UserInputForm =FormSectionedTable.getSection('Section201UserInputForm');
    Section201UserInputForm.setVisible('true');
    FormSectionedTable.getSection('Section201Form').getControl('Section201StaticNextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section201Create.action'
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
                Message: 'Unexpected error during Section 20.1 validation. Please try again.'
            }
        });
    }
}

