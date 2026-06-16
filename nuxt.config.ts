import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2026-01-19",
    devtools: { enabled: false },
    modules: ["@nuxtjs/color-mode", "shadcn-nuxt", "@nuxt/image"],
    css: [
        "@vulptech/vt-form/vt-form.css",
        "@idn-au/score-component-lib/score-component-lib.css",
        "@kurrawongai/kai-ui/kai-ui.css",
        "~/assets/css/tailwind.css",
        "~/assets/css/style.css",
    ],
    app: {
        head: {
            link: [
                { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap", type: "text/css" },
                { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
                { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
                { rel: "shortcut icon", href: "/favicon.ico" },
                { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
                { rel: "manifest", href: "/site.webmanifest" },
            ],
            meta: [
                { name: "apple-mobile-web-app-title", content: "IDN Metadata Entry Tool" },
            ],
            title: "IDN Metadata Entry Tool"
        }
    },
    runtimeConfig: {
        fusekiURL: "",
        fusekiUsername: "",
        fusekiPassword: "",
        public: {
            apiURL: "https://api.idnau.org",
        },
    },
    colorMode: {
        classPrefix: "",
        classSuffix: "",
    },
    // nitro: {
    //     prerender: {
    //         autoSubfolderIndex: false,
    //     },
    // },
    vite: {
        plugins: [tailwindcss()],
    },
    shadcn: {
        prefix: "",
        componentDir: "./app/components/ui"
    },
    // locally installing built packages
    // imports: {
    //     transform: {
    //         exclude: [/\bscore-component-lib\b/]
    //     }
    // },
});