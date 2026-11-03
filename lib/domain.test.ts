import {test} from 'node:test';import assert from 'node:assert/strict';import {initialTeams} from './data';import {isOpen,joinTeam,teamSchema} from './domain';
test('membership respects capacity, duplicate and recruiting dates',()=>{const t=initialTeams[0];assert.equal(isOpen(t,'2026-11-03'),true);assert.throws(()=>joinTeam(t,'u1','2026-11-03'));assert.throws(()=>joinTeam(t,'u5','2027-01-01'));const full={...t,capacity:3};assert.throws(()=>joinTeam(full,'u5','2026-11-03'));assert.equal(joinTeam(t,'u5','2026-11-03').members.length,4)});
test('reject reversed dates and impossible team sizes',()=>{assert.equal(teamSchema.safeParse({...initialTeams[0],end:'2026-10-01'}).success,false);assert.equal(teamSchema.safeParse({...initialTeams[0],capacity:1}).success,false);assert.equal(teamSchema.safeParse(initialTeams[0]).success,true)});

import {submitJoinRequest,decideJoinRequest,type JoinRequest} from './domain';
const now='2026-11-03T10:00:00.000Z';
test('request waits for owner approval; only acceptance adds membership',()=>{
 const t=initialTeams[0],requests=submitJoinRequest(t,[],'u5',now);
 assert.equal(requests[0].status,'pending');assert.equal(t.members.includes('u5'),false);
 assert.throws(()=>submitJoinRequest(t,requests,'u5',now));
 assert.throws(()=>submitJoinRequest(t,[],'u1',now));
 assert.throws(()=>decideJoinRequest(t,requests,'u2',requests[0].id,'accepted',now));
 const approved=decideJoinRequest(t,requests,t.owner,requests[0].id,'accepted',now);
 assert.equal(approved.team.members.includes('u5'),true);assert.equal(approved.requests[0].status,'accepted');assert.equal(approved.requests[0].decidedAt,now);
 assert.throws(()=>decideJoinRequest(approved.team,approved.requests,t.owner,requests[0].id,'accepted',now));
});
test('rejection leaves membership unchanged; rejected applicant may apply again',()=>{
 const t=initialTeams[0],requests=submitJoinRequest(t,[],'u5',now);
 const rejected=decideJoinRequest(t,requests,t.owner,requests[0].id,'rejected',now);
 assert.deepEqual(rejected.team.members,t.members);assert.equal(rejected.requests[0].status,'rejected');
 const retried=submitJoinRequest(t,rejected.requests,'u5',now);assert.equal(retried.length,1);assert.equal(retried[0].status,'pending');assert.equal(retried[0].decidedAt,undefined);
});
test('owner cannot overfill team or approve outside recruiting window',()=>{
 const t={...initialTeams[0],capacity:4};let requests=submitJoinRequest(t,[],'u5',now);requests=submitJoinRequest(t,requests,'u7',now);
 const first=decideJoinRequest(t,requests,t.owner,requests[0].id,'accepted',now);
 assert.throws(()=>decideJoinRequest(first.team,first.requests,t.owner,requests[1].id,'accepted',now));
 assert.throws(()=>decideJoinRequest(t,requests,t.owner,requests[0].id,'accepted','2027-01-01T10:00:00.000Z'));
 assert.throws(()=>submitJoinRequest(t,[],'u5','2027-01-01T10:00:00.000Z'));
 const wrong:JoinRequest={...requests[0],teamId:'another-team'};
 assert.throws(()=>decideJoinRequest(t,[wrong],t.owner,wrong.id,'accepted',now));
});
