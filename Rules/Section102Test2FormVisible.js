/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section102Test2FormVisible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
     const Section102TestFormName = FormSectionedTable.getSection('Section102TestFormName2');
                if (Section102TestFormName) {
                     Section102TestFormName.setVisible(true);
                }
    FormSectionedTable.getSection('Section102TestForm').getControl('Section102Test2NextButton').setVisible(false);
    const Section102Test2Form =FormSectionedTable.getSection('Section102Test2Form');
    Section102Test2Form.setVisible('true');
    
    return;
}
