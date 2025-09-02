/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section133Validation(clientAPI) {
    try {
        console.log("Section133Validation started");

        const pageProxy = clientAPI.getPageProxy();
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        console.log("Retrieved FormSectionedTable:", FormSectionedTable);

        const Section133 = FormSectionedTable.getSection('Section133Form');
        console.log("Retrieved Section133Form section:", Section133);

        const decisionTakenCtrl = Section133.getControl('Section133DecisionTaken');
        const inspectedByCtrl = Section133.getControl('Section133InspectedBy');
        const inspectionMethodCtrl = Section133.getControl('Section133Method');

        console.log("Retrieved controls:",
            {
                decisionTakenCtrl,
                inspectedByCtrl,
                inspectionMethodCtrl
            }
        );

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        console.log("Control values:",
            {
                decisionTaken,
                inspectedBy,
                inspectionMethod
            }
        );

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {
            console.log("All required values are present. Proceeding to show Section134Form and execute action.");

            const Section133UserInputImage = FormSectionedTable.getSection('Section134Form');
            Section133UserInputImage.setVisible(true);
            FormSectionedTable.getSection('Section133Form').getControl('Section134NextButton').setVisible(false);

            console.log("Executing Section133Create.action");
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section133Create.action'
            });

        } else {
            console.warn("Validation failed. One or more required fields are missing or empty.");
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action'
            });
        }

    } catch (error) {
        console.error("Error caught in Section133Validation:", error);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ErrorMessage.action',
            Properties: {
                Message: 'Unexpected error during Section 13.3 validation. Please try again.'
            }
        });
    }
}
