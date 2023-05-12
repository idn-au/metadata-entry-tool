import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/help",
            name: "help",
            component: () => import("@/views/HelpView.vue")
        },
        {
            path: "/contact",
            name: "contact",
            component: () => import("@/views/ContactView.vue")
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not found",
            component: () => import("@/views/NotFoundView.vue")
        },
    ]
});

export default router;
