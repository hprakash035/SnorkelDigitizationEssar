/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section82Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section81Form').getControl('Section82NextButton').setVisible(false);
    const Section82Form =FormSectionedTable.getSection('Section82Form');
    Section82Form.setVisible('true');
    
    return;
}
