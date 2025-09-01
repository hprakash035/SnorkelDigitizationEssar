export default async function Section162Test2FormValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section162 = form.getSection('Section162Test2Form');

        const points = ['A', 'B', 'C', 'D'];
        const missingPoints = [];

        for (const point of points) {
            const position = section162.getControl(`Section162TestPositionGap${point}`)?.getValue();
            const tolerance = section162.getControl(`Section162TestTolerance${point}`)?.getValue();
            const method = section162.getControl(`Section162TestMethod${point}`)?.getValue();
            const actual = section162.getControl(`Section162TestActualGap${point}`)?.getValue();

            if (!position || !tolerance || !method || !actual) {
                missingPoints.push(point);
            }
        }

        if (missingPoints.length > 0) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: {
                    Message: `Please fill in all required fields (Position, Tolerance, Method, Actual Gap) for point(s): ${missingPoints.join(', ')}.`
                }
            });
        }

        // If all points are filled, execute action(s) as needed
        await clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/Section162Test2CreateA.action'
        });
        await clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/Section162Test2CreateB.action'
        });
        await clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/Section162Test2CreateC.action'
        });
        await clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/Section162Test2CreateD.action'
        });


     
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section162Test2Form').getControl('Section162StaticNextButton').setVisible(false);
    const Section162Form =FormSectionedTable.getSection('Section162StaticImage');
    const Section162Form1 =FormSectionedTable.getSection('Section162UserInputImage');
  
    Section162Form.setVisible('true');
    Section162Form1.setVisible('true');

    } catch (e) {
        console.error("❌ Error in Section162Test2FormValidation:", e);
    }
}
