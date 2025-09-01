import { loadSection71Data } from './loadSection71Data';
import { loadSection72Data } from './loadSection72Data';
import { loadSection81Data } from './loadSection81Data';
import { loadSection82Data } from './loadSection82Data';
import { loadSection83Data } from './loadSection83Data';
import { loadSection84Data } from './loadSection84Data';
import { loadSection91Data } from './loadSection91Data';
import { loadSection101Data } from './loadSection101Data';
import { loadSection102Data } from './loadSection102Data';
import { loadSection103Data } from './loadSection103Data';

export default async function LoadSnorkelDataPage2(clientAPI) {
    try {
        clientAPI.showActivityIndicator("Loading data...");

        const pageProxy = clientAPI.getPageProxy();
        const binding = pageProxy.getBindingObject();
        const readLink = binding['@odata.readLink'];
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');

        // Header setup
        // headerSection.getControl('SnorkelNo').setEditable(false);
        if (clientAPI.binding.SNORKEL_NO) {
            FormSectionedTable.getSection('Section71Form').setVisible(true);
            
        }

        // Read all backend data in parallel
        const [itemsResult, headerFiles, attachmentsResult, testdata] = await Promise.all([
            clientAPI.read(service, `${readLink}/qc_ITEMS`, [], ''),
            clientAPI.read(service, `${readLink}/headerFiles`, [], ''),
            clientAPI.read(service, `${readLink}/qc_ATTACHMENTS`, [], ''),
            clientAPI.read(service, `${readLink}/qc_TESTS`, [], ''),
        ]);

        const items = itemsResult._array;
        const attachments = attachmentsResult._array;
        const attachmentGroups = groupAttachmentsByQuestion(attachments);
        const flags = { next: false };

       

        // Sections for Page 2
        const orderedSectionKeys = [
            '7.1', '7.2',
            '8.1', '8.2', '8.3', '8.4',
            '9.1',
            '10.1', '10.2', '10.3'
        ];

        for (const sectionKey of orderedSectionKeys) {
            const loader = getSectionLoader(sectionKey);
            if (!loader) continue;

            const item = items.find(it => {
                const sectionKeyFromItem = it.QUESTION?.trimStart().split(' ')[0];
                return sectionKeyFromItem === sectionKey;
            });

            if (item && item.DATE_INSPECTED && item.INSPECTED_BY) {
                const question = item.QUESTION?.trim();
                const normalize = str => str?.replace(/\s+/g, ' ')?.trim();
                const matchingAttachments = attachmentGroups[normalize(question)] || [];
                try {
                    await loader(pageProxy, item, FormSectionedTable, matchingAttachments, flags, testdata._array);
                    // console.log(`✅ Loader for ${sectionKey} executed successfully`);
                } catch (err) {
                    // console.error(`❌ Error running loader for section ${sectionKey}:`, err);
                }
            }
        }

        clientAPI.dismissActivityIndicator();
    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error('❌ Fatal error in LoadSnorkelDataPage2:', error);
    }
}

// --- Helpers ---
function getSectionLoader(sectionKey) {
    const sectionLoaders = {
        '7.1': loadSection71Data,
        '7.2': loadSection72Data,
        '8.1': loadSection81Data,
        '8.2': loadSection82Data,
        '8.3': loadSection83Data,
        '8.4': loadSection84Data,
        '9.1': loadSection91Data,
        '10.1': loadSection101Data,
        '10.2': loadSection102Data,
        '10.3': loadSection103Data,
    };
    return sectionLoaders[sectionKey];
}

function groupAttachmentsByQuestion(attachments = []) {
    const grouped = {};
    for (const attachment of attachments) {
        const rawKey = attachment.QUESTION || attachment.question || '';
        const key = rawKey.replace(/\s+/g, ' ').trim();
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(attachment);
    }
    return grouped;
}

async function processFileData(headerFile) {
    const base64File = headerFile.file;
    const fileName = headerFile.name;
    let cleanBase64 = base64File;
    if (base64File.startsWith('data:')) {
        cleanBase64 = base64File.split(',')[1];
    }
    const arrayBuffer = convertBase64ToArrayBuffer(cleanBase64);
    return {
        urlString: fileName,
        content: arrayBuffer,
        contentType: 'application/pdf',
        size: arrayBuffer.byteLength
    };
}

function convertBase64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
