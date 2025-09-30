import { loadSection201Data } from './loadSection201Data';
import { loadSection202Data } from './loadSection202Data';
import { loadSection203Data } from './loadSection203Data';
import { loadSection204Data } from './loadSection204Data';
import { loadSection211Data } from './loadSection211Data';
import { loadSection212Data } from './loadSection212Data';
import { loadSection213Data } from './loadSection213Data';
import { loadSection214Data } from './loadSection214Data';

export default async function LoadSnorkelDataPage7(clientAPI) {
    try {
        clientAPI.showActivityIndicator("Loading data...");

        const pageProxy = clientAPI.getPageProxy();
        const binding = pageProxy.getBindingObject();
        const readLink = binding['@odata.readLink'];
        // const service = '/TRL_Snorkel_Digitization/Services/TRL_Snorkel_CAP_SRV.service';
        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';
        const FormSectionedTable = pageProxy.getControl('FormSectionedTable');
        const headerSection = FormSectionedTable.getSection('HeaderSection');

        // --- Read Data ---
        const [itemsResult, headerFiles, attachmentsResult, testdata] = await Promise.all([
            clientAPI.read(service, `${readLink}/qc_ITEMS`, [], ''),
            clientAPI.read(service, `${readLink}/headerFiles`, [], ''),
            clientAPI.read(service, `${readLink}/qc_ATTACHMENTS`, [], ''),
            clientAPI.read(service, `${readLink}/qc_TESTS`, [], ''),
        ]);

        const items = itemsResult._array;
        const attachments = attachmentsResult._array;
        const testArray = testdata._array;

        const attachmentGroups = groupAttachmentsBySectionKey(attachments);
        const flags = { next: false };

        FormSectionedTable.getSection('Section201Form').setVisible(true);

        const orderedSectionKeys =['20.1', '20.2', '20.3', '20.4','21.1', '21.2', '21.3', '21.4'];

        for (const sectionKey of orderedSectionKeys) {
            const loader = getSectionLoader(sectionKey);
            if (!loader) {
                // console.warn(`⚠️ No loader found for section ${sectionKey}`);
                continue;
            }

            const item = findItemBySectionKey(items, sectionKey);
            if (!item || !item.INSPECTED_BY) {
                // console.log(`⛔ Skipping section ${sectionKey}: No item or INSPECTED_BY`);
                continue;
            }

            const attachmentsForSection = attachmentGroups[sectionKey] || [];
            // console.log(`📎 Attachments for ${sectionKey}:`, attachmentsForSection.length);

            try {
                await loader(
                    pageProxy,
                    item,
                    FormSectionedTable,
                    attachmentsForSection,
                    flags,
                    testArray
                );
                // console.log(`✅ Loader for ${sectionKey} executed successfully`);
            } catch (err) {
                // console.error(`❌ Error running loader for section ${sectionKey}:`, err);
            }
        }

        clientAPI.dismissActivityIndicator();

    } catch (error) {
        clientAPI.dismissActivityIndicator();
        // console.error('❌ Fatal error in LoadSnorkelDataPage6:', error);
    }
}

// --- Group attachments by section key (e.g., "18.4") ---
function groupAttachmentsBySectionKey(attachments = []) {
    const grouped = {};
    for (const attachment of attachments) {
        const rawQuestion = attachment.QUESTION || attachment.question || '';
        const normalized = normalize(rawQuestion);
        const sectionKey = normalized.split(' ')[0]; // e.g., "18.4" from "18.4 Some description"
        if (!grouped[sectionKey]) grouped[sectionKey] = [];
        grouped[sectionKey].push(attachment);
    }
    return grouped;
}

function normalize(str) {
    return str?.replace(/\s+/g, ' ')?.trim();
}

function findItemBySectionKey(items, sectionKey) {
    return items.find(it => {
        const rawQuestion = it.QUESTION || '';
        const normalized = normalize(rawQuestion);
        const itemKey = normalized.split(' ')[0];
        return itemKey === sectionKey;
    });
}

function getSectionLoader(sectionKey) {
     const sectionLoaders = {
        '20.1': loadSection201Data,
        '20.2': loadSection202Data,
        '20.3': loadSection203Data,
        '20.4': loadSection204Data,
      
        '21.1': loadSection211Data,
        '21.2': loadSection212Data,
        '21.3': loadSection213Data,
        '21.4': loadSection214Data
    };
    return sectionLoaders[sectionKey];
}

// Optional (unused in current logic)
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