<script setup>
import { onMounted, ref } from 'vue';
import { MemberService } from '../service/MemberService';

const chartData = ref();
const chartOptions = ref();
const totalUniqueVisitsByDay = ref();

const memberService = new MemberService();

onMounted(() => {
    memberService.getUniqueVisitsByHour().then((uniqueVisitsByHour) => {
        chartData.value = setChartData(uniqueVisitsByHour);
        chartOptions.value = setChartOptions();
    });
});

const formatHourSlot = (hourSlot) => {
    const date = new Date(hourSlot);
    const nextHourDate = new Date(date);
    nextHourDate.setHours(date.getHours() + 1);

    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr} ${ampm}`;
    };

    const startTime = formatTime(date);
    const endTime = formatTime(nextHourDate);

    return `${startTime} - ${endTime}`;
};

const setChartData = (uniqueVisitsByHour) => {
    totalUniqueVisitsByDay.value = uniqueVisitsByHour.reduce((sum, item) => sum + item.unique_visits, 0);

    return {
        labels: uniqueVisitsByHour.map((item) => formatHourSlot(item.hour_slot)),
        datasets: [
            {
                label: 'Member Visit Count',
                data: uniqueVisitsByHour.map((item) => item.unique_visits),
                backgroundColor: ['rgba(6, 182, 212, 0.2)'],
                borderColor: ['rgb(6, 182, 212)'],
                borderWidth: 1
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="text-lg flex">
                    <div class="italic">Sum of unique visit by Hour in 12-07-2024:</div>
                    <div class="font-bold ml-3">
                        {{ totalUniqueVisitsByDay }}
                    </div>
                </div>
                <Chart type="bar" :data="chartData" :options="chartOptions" />
            </div>
        </div>
    </div>
</template>
