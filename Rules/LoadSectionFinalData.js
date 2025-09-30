import { loadFinalInspectionAImage } from './loadFinalInspectionAImage';
import { loadFinalInspectionBImage } from './loadFinalInspectionBImage';

/**
 * Load Section Final Data dynamically for a specific Snorkel
 * @param {IClientAPI} pageProxy
 */
export default async function LoadSectionFinalData(pageProxy) {
    try {
        const sectionedTable = pageProxy.getControl('FormSectionedTable');
        const binding = pageProxy.getBindingObject();
        const readLink = binding['@odata.readLink'];

        // console.log("🔹 Loading Section Final Data for:", readLink);

        const service = '/TRL_RH_SnorkelApp/Services/TRL_Snorkel_CAP_SRV.service';

        // --- Read related entities directly via navigation ---
        const [castingsResult, checksResult, measurementsResult, attachmentsResult] = await Promise.all([
            pageProxy.read(service, `${readLink}/qc_CASTING`, [], ''),
            pageProxy.read(service, `${readLink}/qc_CHECK`, [], ''),
            pageProxy.read(service, `${readLink}/qc_MEASUREMENTS`, [], ''),
            pageProxy.read(service, `${readLink}/qc_ATTACHMENTS`, [], '')
        ]);

        const castings = castingsResult._array || [];
        const checks = checksResult._array || [];
        const measurements = measurementsResult._array || [];
        const attachments = attachmentsResult._array || [];

        // console.log(`📦 Data fetched: Castings=${castings.length}, Checks=${checks.length}, Measurements=${measurements.length}, Attachments=${attachments.length}`);

        // ----------------------------
        // 3️⃣ Load Final Inspection Images
        // ----------------------------
        await loadFinalInspectionAImage(pageProxy, sectionedTable, attachments);
        await loadFinalInspectionBImage(pageProxy, sectionedTable, attachments);
        if (binding && binding.type && binding.type.toLowerCase() === 'outlet') {
    const castingForm = sectionedTable.getSection('SectionFinalCastingForm');
    if (castingForm) {
        // Hide Flow_A to Flow_L
        const flowLetters = ['A','B','C','D','E','F','G','H','I','J','K','L'];
        for (let letter of flowLetters) {
            const control = castingForm.getControl(`Flow_${letter}`);
            if (control) {
                await control.setVisible(false);
            }
        }

        // Hide 'Land' control if it exists
        const landControl = castingForm.getControl('Land');
        if (landControl) {
            await landControl.setVisible(false);
        }
    }

    const checkForm = sectionedTable.getSection('SectionFinalCheckForm');
    if (checkForm) {
        const weldingControl = checkForm.getControl('SectionFinalCheckaragon');
        if (weldingControl) {
            await weldingControl.setVisible(false);
        }
    }
}


        // ----------------------------
        // 4️⃣ Load QC Measurements Groups A–F
        // ----------------------------
        const sectionFinal = sectionedTable.getSection('SectionFinalQCMeasurements');
        const groups = ['A','B','C','D','E','F'];
        // console.log("🔹 Loading QC Measurements groups...");

        for (let g of groups) {
            const groupMeasurement = measurements.find(m => m.sign === g);
            if (!groupMeasurement) {
                // console.warn(`⚠️ No measurement data found for group ${g}`);
                continue;
            }

            for (let i = 1; i <= 5; i++) {
                const value = groupMeasurement?.[`mp${i}`] || '';
                const control = sectionFinal.getControl(`MeasurePoint_${g}${i}`);
                if (control) {
                    // console.log(`📌 Setting MeasurePoint_${g}${i} = ${value}`);
                    await control.setValue(value);
                }
            }

            const checkVal = groupMeasurement?.checkStatus || '';
            const checkControl = sectionFinal.getControl(`Check_${g}`);
            if (checkControl) {
                // console.log(`📌 Setting Check_${g} = ${checkVal}`);
                await checkControl.setValue(checkVal);
            }
        }

        // ----------------------------
        // 5️⃣ Load Casting Form & Remarks (Complete with all missing mappings)
        // ----------------------------
        const castingForm = sectionedTable.getSection('SectionFinalCastingForm');
        const castingData = castings[0] || {};
        // console.log("🔹 Loading Casting Form...");

        // Updated Casting fields mapping including missing ones and aligning with validation
        const castingFields = [
            'Flow_A', 'Flow_B', 'Flow_C', 'Flow_D', 'Flow_E', 'Flow_F',
            'Flow_G', 'Flow_H', 'Flow_I', 'Flow_J', 'Flow_K', 'Flow_L',
            'BrickBrand', 'CastableBrand', 'AddedWater', 'MixingTime',
            'BrickLot', 'CastableLot'
        ];

        // The field names in your data may differ from control IDs, so adjust accordingly
        // Mapping backend fields to form controls:
        const castingFieldMap = {
            Flow_A: 'argonPipeFlowA',
            Flow_B: 'argonPipeFlowB',
            Flow_C: 'argonPipeFlowC',
            Flow_D: 'argonPipeFlowD',
            Flow_E: 'argonPipeFlowE',
            Flow_F: 'argonPipeFlowF',
            Flow_G: 'argonPipeFlowG',
            Flow_H: 'argonPipeFlowH',
            Flow_I: 'argonPipeFlowI',
            Flow_J: 'argonPipeFlowJ',
            Flow_K: 'argonPipeFlowK',
            Flow_L: 'argonPipeFlowL',
            BrickBrand: 'brickBrandName',
            CastableBrand: 'castableBrandName',
            AddedWater: 'addedWaterPercent',
            MixingTime: 'mixingTimeMin',
            BrickLot: 'brickLotNo',
            CastableLot: 'castableLotNo'
        };

        for (let field of castingFields) {
            const dataField = castingFieldMap[field];
            let value = castingData[dataField];
            if (value === undefined || value === null) value = '';
            // console.log(`📌 [Casting] Setting ${field} = ${value}`);
            const control = castingForm.getControl(field);
            if (control) await control.setValue(value);
        }

        // Casting Remarks
        const castingRemarkA = sectionedTable.getSection('SectionFinalCastingRemarkStatusFormA');
        const castingRemarkB = sectionedTable.getSection('SectionFinalCastingRemarkStatusFormB');
        // console.log("🔹 Loading Casting Remarks...");

        if (castingRemarkA) {
            const remarkA = castingData.remarkA || '';
            const checkA = castingData.checkA || [];
            // console.log(`📌 Setting RemarkA = ${remarkA}, CheckA = ${checkA}`);
            await castingRemarkA.getControl('SectionFinalCastingRemarkStatusFormARemarks')?.setValue(remarkA);
            await castingRemarkA.getControl('SectionFinalCastingRemarkStatusFormACheck')?.setValue(checkA);
        }

        if (castingRemarkB) {
            const remarkB = castingData.remarkB || '';
            const checkB = castingData.checkB || [];
            // console.log(`📌 Setting RemarkB = ${remarkB}, CheckB = ${checkB}`);
            await castingRemarkB.getControl('SectionFinalCastingRemarkStatusFormBRemark')?.setValue(remarkB);
            await castingRemarkB.getControl('SectionFinalCastingRemarkStatusFormBCheck')?.setValue(checkB);
        }

        // ----------------------------
        // 6️⃣ Load Check Form & Remarks (Complete with all missing mappings)
        // ----------------------------
        const checkForm = sectionedTable.getSection('SectionFinalCheckForm');
        const checkData = checks[0] || {};
        // console.log("🔹 Loading Check Form...");

        // Mapping backend checkData fields to control names (adjust to your actual control names)
        const checkFields = [
            'CuringTime(hr)', 'DryingTime(hr)', 'DryingFurnace(MT)',
            'AfterDryingPreAssembly', 'SnorkelLot', 'StencilingMarking'
        ];

        const checkFieldMap = {
            'CuringTime(hr)': 'curingTimeHr',
            'DryingTime(hr)': 'dryingTimeHr',
            'DryingFurnace(MT)': 'dryingFurnace',
            'AfterDryingPreAssembly': 'afterDrying',
            'SnorkelLot': 'snorkelLotNo',
            'StencilingMarking': 'stencilingMarking'
        };

        for (let field of checkFields) {
            const dataField = checkFieldMap[field];
            let value = checkData[dataField];
            if (value === undefined || value === null) value = '';
            // console.log(`📌 [Check] Setting ${field} = ${value}`);
            const control = checkForm.getControl(field);
            if (control) await control.setValue(value);
        }

        // Other check fields (already mapped in your previous code)
        // Ensure these are also set correctly
        const otherCheckFields = ['checkStatus', 'remarks', 'type'];
        for (let field of otherCheckFields) {
            let value = checkData[field];
            if (value === undefined || value === null) value = '';
            const control = checkForm.getControl(field);
            if (control) {
                // console.log(`📌 [Check] Setting ${field} = ${value}`);
                await control.setValue(value);
            }
        }

        // Argon Pipe Welding Check (multi-select control assumed)
        const argonPipeWelding = checkData.argonPipeWelding || [];
        // console.log(`📌 Setting argonPipeWelding = ${argonPipeWelding}`);
        await checkForm.getControl('SectionFinalCheckaragon')?.setValue(argonPipeWelding);

        // Check Remarks
        const checkRemarkA = sectionedTable.getSection('SectionFinalCheckRemark');
        const checkRemarkB = sectionedTable.getSection('SectionFinalCheckRemarkBSnorkelLot');
        // console.log("🔹 Loading Check Remarks...");

        if (checkRemarkA) {
            const remarkA = checkData.remarkA || '';
            const checkA = checkData.checkA || [];
            // console.log(`📌 Setting Check Remark A = ${remarkA}, ${checkA}`);
            await checkRemarkA.getControl('SectionFinalCheckRemarkASnorkelLotRemark')?.setValue(remarkA);
            await checkRemarkA.getControl('SectionFinalCheckRemarkACheck')?.setValue(checkA);
        }

        if (checkRemarkB) {
            const remarkB = checkData.remarkB || '';
            const checkB = checkData.checkB || [];
            // console.log(`📌 Setting Check Remark B = ${remarkB}, ${checkB}`);
            await checkRemarkB.getControl('SectionFinalCheckRemarkBRemark')?.setValue(remarkB);
            await checkRemarkB.getControl('SectionFinalCheckRemarkBcheck')?.setValue(checkB);
        }

        // console.log("✅ Section Final Data loaded successfully.");

    } catch (err) {
        // console.error('❌ Error loading Section Final data:', err);
    }
}