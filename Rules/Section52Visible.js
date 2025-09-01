
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section52Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section51Form').getControl('Section52NextButton').setVisible(false);
    const Section52Form =FormSectionedTable.getSection('Section52Form');
    
    
    
    
    
    Section52Form.setVisible('true');
    
    return;
}
