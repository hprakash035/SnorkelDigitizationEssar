export default async function Section111TestFormValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section111 = form.getSection('Section111TestForm');

        const actionNames = [
            '/TRL_RH_SnorkelApp/Actions/Section111TestCreate1.action',
            '/TRL_RH_SnorkelApp/Actions/Section111TestCreate2.action',
            '/TRL_RH_SnorkelApp/Actions/Section111TestCreate3.action',
            '/TRL_RH_SnorkelApp/Actions/Section111TestCreate4.action'
        ];

        for (let i = 1; i <= 4; i++) {
            let missingFields = [];

            const testspecification = section111.getControl(`Section111TestSpecification${i}`)?.getValue();
            const method = section111.getControl(`Section111TestMethod${i}`)?.getValue();
            const actual_value = section111.getControl(`Section111TestActualValue${i}`)?.getValue();
           

            if (!testspecification) missingFields.push("Power Weight");
            if (!method) missingFields.push("Water Casting");
         
            if (!actual_value) missingFields.push("Adding actual value");
            // Optional: if remark is mandatory, uncomment below
            // if (!remark) missingFields.push("Remark");

            if (missingFields.length > 0) {
                return clientAPI.executeAction({
                    Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                    Properties: {
                        Message: `Please enter ${missingFields.join(', ')} for Test ${i}.`
                    }
                });
            }

            // Proceed with save if all fields are valid
            await clientAPI.executeAction({ Name: actionNames[i - 1] });
        }

        // All 5 test validations passed
        const nextButton = section111.getControl('Section112NextButton');
        if (nextButton) {
            nextButton.setVisible(false);
        }

        const nextSection = form.getSection('Section112Form');
        if (nextSection) {
            nextSection.setVisible(true);
        }

    } catch (e) {
        console.error('❌ Error in Section111TestFormValidation:', e);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: {
                Message: 'An unexpected error occurred during validation. Please try again.'
            }
        });
    }
}
