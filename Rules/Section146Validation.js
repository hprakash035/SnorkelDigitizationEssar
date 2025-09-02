/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section146Validation(clientAPI) {
    try {
        console.log('Section146Validation: Function started');

        const pageProxy = clientAPI.getPageProxy();
        console.log('Section146Validation: pageProxy obtained');

        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        console.log('Section146Validation: FormSectionedTable obtained');

        const Section146 = FormSectionedTable.getSection('Section146Form');
        console.log('Section146Validation: Section146Form section obtained');

        const decisionTakenCtrl = Section146.getControl('Section146DecisionTaken');
        const inspectedByCtrl = Section146.getControl('Section146InspectedBy');
        const inspectionMethodCtrl = Section146.getControl('Section146Method');
        console.log('Section146Validation: Controls obtained');

        const decisionTaken = decisionTakenCtrl?.getValue();
        const inspectedBy = inspectedByCtrl?.getValue();
        const inspectionMethod = inspectionMethodCtrl?.getValue();

        console.log('Section146Validation: Values -', {
            decisionTaken,
            inspectedBy,
            inspectionMethod
        });

        if (decisionTaken && inspectedBy && inspectionMethod && decisionTaken !== "") {
            console.log('Section146Validation: All fields are valid');

            const Section146UserInputImage1 = FormSectionedTable.getSection('Section151Form');
            Section146UserInputImage1.setVisible('true');
            console.log('Section146Validation: Section151Form made visible');

            FormSectionedTable.getSection('Section146Form').getControl('Section151NextButton').setVisible(false);
            console.log('Section146Validation: Section151NextButton hidden');

            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/Section146Create.action'
            });
        } else {
            console.log('Section146Validation: Validation failed - missing required fields');
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action'
            });
        }

    } catch (error) {
        console.error('Section146Validation: Error caught -', error);

        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ErrorMessage.action',
            Properties: {
                Message: 'Unexpected error during Section 14.6 validation. Please try again.'
            }
        });
    }
}
