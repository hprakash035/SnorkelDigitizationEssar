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

        for (let i = 1; i <= 5; i++) {
            let missingFields = [];

            const powerWeight = section162.getControl(`Section162PowerWeight${i}`)?.getValue();
            const waterCasting = section162.getControl(`Section162WaterCasting${i}`)?.getValue();
            const fludity = section162.getControl(`Section162FludityOfCastable${i}`)?.getValue();
            const vibration = section162.getControl(`Section162AddingVibration${i}`)?.getValue();
            const remark = section162.getControl(`Section162Remark${i}`)?.getValue();

            if (!powerWeight) missingFields.push("Power Weight");
            if (!waterCasting) missingFields.push("Water Casting");
            if (!fludity || fludity.length === 0) missingFields.push("Fludity Of Castable");
            if (!vibration) missingFields.push("Adding Vibration");
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
        const nextButton = section162.getControl('Section162Test2NextButton');
        if (nextButton) {
            nextButton.setVisible(false);
        }

        const nextSection = form.getSection('Section162Test2Form');
        if (nextSection) {
            nextSection.setVisible(true);
        }

    } catch (e) {
        console.error('❌ Error in Section162TestFormValidation:', e);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: {
                Message: 'An unexpected error occurred during validation. Please try again.'
            }
        });
    }
}
