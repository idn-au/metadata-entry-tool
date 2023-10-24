import { createApp } from "vue";
import { Chart, registerables } from "chart.js";
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from "@fortawesome/vue-fontawesome"
import App from "@/App.vue";
import router from "@/router";
import config from "@/config";

const app = createApp(App);

app.provide("agentNamedGraph", config.agentNamedGraph.replace(/\/$/, ""));
app.provide("triplestoreUrl", config.triplestoreUrl.replace(/\/$/, ""));

Chart.register(...registerables);

app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("font-awesome-layers", FontAwesomeLayers);
app.component("font-awesome-layers-text", FontAwesomeLayersText);

app.mount("#app");
