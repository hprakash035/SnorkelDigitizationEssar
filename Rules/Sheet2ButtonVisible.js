/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Sheet2ButtonVisible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section63TestForm').getControl('SectionSheet2NextButton').setVisible(false);
   // FormSectionedTable.getSection('Sheet2Button').getControl('sheet1button').setVisible("true");

}
