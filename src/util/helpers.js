/**
 * Sets the `enabled` for a given score requirement
 * 
 * @param {object} score the score object
 * @param {string[]} scorePath an array representation of the path of keys, e.g. `["f", "f1"]`
 * @param {number} index the requirement's index
 * @param {boolean} enabled 
 */
export function setRequirement(score, scorePath, index, enabled) {
    const subscore = getSubscore(score, scorePath);
    subscore.requirements[index].enabled = enabled;
};

/**
 * Sets the `enabled` for a given score prerequisite
 * 
 * @param {object} score the score object
 * @param {string[]} scorePath an array representation of the path of keys, e.g. `["f", "f1"]`
 * @param {boolean} enabled 
 */
export function setPrerequisite(score, scorePath, enabled) {
    const subscore = getSubscore(score, scorePath);
    subscore.prerequisite.enabled = enabled;
};

export function calculateScoreMax(score) {
    Object.values(score).forEach(s => {
        if (s.requirements) {
            s.max = s.requirements.reduce((acc, curr) => acc + curr.value, 0);
        } else {
            calculateScoreMax(s.scores);
            s.max = Object.values(s.scores).reduce((acc, curr) => acc + curr.max, 0);
        }
    });
};

export function calculateScore(score) {
    Object.entries(score).forEach(([key, s]) => {
        if (s.requirements) {
            if (s.prerequisite && !s.prerequisite.enabled) {
                s.value = 0;
            } else {
                s.value = s.requirements.reduce((acc, curr) => acc + (curr.enabled ? curr.value : 0), 0);
            }
        } else {
            calculateScore(s.scores);
            s.value = Object.values(s.scores).reduce((acc, curr) => acc + curr.value, 0);
        }
    });
};

export function calculateSubScore(score, scorePath) {
    const s = getSubscore(score, scorePath);
    if (s.requirements) {
        if (s.prerequisite && !s.prerequisite.enabled) {
            s.value = 0;
        } else {
            s.value = s.requirements.reduce((acc, curr) => acc + (curr.enabled ? curr.value : 0), 0);
        }
    } else {
        calculateScore(s.scores);
        s.value = Object.values(s.scores).reduce((acc, curr) => acc + curr.value, 0);
    }
};

/**
 * Determines whether a score has been scored fully
 * 
 * @param {object} score the score object
 * @param {string[]} scorePath an array representation of the path of keys, e.g. `["f", "f1"]`
 * @returns {boolean} whether the specified score has its maximum value
 */
export function hasFullScore(score, scorePath) {
    const subscore = getSubscore(score, scorePath);
    return subscore.value === subscore.max;
};

/**
 * Gets the specified sub score object from an array of keys
 * 
 * @param {object} obj the object to traverse
 * @param {string[]} keyArray an array representation of the path of keys to traverse, e.g. `["f", "f1"]`
 * @returns the sub score object
 */
function getSubscore(score, scorePath) {
    const keyArray = [];
    scorePath.forEach((e, eIndex) => {
        if (eIndex < scorePath.length - 1) {
            keyArray.push(e, "scores");
        } else {
            keyArray.push(e);
        }
    });
    return traverseByKeys(score, keyArray);
}

/**
 * Traverses an object using an array of keys to follow
 * 
 * @param {object} obj the object to traverse
 * @param {string[]} keyArray an array representation of the path of keys to traverse, e.g. `["f", "f1"]`
 * @returns {any} the value from the key path
 */
function traverseByKeys(obj, keyArray) {
    return keyArray.reduce((acc, curr) => acc ? acc[curr] : undefined, obj);
};

// export async function isReachable(url) {
//     let ok = true;

//     try {
//         const r = await fetch(url, {
//             // method: "GET",
//             // mode: "no-cors"
//         });
//         if (!r.ok) {
//             throw new Error("error");
//         }
//         await r.text();
//     } catch (e) {
//         ok = false;
//     }

//     return ok;
// }
