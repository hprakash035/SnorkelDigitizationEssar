/**
 * Read snorkel details including attachments, items, tests, and header files.
 * @param {IClientAPI} clientAPI
 */
export default async function Read_SnorkelDetails(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    
    const binding = clientAPI.getPageProxy().getBindingObject();
    
    if (!binding || !binding.SNORKEL_NO) {
        console.log('❌ SNORKEL_NO is missing from binding context.');
        return;
    }

    const snorkelNo = binding.SNORKEL_NO;
    const serviceName = "/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service";
    const entitySet = "QC_HEADER";
    const expandEntities = "$expand=qc_ATTACHMENTS,qc_ITEMS,qc_TESTS,headerFiles";
    const filter = `$filter=SNORKEL_NO eq '${snorkelNo}'`;
    const query = `${expandEntities}&${filter}`;

    try {
        const result = await clientAPI.read(serviceName, entitySet, [], query);
        if (result && result.length > 0) {
            const headerData = result.getItem(0);
           // pageProxy.setBindingObject(headerData);
            // Store in ClientData (if you want to access it across this page)
            clientAPI.getPageProxy().getClientData().SnorkelHeaderData = headerData;
            console.log('✅ SnorkelHeaderData.qc_ITEMS:', headerData.qc_ITEMS);
            console.log('✅ Snorkel data loaded successfully:', headerData);
        } else {
            console.log("⚠️ No record found for snorkel no:", snorkelNo);
        }
    } catch (error) {
        console.log("❌ Error reading snorkel details:", error);
    }
}
