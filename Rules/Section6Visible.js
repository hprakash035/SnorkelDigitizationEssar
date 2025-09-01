/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section6Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section53Form').getControl('Section6NextButton').setVisible(false);
    const Section61Form =FormSectionedTable.getSection('Section61Form');
    
    
    
    
    
    Section61Form.setVisible('true');
    
    return;
}


