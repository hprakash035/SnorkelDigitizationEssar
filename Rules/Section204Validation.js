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

            // ✅ Make Section 205 parts visible
            const sectionIDs = [
                'Section205AStaticImageInlet',
                'Section205BStaticImageInlet',
                'Section205MeasureName',
                'Section205QCMeasurements',
                'Section205Casting',
                'Section205CastingForm',
                'Section205CastingRemarkStatusFormA',
                'Section205CastingRemarkStatusFormB',
                'Section205Check',
                'Section205CheckForm',
                'Section205CheckRemark',
                'Section205CheckRemarkBSnorkelLot',
                'Section205UserInputImageA',
                'Section205UserInputImageB'
            ];

            sectionIDs.forEach(id => {
                const section = FormSectionedTable.getSection(id);
                if (section) {
                    section.setVisible(true);
                }
            });

            // Example: hide Next button if needed
            Section204.getControl('Section205NextButton')?.setVisible(false);

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
