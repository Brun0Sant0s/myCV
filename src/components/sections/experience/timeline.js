import data from "../../../data/experience.json";

// Timeline data and layout shared by the desktop swimlanes and the mobile list.
export const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

// Chronological value of an event: "Aug 2021" → 2021.58; year-only dates go after dated ones in that year
const timeOf = (ev) => {
    const month = MONTHS[ev.date.slice(0, 3)];
    return Number(ev.year) + (month === undefined ? 0.95 : month / 12);
};

export const roles = data.roles;
export const roleById = Object.fromEntries(roles.map((r) => [r.id, r]));
export const events = [...data.events].sort((a, b) => timeOf(a) - timeOf(b));

// Year columns, from the first to the last event
const firstYear = Number(events[0].year);
export const lastYear = Number(events[events.length - 1].year);
export const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => String(firstYear + i));

// A year normally takes one column. When two moments share a year in the same lane
// (2026: OurUber and Mingle), that year gets one column per moment so every text is shown in full.
export const eventsIn = (roleId, year) => events.filter((e) => e.role === roleId && e.year === year);
export const slots = years.flatMap((year) => {
    const count = Math.max(1, ...roles.map((r) => eventsIn(r.id, year).length));
    return Array.from({ length: count }, (_, sub) => ({ year, sub, last: sub === count - 1 }));
});
export const N = slots.length;
export const firstSlotOf = (year) => slots.findIndex((s) => s.year === year);

// Years a role was active, for the lane line
export const roleSpan = {
    epharma: [2021, 2025],
    freelance: [2021, lastYear],
    pyro: [2024, lastYear],
};

// Desktop layout
export const COL_W = 420;
export const HEADER_H = 84;
export const LABEL_W = 250;
export const LINE_Y = 30; // lane line distance from the top of the lane
export const CARD_TOP = 50; // card distance from the top of the lane
export const ITEM_X = 24; // horizontal inset of a moment inside its year column

// Month of a moment ("Jun 2024" → "Jun"); year-only moments have none, since the year is already shown above.
export const monthOf = (ev) => {
    const first = ev.date.split(" ")[0];
    return MONTHS[first] !== undefined ? first : "";
};
export const DATE_COL = 56;
// Desktop lanes: room under the tallest moment and the space the controls and tab bar take
export const LANE_PAD = 28; // space under the tallest moment of a lane
// Vertical room the timeline can't use: the arrows and dots, plus the fixed tab bar at the bottom of the screen
export const NAV_SPACE = 84;
export const CONTROLS_H = NAV_SPACE + 16 + 24 + 36 + 12;
// Top of each lane, below the year row
export const laneTops = (heights) => heights.map((_, i) => HEADER_H + heights.slice(0, i).reduce((sum, h) => sum + h, 0));
