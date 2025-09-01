/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section111Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section103Form').getControl('Section111NextButton').setVisible(false);
    const Section111Form =FormSectionedTable.getSection('Section111Form');
    Section111Form.setVisible('true');
    
    return;
}
