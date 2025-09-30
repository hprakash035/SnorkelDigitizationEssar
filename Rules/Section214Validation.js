/**
 * Section 214 Validation and make Section 205 controls visible
 * @param {IClientAPI} clientAPI
 */
export default function Section214Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');

        const Section214 = FormSectionedTable.getSection('Section214Form');
        const decisionTakenCtrl = Section214.getControl('Section214DecisionTaken');
        const inspectedByCtrl = Section214.getControl('Section214InspectedBy');
        const inspectionMethodCtrl = Section214.getControl('Section214Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {

          
          const Section203TakePhoto =FormSectionedTable.getSection('Section214Form');
    Section203TakePhoto.setVisible('true');

            // Example: hide Next button if needed
            Section214.getControl('SectionInletFinalButton')?.setVisible(false);

         clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section214Create.action'
            });
             return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Nav2FinalInspection.action',
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
