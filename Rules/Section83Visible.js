/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section82Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section82Form').getControl('Section83NextButton').setVisible(false);
    const Section83Form =FormSectionedTable.getSection('Section83Form');
    Section83Form.setVisible('true');
    
    return;
}
