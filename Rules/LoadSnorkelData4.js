import { loadSection131Data } from './loadSection131Data';
import { loadSection132Data } from './loadSection132Data';
import { loadSection133Data } from './loadSection133Data';
import { loadSection134Data } from './loadSection134Data';
import { loadSection135Data } from './loadSection135Data';
import { loadSection136Data } from './loadSection136Data';

export default async function LoadSnorkelDataPage4(clientAPI) {
    try {
        clientAPI.showActivityIndicator("Loading data...");

        const pageProxy = clientAPI.getPageProxy();
        const binding = pageProxy.getBindingObject();
        const readLink = binding['@odata.readLink'];
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');

        // --- Header Setup ---
       

        // --- Read Data ---
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

        // --- Process Header Files ---
         if (clientAPI.binding.SNORKEL_NO) {
            FormSectionedTable.getSection('Section131Form').setVisible(true);
            
        }
       
        // --- Section Keys (Page 4 only) ---
        const orderedSectionKeys = [
          '13.1', '13.2', '13.3', '13.4', '13.5', '13.6'
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
                    await loader(
                        pageProxy,
                        item,
                        FormSectionedTable,
                        matchingAttachments,
                        flags,
                        testdata._array
                    );
                    console.log(`✅ Loader for ${sectionKey} executed successfully`);
                } catch (err) {
                    console.error(`❌ Error running loader for section ${sectionKey}:`, err);
                }
            }
        }

        clientAPI.dismissActivityIndicator();

    } catch (error) {
        clientAPI.dismissActivityIndicator();
        console.error('❌ Fatal error in LoadSnorkelDataPage4:', error);
    }
}

// --- Helpers ---
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

function getSectionLoader(sectionKey) {
    const sectionLoaders = {
        '13.1': loadSection131Data,
        '13.2': loadSection132Data,
        '13.3': loadSection133Data,
        '13.4': loadSection134Data,
        '13.5': loadSection135Data,
        '13.6': loadSection136Data
    };
    return sectionLoaders[sectionKey];
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
