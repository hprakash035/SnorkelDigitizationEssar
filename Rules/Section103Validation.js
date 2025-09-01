
export default function Section103Validation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        //  const headerSection = FormSectionedTable.getSection('HeaderSection');
        // const snorkelNoControl = headerSection.getControl('SnorkelNo');
        const snorkelNo = pageProxy.getClientData().snorkelNo;


        const Section103 = FormSectionedTable.getSection('Section103Form');
        const decisionTakenCtrl = Section103.getControl('Section103DecisionTaken');
        const inspectedByCtrl = Section103.getControl('Section103InspectedBy');
        const inspectionMethodCtrl = Section103.getControl('Section103InspectionMethod');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken != "") {
           
            // FormSectionedTable.getSection('Section103Form').getControl('Section111NextButton').setVisible(false);
           
            clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section103Create.action'
            });
            
         return  clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Nav2Sheet3.action'
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
                Message: 'Unexpected error during Section 10.3 validation. Please try again.'
            }
        });
    }
}

