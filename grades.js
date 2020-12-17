import express from "express";
import { promises as fs } from "fs";

const router = express.Router();
const { readFile, writeFile } = fs;
global.fileName = "./files/grades.json";

fs.readFile(global.fileName);

router.get("/", async (_req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        res.send(data);
    } catch (err) {
        console.log(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const grade = data.grades.find(g => g.id === parseInt(req.params.id));
        res.send(grade);
    } catch (err) {
        console.log(err);
    }
});

router.post("/", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        let newGrade = req.body;
        newGrade = { id: data.nextId++, ...newGrade, timestamp: new Date() }
        data.grades.push(newGrade);
        await writeFile(global.fileName, JSON.stringify(data), null, 2);
        res.send(newGrade);
    } catch (err) {

    }
});

router.put("/", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        let gradeUpdate = req.body;

        const index = data.grades.findIndex(g => g.id === gradeUpdate.id);
        data.grades[index] = { ...gradeUpdate, timestamp: new Date() };

        await writeFile(global.fileName, JSON.stringify(data), null, 2);

        res.send(data.grades[index]);
    } catch (err) {

    }
});

router.delete("/:id", async (req, res) => {
    try {
        let data = JSON.parse(await readFile(global.fileName));
        data = data.grades.filter(g => g.id !== parseInt(req.params.id));
        await writeFile(global.fileName, JSON.stringify(data), null, 2);
        res.end();
    } catch (err) {
        console.log(err);
    }
});

router.get("/:student/:subject", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        let filtro = data.grades.filter(s => {
            return (s.student === req.params.student) && (s.subject === req.params.subject);
        });
        let value = await filtro.reduce( (acc, curr) => {
            return acc + curr.value;
        }, 0);
        res.send(JSON.stringify(value));
    } catch (err) {
        console.log(err);
        res.send(err);
    }

});

router.get("/subject/:subject/:type", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        let filtro = data.grades.filter(s => {
            return (s.subject === req.params.subject) && (s.type === req.params.type);
        });
        let value = await filtro.reduce( (acc, curr) => {
            return acc + curr.value;
        }, 0);
        let media = value / filtro.length;
        res.send(JSON.stringify(media));
    } catch (err) {
        console.log(err);
        res.send(err);
    }

});

router.get("/best/:subject/:type", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        let filtro = data.grades.filter(s => {
            return (s.subject === req.params.subject) && (s.type === req.params.type);
        });
        filtro = filtro.sort( (a,b) => {
            return b.value - a.value
        });
        res.send(filtro.splice(0,3));
    } catch (err) {
        console.log(err);
        res.send(err);
    }

});


export default router;