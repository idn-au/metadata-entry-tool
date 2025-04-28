// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/color-mode"],
    css: ["@vulptech/vt-form/vt-form.css", "assets/css/tailwind.css", "assets/css/style.css"],
    app: {
        head: {
            link: [
                { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp" }
            ],
            title: "IDN MET v2"
        }
    },
    veeValidate: {
        autoImports: true,
    },
    ssr: false,
    // postcss: {
    //     plugins: {
    //         tailwindcss: {},
    //         autoprefixer: {},
    //     },
    // },
    // colorMode: {
    //     classPrefix: "",
    //     classSuffix: "",
    // },
    nitro: {
        prerender: {
            autoSubfolderIndex: false,
        },
    }
});
