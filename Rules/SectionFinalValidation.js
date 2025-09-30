export default async function SectionFinalValidation(clientAPI) {
    try {
        const pageProxy = clientAPI.getPageProxy();
        const sectionedTable = pageProxy.getControl('FormSectionedTable');
        const binding = pageProxy.getBindingObject();
        const type = binding.TYPE ? binding.TYPE.toLowerCase() : '';

        let errors = [];

        // ----------------------------
        // 1️⃣ QC Measurements Groups A–F (no change here)
        // ----------------------------
        const sectionFinal = sectionedTable.getSection('SectionFinalQCMeasurements');
        const groups = ['A','B','C','D','E','F'];
        for (let g of groups) {
            const measurements = [];
            for (let i = 1; i <= 5; i++) {
                measurements.push((sectionFinal.getControl(`MeasurePoint_${g}${i}`)?.getValue() || '').toString().trim());
            }
            const checkVal = sectionFinal.getControl(`Check_${g}`)?.getValue() || [];
            const hasMeasurement = measurements.some(v => v !== '');
            const hasCheck = checkVal.length > 0;
            if (!hasMeasurement || !hasCheck) {
                errors.push(`Group ${g} → Fill at least one measurement and select a Check`);
            }
        }

        // ----------------------------
        // 2️⃣ Casting Form
        // ----------------------------
        const castingForm = sectionedTable.getSection('SectionFinalCastingForm');
        const requiredCastingFields = [
            'BrickBrand','CastableBrand','AddedWater','MixingTime',
            'BrickLot','CastableLot'
        ];

        // Include Flow fields only if NOT 'outlet'
        if (type !== 'outlet') {
            requiredCastingFields.unshift(
                'Flow_A','Flow_B','Flow_C','Flow_D','Flow_E','Flow_F',
                'Flow_G','Flow_H','Flow_I','Flow_J','Flow_K','Flow_L'
            );
        }

        for (let field of requiredCastingFields) {
            const val = castingForm.getControl(field)?.getValue();
            if (!val) errors.push(`Casting Form → Please fill in ${field}`);
        }

        // ----------------------------
        // 3️⃣ Casting Remark Status A & B (no change)
        // ----------------------------
        const castingRemarkA = sectionedTable.getSection('SectionFinalCastingRemarkStatusFormA');
        const castingRemarkB = sectionedTable.getSection('SectionFinalCastingRemarkStatusFormB');
        const remarkA = castingRemarkA.getControl('SectionFinalCastingRemarkStatusFormARemarks')?.getValue() || '';
        const checkA = castingRemarkA.getControl('SectionFinalCastingRemarkStatusFormACheck')?.getValue() || [];
        const remarkB = castingRemarkB.getControl('SectionFinalCastingRemarkStatusFormBRemark')?.getValue() || '';
        const checkB = castingRemarkB.getControl('SectionFinalCastingRemarkStatusFormBCheck')?.getValue() || [];
        if (!remarkA) errors.push('Casting Remark A → Remarks required');
        if (!checkA.length) errors.push('Casting Remark A → Select at least one Check');
        if (!remarkB) errors.push('Casting Remark B → Remarks required');
        if (!checkB.length) errors.push('Casting Remark B → Select at least one Check');

        // ----------------------------
        // 4️⃣ Check Form
        // ----------------------------
        const checkForm = sectionedTable.getSection('SectionFinalCheckForm');
        const requiredCheckFields = [
            'CuringTime','DryingTime(hr)','DryingFurnace(MT)',
            'AfterDryingPreAssembly','SnorkelLot','StencilingMarking'
        ];
        for (let field of requiredCheckFields) {
            const val = checkForm.getControl(field)?.getValue();
            if (!val) errors.push(`Check Form → Please fill in ${field}`);
        }

        // Validate Argon Pipe Welding only if NOT 'outlet'
        if (type !== 'outlet') {
            const checkAragon = checkForm.getControl('SectionFinalCheckaragon')?.getValue() || [];
            if (!checkAragon.length) errors.push('Check Form → Select at least one for Argon Pipe Welding');
        }

        // ----------------------------
        // 5️⃣ Check Remark A & B (no change)
        // ----------------------------
        const checkRemarkA = sectionedTable.getSection('SectionFinalCheckRemark');
        const checkRemarkB = sectionedTable.getSection('SectionFinalCheckRemarkBSnorkelLot');
        const remarkCRA = checkRemarkA.getControl('SectionFinalCheckRemarkASnorkelLotRemark')?.getValue() || '';
        const checkCRA = checkRemarkA.getControl('SectionFinalCheckRemarkACheck')?.getValue() || [];
        const remarkCRB = checkRemarkB.getControl('SectionFinalCheckRemarkBRemark')?.getValue() || '';
        const checkCRB = checkRemarkB.getControl('SectionFinalCheckRemarkBcheck')?.getValue() || [];
        if (!remarkCRA) errors.push('Check Remark A → Remarks required');
        if (!checkCRA.length) errors.push('Check Remark A → Select at least one Check');
        if (!remarkCRB) errors.push('Check Remark B → Remarks required');
        if (!checkCRB.length) errors.push('Check Remark B → Select at least one Check');

        // ----------------------------
        // ❌ Show errors if any
        // ----------------------------
        if (errors.length > 0) {
            return clientAPI.executeAction({
                Name: '/TRL_RH_SnorkelApp/Actions/ValidationFailed.action',
                Properties: { Message: errors.join('\n• ') }
            });
        }

        // ----------------------------
        // ✅ Execute QC Measurements Actions
        // ----------------------------
        for (let g of groups) {
            await clientAPI.executeAction({
                Name: `/TRL_RH_SnorkelApp/Actions/QCMeasurementsCreateRow_${g}.action`,
                Properties: {}
            });
        }

        // ----------------------------
        // ✅ Execute Casting Action
        // ----------------------------
        await clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/QCCastingCreate.action'
        });

        // ----------------------------
        // ✅ Execute Check Action
        // ----------------------------
        await clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/QCCheckCreate.action'
        });

        return clientAPI.executeAction('/TRL_RH_SnorkelApp/Actions/SuccessSubmitMessage.action');

    } catch (err) {
        console.error('Validation error:', err);
        return clientAPI.executeAction({
            Name: '/TRL_RH_SnorkelApp/Actions/ErrorMessage.action',
            Properties: { Message: 'Unexpected error during Section Final validation. Please try again.' }
        });
    }
}
