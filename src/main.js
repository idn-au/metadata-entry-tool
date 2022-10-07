import { createApp } from "vue";
import { Chart, registerables } from "chart.js";
import App from "@/App.vue";
import router from "@/router";

const app = createApp(App);

Chart.register(...registerables);

app.use(router);

app.mount("#app");
