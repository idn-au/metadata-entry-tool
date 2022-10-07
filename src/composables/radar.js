import { ref, computed } from "vue";

export function useRadar(props, title, rgb, labels) {
    const options = ref({
        // responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: title,
            },
        },
        scales: {
            r: {
                grid: {
                    circular: true
                },
                min: 0,
                max: 4,
                // beginAtZero: true
            }
        }
    });

    const styles = {
        // position: "relative"
    };

    const data = computed(() => ({
        labels: labels,
        datasets: [
            {
                data: Object.values(props.score),
                borderColor: `rgb(${rgb})`,
                backgroundColor: `rgba(${rgb}, 0.2)`,
                pointBackgroundColor: `rgb(${rgb})`,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: `rgb(${rgb})`
            },
        ],
    }));

    return { options, data, styles };
};