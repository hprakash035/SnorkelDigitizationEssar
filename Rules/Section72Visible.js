/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section72Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section71Form').getControl('Section72NextButton').setVisible(false);
    const Section72Form =FormSectionedTable.getSection('Section72Form');
    Section72Form.setVisible('true');
    
    return;
}

