import express from "express";
import morgan from "morgan";

const app = express();
const PORT = Number(process.env.PORT ?? 8080);

app.use(morgan("dev")); //* log with some colors :) */

app.get("/", (req, res) => {
    res.json({hello: "world"})
});

app.listen(PORT, "0.0.0.0", () => { //! 0.0.0.0 is for docker (mandatory) */
    console.log(`Server started at http://localhost:${PORT}`)
});