export default async function Section132TestFormValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section132 = form.getSection('Section132TestForm');

        const actionNames = [
            '/TRL_RH_SnorkelApp/Actions/Section132TestCreate1.action',
            '/TRL_RH_SnorkelApp/Actions/Section132TestCreate2.action',
            '/TRL_RH_SnorkelApp/Actions/Section132TestCreate3.action',
            '/TRL_RH_SnorkelApp/Actions/Section132TestCreate4.action'
        ];

        for (let i = 1; i <= 4; i++) {
            let missingFields = [];

            const position = section132.getControl(`Section132Position${i}`)?.getValue();
            const tolerance = section132.getControl(`Section132Tolerence${i}`)?.getValue();
            const method = section132.getControl(`Section132Method${i}`)?.getValue();
            const actual = section132.getControl(`Section132ActualValue${i}`)?.getValue();
           

            if (!position) missingFields.push("position");
            if (!tolerance) missingFields.push("tolerance");
         
            if (!actual) missingFields.push(" actual value");
            // Optional: if remark is mandatory, uncomment below
             if (!method) missingFields.push("method");

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
        const nextButton = section132.getControl('Section133NextButton');
        if (nextButton) {
            nextButton.setVisible(false);
        }

        const nextSection = form.getSection('Section133Form');
        if (nextSection) {
            nextSection.setVisible(true);
        }

    } catch (e) {
        console.error('❌ Error in Section132TestFormValidation:', e);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: {
                Message: 'An unexpected error occurred during validation. Please try again.'
            }
        });
    }
}
