/**
 * Section 213 Validation and make Section 205 controls visible
 * @param {IClientAPI} clientAPI
 */
export default function Section213Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');

        const Section213 = FormSectionedTable.getSection('Section213Form');
        const decisionTakenCtrl = Section213.getControl('Section213DecisionTaken');
        const inspectedByCtrl = Section213.getControl('Section213InspectedBy');
        const inspectionMethodCtrl = Section213.getControl('Section213Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {

          
          const Section203TakePhoto =FormSectionedTable.getSection('Section214Form');
    Section203TakePhoto.setVisible('true');

            // Example: hide Next button if needed
            Section213.getControl('Section214NextButton')?.setVisible(false);

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section213Create.action'
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
