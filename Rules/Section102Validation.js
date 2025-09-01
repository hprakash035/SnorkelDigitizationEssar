
export default function Section102Validation(clientAPI) {
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

        const Section102 = FormSectionedTable.getSection('Section102Form');
        const decisionTakenCtrl = Section102.getControl('Section102DecisionTaken');
        const inspectedByCtrl = Section102.getControl('Section102InspectedBy');
        const inspectionMethodCtrl = Section102.getControl('Section102Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
           

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section102Create.action'
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
                Message: 'Unexpected error during Section 10.2 validation. Please try again.'
            }
        });
    }
}

