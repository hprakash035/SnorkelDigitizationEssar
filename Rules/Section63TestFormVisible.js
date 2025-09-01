

/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Section63TestFormVisible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
  
    FormSectionedTable.getSection('Section63TestName').setVisible('true');
   // FormSectionedTable.getSection('Section31Form').getControl('Section31NextButton').setVisible(false);
    const Section63TestForm =FormSectionedTable.getSection('Section63TestForm');
    
    Section63TestForm.setVisible('true');
    return;
    

}
