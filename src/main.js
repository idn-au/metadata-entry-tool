import { createApp } from "vue";
import { Chart, registerables } from "chart.js";
import App from "@/App.vue";
import router from "@/router";
import config from "@/config";

const app = createApp(App);

app.provide("agentNamedGraph", config.agentNamedGraph.replace(/\/$/, ""));
app.provide("triplestoreUrl", config.triplestoreUrl.replace(/\/$/, ""));

Chart.register(...registerables);

app.use(router);

app.mount("#app");
