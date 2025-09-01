/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section3Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section2Form').getControl('Section2NextButton').setVisible(false);
    const Section31Form =FormSectionedTable.getSection('Section31Form');
    
    Section31Form.setVisible('true');
    return;
}
