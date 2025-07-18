import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ToastProvider } from "./context/ToastProvider";
import { MathJaxContext } from "better-react-mathjax";

import router from "./routes/router";

const queryClient = new QueryClient();

const mathJaxConfig = {
    options: {
        ignoreHtmlClass: "tex2jax_ignore",
        processHtmlClass: "tex2jax_process",
        skipHtmlTags: [
            "script",
            "noscript",
            "style",
            "textarea",
            "code",
            "pre",
        ],
    },
    tex: {
        inlineMath: [["\\(", "\\)"]],
        displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
        ],
        processEscapes: true,
        // processEnvironments: true,
    },
    loader: {
        load: ["input/tex", "output/chtml"],
    },
    chtml: {
        scale: 1,
        minScale: 0.8,
        matchFontHeight: true,
        mtextFont: "",
        merrorFont: "",
        mathmlSpacing: false,
        skipAttributes: {},
        exFactor: 0.5,
        displayAlign: "left",
        displayIndent: "0",
        wrapperFactory: null,
        fontURL:
            "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2",
    },
};

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                {/* Wrap the RouterProvider with QueryClientProvider, ToastProvider, and MathJaxContext */}
                <MathJaxContext config={mathJaxConfig}>
                    <RouterProvider router={router} />
                </MathJaxContext>
            </ToastProvider>
        </QueryClientProvider>
    </StrictMode>
);
