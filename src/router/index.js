import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("@/views/HomeView.vue")
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
})

export default router
