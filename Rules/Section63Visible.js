
export default function Section63Visible(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
    FormSectionedTable.getSection('Section62Form').getControl('Section63NextButton').setVisible(false);
     FormSectionedTable.getSection('Section63TestForm').getControl('Section63TestNextButton').setVisible(false);
    const Section63Form =FormSectionedTable.getSection('Section63Form');
    Section63Form.setVisible('true');
    
    return;
}

