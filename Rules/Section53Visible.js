
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section53Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section52Form').getControl('Section53NextButton').setVisible(false);
    const Section53Form =FormSectionedTable.getSection('Section53Form');
    
    
    
    
    
    Section53Form.setVisible('true');
    
    return;
}
