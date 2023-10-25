/**
 * Sets the `enabled` for a given score requirement
 * 
 * @param {object} score the score object
 * @param {string[]} scorePath an array representation of the path of keys, e.g. `["f", "f1"]`
 * @param {number} index the requirement's index
 * @param {boolean} enabled 
 */
export function setRequirement(score, scorePath, index, enabled) {
    const keyArray = [];
    scorePath.forEach((e, eIndex) => {
        if (eIndex < scorePath.length - 1) {
            keyArray.push(e, "scores");
        } else {
            keyArray.push(e);
        }
    });
    const subscore = traverseByKeys(score, keyArray);
    subscore.requirements[index].enabled = enabled;
};

export function calculateScoreValue(score) {

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
            s.value = s.requirements.reduce((acc, curr) => acc + (curr.enabled ? curr.value : 0), 0);
        } else {
            calculateScore(s.scores);
            s.value = Object.values(s.scores).reduce((acc, curr) => acc + curr.value, 0);
        }
    });
};

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
