<script setup>
import { ref, onBeforeMount } from 'vue';
import { MemberService } from '@/service/MemberService';

const customer1 = ref(null);

const loading1 = ref(null);

const memberService = new MemberService();
const getHourColor = (date) => {
    const hour = new Date(date).getHours();
    const colors = ['#FF5733', '#FFBD33', '#DBFF33', '#75FF33', '#33FF57', '#33FFBD', '#33DBFF', '#3375FF', '#5733FF', '#BD33FF', '#FF33DB', '#FF3375'];
    const bgColor = colors[hour % colors.length];

    // Calculate brightness to determine text color
    const brightness = (parseInt(bgColor.substr(1, 2), 16) * 299 + parseInt(bgColor.substr(3, 2), 16) * 587 + parseInt(bgColor.substr(5, 2), 16) * 114) / 1000;
    const textColor = brightness > 128 ? 'black' : 'white';

    return { backgroundColor: bgColor, color: textColor };
};

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
                            <div :style="getHourColor(data.created_at)" class="p-2">
                                {{ new Date(data.created_at).toLocaleString() }}
                            </div>
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
