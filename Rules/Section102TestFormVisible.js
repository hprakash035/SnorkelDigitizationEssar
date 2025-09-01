/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section102TestFormVisible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section102Form').getControl('Section102TestNextButton').setVisible(false);
     const Section102TestFormName =FormSectionedTable.getSection('Section102TestFormName');
    Section102TestFormName.setVisible('true');
    const Section102TestForm =FormSectionedTable.getSection('Section102TestForm');
    Section102TestForm.setVisible('true');
    
    return;
}
