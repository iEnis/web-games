import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    return {
        plugins: [react()],
        base: mode !== "development" ? "/web-games/" : "",
        server: {
            port: 54570,
        },
    };
});
