export default function Section1Validation(clientAPI) {
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

        const Section1 = FormSectionedTable.getSection('Section1Form');
        const decisionTakenCtrl = Section1.getControl('Section1DecisionTaken1');
        const inspectedByCtrl = Section1.getControl('Section1InspectedBy1');
        const inspectionMethodCtrl = Section1.getControl('Section1InspectionMethod1');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != ""  && inspectedBy !="") {
            const Section2 = FormSectionedTable.getSection('Section2Form');
 
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section1Create.action'
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
                Message: 'Unexpected error during Section 1 validation. Please try again.'
            }
        });
    }
}
