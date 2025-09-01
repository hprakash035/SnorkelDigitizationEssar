/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section102Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section102Form').getControl('Section102TestNextButton').setVisible(false);
    const Section111Form =FormSectionedTable.getSection('Section103Form');
    Section111Form.setVisible('true');
    
    return;
}
