
/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section62Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section61Form').getControl('Section62NextButton').setVisible(false);
    const Section62Form =FormSectionedTable.getSection('Section62Form');
    
    
    
    
    
    Section62Form.setVisible('true');
    
    return;
}

