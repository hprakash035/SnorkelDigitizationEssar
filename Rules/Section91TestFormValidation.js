export default async function Section91TestFormValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section91 = form.getSection('Section91TestForm');

        const snorkelNo = pageProxy.binding?.SNORKEL_NO;
        const customerName = pageProxy.binding?.CUSTOMER_NAME;

     
        const water1 = section91.getControl('Section91TestWaterCasteing1')?.getValue();
        const ff1 = section91.getControl('Section91FF1')?.getValue();
        const tf1 = section91.getControl('Section91TF1')?.getValue();
        const settingTime1 = section91.getControl('Section91SettingTime1')?.getValue();

        if (!water1 || !ff1 || !tf1 || !settingTime1) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: 'All values must be entered for Test 1 (Water of casting, FF, TF, Setting time).' }
            });
        }

       

     
        await clientAPI.executeAction({ Name: '/TRL_RH_SnorkelApp/Actions/Section91TestCreateA.action' });

        // Test 2
        const water2 = section91.getControl('Section91TestWaterCasteing2')?.getValue();
        const ff2 = section91.getControl('Section91FF2')?.getValue();
        const tf2 = section91.getControl('Section91TF2')?.getValue();
        const settingTime2 = section91.getControl('Section91SettingTime2')?.getValue();

        if (!water2 || !ff2 || !tf2 || !settingTime2) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: 'All values must be entered for Test 2 (Water of casting, FF, TF, Setting time).' }
            });
        }

 
       
        await clientAPI.executeAction({ Name: '/TRL_RH_SnorkelApp/Actions/Section91TestCreateB.action' });

        // Test 3
        const water3 = section91.getControl('Section91TestWaterCasteing3')?.getValue();
        const ff3 = section91.getControl('Section91FF3')?.getValue();
        const tf3 = section91.getControl('Section91TF3')?.getValue();
        const settingTime3 = section91.getControl('Section91SettingTime3')?.getValue();

        if (!water3 || !ff3 || !tf3 || !settingTime3) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: 'All values must be entered for Test 3 (Water of casting, FF, TF, Setting time).' }
            });
        }


       
        await clientAPI.executeAction({ Name: '/TRL_RH_SnorkelApp/Actions/Section91TestCreateC.action' });
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        FormSectionedTable.getSection('Section91TestForm').getControl('Section101NextButton').setVisible(false);
        const Section101Form =FormSectionedTable.getSection('Section101Form');
        Section101Form.setVisible(true);
        

    } catch (e) {
        console.error('❌ Error in Section91TestFormValidation:', e);
    }
}
