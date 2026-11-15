import markKyuar from "./mark-kyuar.png";
import markMingle from "./mark-mingle.png";
import markSavespot from "./mark-savespot.png";
import markEngi from "./mark-engi.png";
import logoEngi from "./logo-engi.png";
import markPyro from "./mark-pyro.png";
import markOurUber from "./mark-ouruber.png";

// Square logo of each project, trimmed and centred so they all render at the same size.
// Keys match the "logo" field in projects.json and experience.json.
export const projectMarks = {
    kyuar: markKyuar,
    mingle: markMingle,
    savespot: markSavespot,
    engi: markEngi,
    pyro: markPyro,
    ouruber: markOurUber,
};

// Full wordmark for projects whose logo is wider than a square; shown on the project card instead of the mark
export const projectLogos = {
    engi: logoEngi,
};
