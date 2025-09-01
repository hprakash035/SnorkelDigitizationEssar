/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section5Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section42Form').getControl('Section5NextButton').setVisible(false);
    const Section5Form =FormSectionedTable.getSection('Section51Form');  
    Section5Form.setVisible('true');
    return;
}
