/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section84Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section83Form').getControl('Section84NextButton').setVisible(false);
    const Section84Form =FormSectionedTable.getSection('Section84Form');
    Section84Form.setVisible('true');
    
    return;
}
