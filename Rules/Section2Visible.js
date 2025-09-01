/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section2Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section1Form').getControl('Section1NextButton').setVisible(false);
    const Section2Form =FormSectionedTable.getSection('Section2Form');
    
    Section2Form.setVisible(true);
    return;
}
