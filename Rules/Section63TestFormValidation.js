

export default async function Section63TestFormValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section63 = form.getSection('Section63TestForm');

        // Get values for steel mesh
        const meshPosition = section63.getControl('Section63TestPositionMesh')?.getValue();
        const meshTolerance = section63.getControl('Section63TestToleranceMesh')?.getValue();
        const meshActual = section63.getControl('Section63TestActualMesh')?.getValue();

        // Get values for Y studs
        const studsPosition = section63.getControl('Section63TestPositionStuds')?.getValue();
        const studsTolerance = section63.getControl('Section63TestToleranceStuds')?.getValue();
        const studsActual = section63.getControl('Section63TestActualStuds')?.getValue();

        // Validation
        if (!meshPosition || !meshTolerance || !meshActual) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: 'All Steel Mesh fields are required (Position, Tolerance, Actual).' }
            });
        }

        if (!studsPosition || !studsTolerance || !studsActual) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: 'All Y Studs fields are required (Position, Tolerance, Actual).' }
            });
        }

        // Call create actions (if needed)
        await clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/Section63TestCreateMesh.action'
        });

        await clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/Section63TestCreateStuds.action'
        });

     

    } catch (e) {
       console.log("error",e)
    }
}
