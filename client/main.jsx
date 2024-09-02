import React from "react"
import { hydrateRoot, createRoot } from "react-dom/client"
import { render } from "react-dom"

import App from "./App"

// const container = document.getElementById("root")
// hydrateRoot(container, <App />)

const root = createRoot(document.getElementById("root"))
root.render(<App />)
