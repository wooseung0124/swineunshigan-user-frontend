import assert from 'node:assert/strict';
import { distanceMeters, formatDistance, filterWithinSeongsu } from '../geo.js';
import { resolveOpenStatus, timeToMinutes } from '../placeOpenStatus.js';
import { resolveFloatingScheduleState, parseScheduledAt } from '../floatingSchedule.js';

assert.equal(timeToMinutes('10:30'), 630);
assert.ok(
  Math.abs(
    distanceMeters(
      { lat: 37.544581, lng: 127.055961 },
      { lat: 37.544581, lng: 127.055961 },
    ),
  ) < 1,
);
assert.equal(formatDistance(350), '350m');
assert.equal(formatDistance(1200), '1.2km');

const openNow = resolveOpenStatus(
  [{ dayOfWeek: 'MONDAY', openingTime: '00:00', closingTime: '23:59' }],
  new Date('2026-09-07T12:00:00'),
);
assert.equal(openNow.isOpen, true);

const filtered = filterWithinSeongsu(
  [
    { id: 1, distanceMeters: 500 },
    { id: 2, distanceMeters: 1500 },
  ],
  1000,
);
assert.equal(filtered.length, 1);

const start = new Date();
start.setMinutes(start.getMinutes() + 20);
const floating = resolveFloatingScheduleState([
  {
    id: 1,
    status: 'RECRUITING',
    scheduledAt: start.toISOString(),
  },
]);
assert.equal(floating.visible, true);
assert.equal(floating.qrEnabled, true);
assert.ok(parseScheduledAt('2026-09-01 18:30'));

console.log('utils unit tests passed');
