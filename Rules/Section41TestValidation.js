import Section42Visible from './Section42Visible';
export default async function CreateSection41Records(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const header = form.getSection('HeaderSection');
        const snorkelNo = header.getControl('SnorkelNo')?.getValue();

        if (!snorkelNo) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: 'Snorkel No. is mandatory.' }
            });
        }

        const section41 = form.getSection('Section41TestForm');
        const suffixes = ['A', 'B', 'C', 'D'];

        for (const letter of suffixes) {
            const position = section41.getControl(`Section41TestPositionGap${letter}`)?.getValue();
            const tolerance = section41.getControl(`Section41TestTolerance${letter}`)?.getValue();
            const method = section41.getControl(`Section41TestMethod${letter}`)?.getValue();
            const actualvalue = section41.getControl(`Section41TestActualGap${letter}`)?.getValue();

            if (!position || !tolerance || !method || !actualvalue) {
                 clientAPI.executeAction({
                    Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                    Properties: { Message: `Missing required field(s) in Test ${letter}.` }
                });
                
                
            }else{ await clientAPI.executeAction({
                Name: `/TRL_RH_SnorkelApp/Actions/Section41TestCreate${letter}.action`
            });
        }

           
        }

       

    } catch (e) {
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ErrorMessage.action',
            Properties: { Message: 'Unexpected error while saving Section 4.1. Please try again.' }
        });
    }
    Section42Visible(clientAPI);

}
