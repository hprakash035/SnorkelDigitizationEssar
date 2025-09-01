/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function SetBindingAndNavigate(context) {
    const pageProxy = context.getPageProxy();
    const sectionedTable = pageProxy.getControl('FormSectionedTable');
    // console.log('📋 FormSectionedTable:', sectionedTable);

    const snorkelNo = sectionedTable
        .getSection('HeaderSection')
        ?.getControl('SnorkelNo')
        ?.getValue();
        const company = sectionedTable
        .getSection('HeaderSection')
        ?.getControl('Company')
        ?.getValue();


    if (snorkelNo) {
        if (binding) {
            
    
            // Store in ClientData
            const clientData = clientAPI.getPageProxy().getClientData();
            clientData.snorkelNo = snorkelNo;
            clientData.customerName = company;
        }
        return context.executeAction('/TRL_RH_SnorkelApp/Actions/Nav2SnorkelInstallationsheet2.action');
    }
}
