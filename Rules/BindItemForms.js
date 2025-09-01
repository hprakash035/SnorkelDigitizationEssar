/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function BindItemForms(clientAPI) {
    const page = context.getPageProxy();
    const clientData = page.getClientData();

    const items = clientData.qc_ITEMS && clientData.qc_ITEMS._array;
    if (!items || items.length === 0) {
        console.warn("⚠️ No qc_ITEMS found in clientData.");
        return;
    }

    // Bind Section1Form to qc_ITEMS[0]
    if (items.length > 0) {
        const section1 = page.getControl('Section1Form');
        section1.setBinding(items[0]);
        console.log("✅ Bound Section1Form to qc_ITEMS[0]");
    }

    // Bind Section2Form to qc_ITEMS[1]
    if (items.length > 1) {
        const section2 = page.getControl('Section2Form');
        section2.setBinding(items[1]);
        console.log("✅ Bound Section2Form to qc_ITEMS[1]");
    }
}
