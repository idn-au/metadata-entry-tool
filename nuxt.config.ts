import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxtjs/color-mode", "shadcn-nuxt"],
    css: ["@vulptech/vt-form/vt-form.css", "@idn-au/score-component-lib/score-component-lib.css", "@kurrawongai/kai-ui/kai-ui.css", "~/assets/css/tailwind.css", "~/assets/css/style.css"],
    app: {
        head: {
            link: [
                { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp" }
            ],
            title: "IDN MET v2"
        }
    },
    runtimeConfig: {
        public: {
            apiURL: "https://api.idnau.org",
        }
    },
    // ssr: false,
    colorMode: {
        classPrefix: "",
        classSuffix: "",
    },
    nitro: {
        prerender: {
            autoSubfolderIndex: false,
        },
    },
    vite: {
        plugins: [tailwindcss()],
    },
    shadcn: {
        prefix: "",
        componentDir: "./components/ui"
    },
    // locally installing built packages
    // imports: {
    //     transform: {
    //         exclude: [/\bscore-component-lib\b/]
    //     }
    // },
});
