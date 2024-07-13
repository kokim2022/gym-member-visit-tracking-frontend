const apiUrl = import.meta.env.VITE_API_URL;

export class MemberService {
    async getMembers() {
        return fetch(`${apiUrl}/members`, { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
    }

    async getMemberVisits() {
        const res = await fetch(`${apiUrl}/member_visits`, { headers: { 'Cache-Control': 'no-cache' } });
        return await res.json();
    }

    async getUniqueVisitsByHour(selectedDate) {
        const res = await fetch(`${apiUrl}/unique_visits_by_hour?selectedDate=${selectedDate}`, { headers: { 'Cache-Control': 'no-cache' } });
        return await res.json();
    }

    async getUniqueVisitsByDayInCurrentMonth() {
        const res = await fetch(`${apiUrl}/unique_visits_by_day_current_month`, { headers: { 'Cache-Control': 'no-cache' } });
        return await res.json();
    }
}
