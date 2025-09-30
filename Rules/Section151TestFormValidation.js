export default async function Section151TestFormValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const form = pageProxy.getControl('FormSectionedTable');
        const section151 = form.getSection('Section151TestForm');

        const snorkelNo = pageProxy.binding?.SNORKEL_NO;
        const customerName = pageProxy.binding?.CUSTOMER_NAME;

        // Removed validation for Test 1
        await clientAPI.executeAction({ Name: '/TRL_RH_SnorkelApp/Actions/Section151TestCreateA.action' });

        // Removed validation for Test 2
        await clientAPI.executeAction({ Name: '/TRL_RH_SnorkelApp/Actions/Section151TestCreateB.action' });

        // Removed validation for Test 3
        await clientAPI.executeAction({ Name: '/TRL_RH_SnorkelApp/Actions/Section151TestCreateC.action' });

        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');

        FormSectionedTable.getSection('Section151TestForm').getControl('Section161NextButton').setVisible(false);
        const Section101Form = FormSectionedTable.getSection('Section161Form');
        Section101Form.setVisible('true');

    } catch (e) {
        console.error('❌ Error in Section151TestFormValidation:', e);
    }
}
