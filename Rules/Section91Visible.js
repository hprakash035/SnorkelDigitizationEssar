/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section91Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section84Form').getControl('Section91NextButton').setVisible(false);
    const Section91Form =FormSectionedTable.getSection('Section91Form');
    Section91Form.setVisible('true');
    
    return;
}
