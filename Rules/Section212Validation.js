/**
 * Section 212 Validation and make Section 205 controls visible
 * @param {IClientAPI} clientAPI
 */
export default function Section212Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');

        const Section212 = FormSectionedTable.getSection('Section212Form');
        const decisionTakenCtrl = Section212.getControl('Section212DecisionTaken');
        const inspectedByCtrl = Section212.getControl('Section212InspectedBy');
        const inspectionMethodCtrl = Section212.getControl('Section212Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {

          
          const Section203TakePhoto =FormSectionedTable.getSection('Section213Form');
    Section203TakePhoto.setVisible('true');

            // Example: hide Next button if needed
            Section212.getControl('Section212StaticNextButton')?.setVisible(false);

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section212Create.action'
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
