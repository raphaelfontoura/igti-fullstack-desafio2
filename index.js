import express from "express";
import gradesRouter from "./grades.js";

const app = express();
const PORT = 3000;
app.use(express.json());

app.use("/grades", gradesRouter)

app.listen(PORT, () => {
    console.log("API Started! Listening at %s", PORT);
});