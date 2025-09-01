/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section41TestFormVisible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
   // FormSectionedTable.getSection('Section31Form').getControl('Section31NextButton').setVisible(false);
    const Section41TestFormHeader =FormSectionedTable.getSection('Section41TestName');
    Section41TestFormHeader.setVisible('true');
    const Section41TestForm =FormSectionedTable.getSection('Section41TestForm');
    
    Section41TestForm.setVisible('true');
   
    return;
    
    
}
