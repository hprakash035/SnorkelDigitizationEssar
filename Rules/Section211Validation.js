/**
 * Section 211 Validation and make Section 205 controls visible
 * @param {IClientAPI} clientAPI
 */
export default function Section211Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');

        const Section211 = FormSectionedTable.getSection('Section211Form');
        const decisionTakenCtrl = Section211.getControl('Section211DecisionTaken');
        const inspectedByCtrl = Section211.getControl('Section211InspectedBy');
        const inspectionMethodCtrl = Section211.getControl('Section211Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {

          

          const Section203TakePhoto =FormSectionedTable.getSection('Section212Form');
    Section203TakePhoto.setVisible('true');
            // Example: hide Next button if needed
            Section211.getControl('Section211StaticNextButton')?.setVisible(false);

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section211Create.action'
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
                Message: 'Unexpected error during Section 21.4 validation. Please try again.'
            }
        });
    }
}
