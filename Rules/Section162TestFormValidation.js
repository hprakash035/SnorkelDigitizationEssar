export default async function Section162TestFormValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section162 = form.getSection('Section162TestForm');

        const actionNames = [
            '/TRL_RH_SnorkelApp/Actions/Section162TestCreate1.action',
            '/TRL_RH_SnorkelApp/Actions/Section162TestCreate2.action',
            '/TRL_RH_SnorkelApp/Actions/Section162TestCreate3.action',
            '/TRL_RH_SnorkelApp/Actions/Section162TestCreate4.action',
            '/TRL_RH_SnorkelApp/Actions/Section162TestCreate5.action'
        ];

        // Directly run all save actions without validation
        for (let i = 0; i < 5; i++) {
            await clientAPI.executeAction({ Name: actionNames[i] });
        }

        // Hide next button and show next section
        const nextButton = section162.getControl('Section162Test2NextButton');
        if (nextButton) {
            nextButton.setVisible(false);
        }
         const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section162Test2Form').getControl('Section162StaticNextButton').setVisible(false);
    const Section162Form =FormSectionedTable.getSection('Section162StaticImage');
    const Section162Form1 =FormSectionedTable.getSection('Section162UserInputImage');
  
    Section162Form.setVisible('true');
    Section162Form1.setVisible('true');

      

    } catch (e) {
        console.error('❌ Error in Section162TestFormValidation:', e);
        // Optionally you can remove or keep this failure action
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: {
                Message: 'An unexpected error occurred during validation. Please try again.'
            }
        });
    }
}
