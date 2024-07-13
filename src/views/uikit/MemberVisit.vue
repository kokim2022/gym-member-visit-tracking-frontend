<script setup>
import { ref, onBeforeMount } from 'vue';
import { MemberService } from '@/service/MemberService';

const customer1 = ref(null);

const loading1 = ref(null);

const memberService = new MemberService();

onBeforeMount(() => {
    memberService.getMemberVisits().then((data) => {
        customer1.value = data;
        loading1.value = false;
    });
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Member Visits</h5>
                <DataTable :value="customer1" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading1" showGridlines>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="name" header="Name" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.user.name }}
                        </template>
                    </Column>
                    <Column field="Visit Date (Entry Date)" header="Visit Date (Entry Date)" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ new Date(data.created_at).toLocaleString() }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
