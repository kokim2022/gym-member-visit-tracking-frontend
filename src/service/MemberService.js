export class MemberService {
    getMembers() {
        return fetch('http://gym-member-visit-tracking-backend.test/api/members', { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
    }

    getMemberVisits() {
        return fetch('http://gym-member-visit-tracking-backend.test/api/member_visits', { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
    }
}
