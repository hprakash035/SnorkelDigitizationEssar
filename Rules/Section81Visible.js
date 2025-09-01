/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section81Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section72Form').getControl('Section81NextButton').setVisible(false);
    const Section81Form =FormSectionedTable.getSection('Section81Form');
    Section81Form.setVisible('true');
    
    return;
}

