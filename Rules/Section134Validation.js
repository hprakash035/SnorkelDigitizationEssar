/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section134Validation(clientAPI) {
    try {
        console.log("✅ Section134Validation started");

        const pageProxy = clientAPI.getPageProxy();
        console.log("📌 pageProxy retrieved:", pageProxy);

        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        console.log("📌 FormSectionedTable retrieved:", FormSectionedTable);

        const Section134 = FormSectionedTable.getSection('Section134Form');
        console.log("📌 Section134Form retrieved:", Section134);

        const decisionTakenCtrl = Section134.getControl('Section134DecisionTaken');
        const inspectedByCtrl = Section134.getControl('Section134InspectedBy');
        const inspectionMethodCtrl = Section134.getControl('Section134Method');

        console.log("📌 Controls retrieved:", {
            decisionTakenCtrl,
            inspectedByCtrl,
            inspectionMethodCtrl
        });

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        console.log("📌 Control values:", {
            decisionTaken,
            inspectedBy,
            inspectionMethod
        });

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {
            console.log("✅ Validation passed. Preparing to show Section135 and hide Next button.");

            const Section134UserInputImage = FormSectionedTable.getSection('Section135Form');
            console.log("📌 Section135Form retrieved:", Section134UserInputImage);

            Section134UserInputImage.setVisible(true);
            console.log("📌 Section135Form set visible: true");

            FormSectionedTable.getSection('Section134Form')
                .getControl('Section135NextButton')
                .setVisible(false);
            console.log("📌 Section135NextButton set visible: false");

            console.log("➡️ Executing Section134Create.action");
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section134Create.action'
            });
        } else {
            console.warn("⚠️ Validation failed. Missing required values.");
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action'
            });
        }

    } catch (error) {
        console.error("❌ Error in Section134Validation:", error);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ErrorMessage.action',
            Properties: {
                Message: 'Unexpected error during Section 13.4 validation. Please try again.'
            }
        });
    }
}
