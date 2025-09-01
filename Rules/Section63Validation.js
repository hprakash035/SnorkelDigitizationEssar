export default function Section63Validation(clientAPI) {
    try {
        // console.log("Starting Section 6.3 validation...");

        const pageProxy = clientAPI.getPageProxy();
        // console.log("Retrieved pageProxy.");

        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');
        const snorkelNoControl = headerSection.getControl('SnorkelNo');
        const snorkelNo = snorkelNoControl.getValue();

        // console.log("SnorkelNo value:", snorkelNo);

        if (!snorkelNo) {
            // console.log("Validation failed: SnorkelNo is missing.");
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            });
        }

        const Section63 = FormSectionedTable.getSection('Section63Form');
        const decisionTakenCtrl = Section63.getControl('Section63DecisionTaken');
        const inspectedByCtrl = Section63.getControl('Section63InspectedBy');
        const inspectionMethodCtrl = Section63.getControl('Section63Method');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        // console.log("Decision Taken:", decisionTaken);
        // console.log("Inspected By:", inspectedBy);
        // console.log("Inspection Method:", inspectionMethod);

        // Check for missing required fields
        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {
            // console.log("Validation passed: All required fields are filled.");
             clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section63Create.action'
            });

             return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Nav2Sheet2.action',
            });

        } else {
            // console.log("Validation failed: Missing required fields in Section 6.3.");
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action'
            });
        }

    } catch (error) {
        // console.error("Error in Section 6.3 validation:", error);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ErrorMessage.action',
            Properties: {
                Message: 'Unexpected error during Section 6.3 validation. Please try again.'
            }
        });
    }
}
