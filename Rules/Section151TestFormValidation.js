export default async function Section151TestFormValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section151 = form.getSection('Section151TestForm');

        const snorkelNo = pageProxy.binding?.SNORKEL_NO;
        const customerName = pageProxy.binding?.CUSTOMER_NAME;

     
        const water1 = section151.getControl('Section151WaterCasting1')?.getValue();
        const ff1 = section151.getControl('Section151FF1')?.getValue();
        const tf1 = section151.getControl('Section151TF1')?.getValue();
        const settingTime1 = section151.getControl('Section151SettingTime1')?.getValue();

        if (!water1 || !ff1 || !tf1 || !settingTime1) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: 'All values must be entered for Test 1 (Water of casting, FF, TF, Setting time).' }
            });
        }

       

     
        await clientAPI.executeAction({ Name: '/TRL_RH_SnorkelApp/Actions/Section151TestCreateA.action' });

        // Test 2
        const water2 = section151.getControl('Section151WaterCasting2')?.getValue();
        const ff2 = section151.getControl('Section151FF2')?.getValue();
        const tf2 = section151.getControl('Section151TF2')?.getValue();
        const settingTime2 = section151.getControl('Section151SettingTime2')?.getValue();

        if (!water2 || !ff2 || !tf2 || !settingTime2) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: 'All values must be entered for Test 2 (Water of casting, FF, TF, Setting time).' }
            });
        }

 
       
        await clientAPI.executeAction({ Name: '/TRL_RH_SnorkelApp/Actions/Section151TestCreateB.action' });

        
        const water3 = section151.getControl('Section151WaterCasting3')?.getValue();
        const ff3 = section151.getControl('Section151FF3')?.getValue();
        const tf3 = section151.getControl('Section151TF3')?.getValue();
        const settingTime3 = section151.getControl('Section151SettingTime3')?.getValue();

        if (!water3 || !ff3 || !tf3 || !settingTime3) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: 'All values must be entered for Test 3 (Water of casting, FF, TF, Setting time).' }
            });
        }


       
        await clientAPI.executeAction({ Name: '/TRL_RH_SnorkelApp/Actions/Section151TestCreateC.action' });
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        
        FormSectionedTable.getSection('Section151TestForm').getControl('Section161NextButton').setVisible(false);
        const Section101Form =FormSectionedTable.getSection('Section161Form');
        Section101Form.setVisible('true');
        

    } catch (e) {
        console.error('❌ Error in Section151TestFormValidation:', e);
    }
}
