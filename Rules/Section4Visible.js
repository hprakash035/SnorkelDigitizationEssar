/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section4Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section32Form').getControl('Section32NextButton').setVisible(false);
    const Section4Form =FormSectionedTable.getSection('Section41Form');
    
    Section4Form.setVisible('true');
    return;
}
