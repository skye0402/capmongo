const express = require("express");
const cds = require("@sap/cds");
const odatav2proxy = require("@sap/cds-odata-v2-adapter-proxy");

const { PORT = 5007 } = process.env
const app = express()

cds.serve("all").in(app)

//convert Odata4 to Odata2 with below line
app.use(odatav2proxy({ path: "v2", port: PORT }))
app.listen(PORT, () => console.info(`server listening on http://localhost:${PORT}`))