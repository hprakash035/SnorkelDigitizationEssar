/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section194Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        // //  const headerSection = FormSectionedTable.getSection('HeaderSection');
        // // const snorkelNoControl = headerSection.getControl('SnorkelNo');
        // const snorkelNo = snorkelNoControl.getValue();

        // if (!snorkelNo) {
        //     return clientAPI.executeAction({
        //         Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
        //     });
        // }

        const Section194 = FormSectionedTable.getSection('Section194Form');
        const decisionTakenCtrl = Section194.getControl('Section194DecisionTaken');
        const inspectedByCtrl = Section194.getControl('Section194InspectedBy');
        const inspectionMethodCtrl = Section194.getControl('Section194Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    const Section194UserInputImage1 =FormSectionedTable.getSection('Section195Form');
    Section194UserInputImage1.setVisible('true');
    FormSectionedTable.getSection('Section194Form').getControl('Section195NextButton').setVisible(false);
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section194Create.action'
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
                Message: 'Unexpected error during Section 19.4 validation. Please try again.'
            }
        });
    }
}

