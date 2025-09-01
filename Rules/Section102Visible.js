/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section102Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section101Form').getControl('Section102NextButton').setVisible(false);
    const Section102Form =FormSectionedTable.getSection('Section102Form');
    Section102Form.setVisible('true');
    
    return;
}
