/**
 * Section 204 Validation and make Section 205 controls visible
 * @param {IClientAPI} clientAPI
 */
export default function Section204Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');

        const Section204 = FormSectionedTable.getSection('Section204Form');
        const decisionTakenCtrl = Section204.getControl('Section204DecisionTaken');
        const inspectedByCtrl = Section204.getControl('Section204InspectedBy');
        const inspectionMethodCtrl = Section204.getControl('Section204Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {

          const Section203TakePhoto =FormSectionedTable.getSection('Section211Form');
    Section203TakePhoto.setVisible('true');

            // Example: hide Next button if needed
            Section204.getControl('Section211NextButton')?.setVisible(false);

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section204Create.action'
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
                Message: 'Unexpected error during Section 20.4 validation. Please try again.'
            }
        });
    }
}
