/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section42Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section41TestForm').getControl('Section42NextButton').setVisible(false);
    const Section42Form =FormSectionedTable.getSection('Section42Form');
    
    
    
    
    
    Section42Form.setVisible('true');
    
    return;
}
