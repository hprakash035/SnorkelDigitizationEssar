export default async function Section102TestFormValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section102 = form.getSection('Section102TestForm');

        const actionNames = [
            '/TRL_RH_SnorkelApp/Actions/Section102TestCreate1.action',
            '/TRL_RH_SnorkelApp/Actions/Section102TestCreate2.action',
            '/TRL_RH_SnorkelApp/Actions/Section102TestCreate3.action',
            '/TRL_RH_SnorkelApp/Actions/Section102TestCreate4.action',
            '/TRL_RH_SnorkelApp/Actions/Section102TestCreate5.action'
        ];

        for (let i = 1; i <= 5; i++) {
            let missingFields = [];

            const powerWeight = section102.getControl(`Section102PowerWeight${i}`)?.getValue();
            const waterCasting = section102.getControl(`Section102WaterCasting${i}`)?.getValue();
            const fludity = section102.getControl(`Section102FludityOfCastable${i}`)?.getValue();
            const vibration = section102.getControl(`Section102AddingVibration${i}`)?.getValue();
            const remark = section102.getControl(`Section102Remark${i}`)?.getValue();

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
        const nextButton = section102.getControl('Section102Test2NextButton');
        if (nextButton) {
            nextButton.setVisible(false);
        }
    const Section102TestFormName2 = form.getSection('Section102TestFormName2');
                if (Section102TestFormName2) {
                    await Section102TestFormName2.setVisible(true);
                }
        const nextSection = form.getSection('Section102Test2Form');
        if (nextSection) {
            nextSection.setVisible(true);
        }
         const Section102StaticImage = form.getSection('Section102StaticImage');
                if (Section102StaticImage) {
                    await Section102StaticImage.setVisible(true);
                }
        const nextSection2 = form.getSection('Section102UserInputImage');
        if (nextSection) {
            nextSection2.setVisible(true);
        }

        


    } catch (e) {
        console.error('❌ Error in Section102TestFormValidation:', e);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
            Properties: {
                Message: 'An unexpected error occurred during validation. Please try again.'
            }
        });
    }
}
