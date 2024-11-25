import ViteYaml from "@modyfi/vite-plugin-yaml";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@vee-validate/nuxt", "@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/color-mode"],
    app: {
        head: {
            link: [
                { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp" }
            ],
            title: "IDN MET v2"
        }
    },
    vite: {
        plugins: [ViteYaml()],
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler"
                }
            }
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
});
