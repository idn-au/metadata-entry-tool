import { ref } from "vue";

const DURATION = 5000;

export function useBtnTimeout() {
    var timeout;

    const clicked = ref(false);

    function startTimeout() {
        clearTimeout(timeout);
        clicked.value = true;
        timeout = setTimeout(() => {
            clicked.value = false;
        }, DURATION);
    }

    return { clicked, startTimeout };
}
