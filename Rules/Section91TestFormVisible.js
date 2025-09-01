/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section92Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section91Form').getControl('Section92NextButton').setVisible(false);
    const Section91TestForm =FormSectionedTable.getSection('Section91TestForm');

    Section91TestForm.setVisible('true');
    FormSectionedTable.getSection('Section91TestNameForm').setVisible('true');
    
    return;
}
