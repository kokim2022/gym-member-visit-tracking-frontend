const apiUrl = import.meta.env.VITE_API_URL;

export class MemberService {
    getMembers() {
        return fetch(`${apiUrl}/members`, { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
    }

    getMemberVisits() {
        return fetch(`${apiUrl}/member_visits`, { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
    }
}
