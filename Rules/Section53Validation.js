/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section53Validation(clientAPI) {
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

        const Section53 = FormSectionedTable.getSection('Section53Form');
        const decisionTakenCtrl = Section53.getControl('Section53DecisionTaken');
        const inspectedByCtrl = Section53.getControl('Section53InspectedBy');
        const inspectionMethodCtrl = Section53.getControl('Section53Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
           

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section53Create.action'
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
                Message: 'Unexpected error during Section 5.3 validation. Please try again.'
            }
        });
    }
}

