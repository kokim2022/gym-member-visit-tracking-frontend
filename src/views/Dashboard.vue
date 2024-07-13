<script setup>
import { onMounted, ref, watch } from 'vue';
import { MemberService } from '../service/MemberService';
import moment from 'moment-timezone';
const chartDataByHour = ref();
const chartDataByDay = ref();

const chartOptions = ref();
const totalUniqueVisitsByDay = ref();
const date = ref(new Date()); // Initialize with the current date
const memberService = new MemberService();

const fetchDataByHour = (selectedDate) => {
    memberService.getUniqueVisitsByHour(selectedDate).then((uniqueVisitsByHour) => {
        chartDataByHour.value = setChartDataByHour(uniqueVisitsByHour);
        chartOptions.value = setChartOptions();
    });
};

const fetchDataByDay = () => {
    memberService.getUniqueVisitsByDayInCurrentMonth().then((uniqueVisitsByDay) => {
        chartOptions.value = setChartOptions();
        chartDataByDay.value = setChartDataByDay(uniqueVisitsByDay);
    });
};

onMounted(() => {
    const selectedDate = changeSelectedDateFormat(date.value);
    fetchDataByHour(selectedDate);
    fetchDataByDay();
});

watch(date, (newDate) => {
    const selectedDate = changeSelectedDateFormat(newDate);
    fetchDataByHour(selectedDate);
});

const changeSelectedDateFormat = (selectedDate) => {
    return moment(selectedDate).format('YYYY-MM-DD');
};

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

const setChartDataByHour = (uniqueVisitsByHour) => {
    totalUniqueVisitsByDay.value = uniqueVisitsByHour.reduce((sum, item) => sum + item.unique_visits, 0);

    return {
        labels: uniqueVisitsByHour.map((item) => formatHourSlot(item.hour_slot)),
        datasets: [
            {
                label: 'Member Visit Count By Hour',
                data: uniqueVisitsByHour.map((item) => item.unique_visits),
                backgroundColor: ['rgba(6, 182, 212, 0.2)'],
                borderColor: ['rgb(6, 182, 212)'],
                borderWidth: 1
            }
        ]
    };
};

const setChartDataByDay = (uniqueVisitsByDay) => {
    return {
        labels: uniqueVisitsByDay.map((item) => item.visit_date),
        datasets: [
            {
                label: 'Member Visit Count By Day',
                data: uniqueVisitsByDay.map((item) => item.unique_visits),
                backgroundColor: ['rgba(249, 115, 22, 0.2)'],
                borderColor: ['rgb(249, 115, 22)'],
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
        <div class="col-7">
            <div class="card">
                <div class="pb-5" style="display: flex; justify-content: space-between; align-items: center">
                    <div class="text-lg">
                        <span class="italic">Sum of unique visit by Hour in {{ date.toLocaleDateString('en-GB') }}:</span>
                        <span class="font-bold mx-2">
                            {{ totalUniqueVisitsByDay }}
                        </span>
                        visits
                    </div>
                    <Calendar v-model="date" dateFormat="yy-mm-dd" />
                </div>
                <Chart type="bar" :data="chartDataByHour" :options="chartOptions" />
            </div>
        </div>
        <div class="col-5">
            <div class="card">
                <Chart type="bar" :data="chartDataByDay" :options="chartOptions" />
            </div>
        </div>
    </div>
</template>
