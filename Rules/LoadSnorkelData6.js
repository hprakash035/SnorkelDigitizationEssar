import { loadSection171Data } from './loadSection171Data';
import { loadSection181Data } from './loadSection181Data';
import { loadSection182Data } from './loadSection182Data';
import { loadSection183Data } from './loadSection183Data';
import { loadSection184Data } from './loadSection184Data';
import { loadSection191Data } from './loadSection191Data';
import { loadSection192Data } from './loadSection192Data';
import { loadSection193Data } from './loadSection193Data';
import { loadSection194Data } from './loadSection194Data';
import { loadSection195Data } from './loadSection195Data';

export default async function LoadSnorkelDataPage5(clientAPI) {
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
            FormSectionedTable.getSection('Section171Form').setVisible(true);
            
        }
       
        // --- Section Keys (Page 4 only) ---
        const orderedSectionKeys = [
          '17.1', '18.1', '18.2', '18.3', '18.4', '19.1', '19.2', '19.3', '19.4', '19.5'
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
          '17.1': loadSection171Data,
        '18.1': loadSection181Data,
        '18.2': loadSection182Data,
        '18.3': loadSection183Data,
        '18.4': loadSection184Data,
        '19.1': loadSection191Data,
        '19.2': loadSection192Data,
        '19.3': loadSection193Data,
        '19.4': loadSection194Data,
        '19.5': loadSection195Data,
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
