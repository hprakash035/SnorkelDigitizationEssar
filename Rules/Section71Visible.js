/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */

export default function Section71Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section63TestForm').getControl('Section63TestNextButton').setVisible(false);
      FormSectionedTable.getSection('Section63Form').getControl('Section71NextButton').setVisible(false);
    const Section71Form =FormSectionedTable.getSection('Section71Form');
    Section71Form.setVisible(true);
    
    return;
}

