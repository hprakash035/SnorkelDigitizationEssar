/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section32Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section31Form').getControl('Section31NextButton').setVisible(false);
    const Section32Form =FormSectionedTable.getSection('Section32Form');
    
    Section32Form.setVisible('true');
    return;
}
