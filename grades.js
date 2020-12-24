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
        res.status(400).send({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const grade = data.grades.find(g => g.id === parseInt(req.params.id));
        res.send(grade);
    } catch (err) {
        res.status(400).send({ error: err.message });
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
        res.status(400).send({ error: err.message });
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
        res.status(400).send({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let data = JSON.parse(await readFile(global.fileName));
        data = data.grades.filter(g => g.id !== parseInt(req.params.id));
        await writeFile(global.fileName, JSON.stringify(data), null, 2);
        res.end();
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.post("/totalByStudentAndSubject", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const student = data.grades.filter(s => {
            return (s.student === req.body.student) && (s.subject === req.body.subject);
        });
        let total = await student.reduce((acc, curr) => {
            return acc + curr.value;
        }, 0);
        res.send({ total });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }

});

router.post("/averageBySubjectAndType", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const subjects = data.grades.filter(s => {
            return (s.subject === req.body.subject) && (s.type === req.body.type);
        });
        let total = await subjects.reduce((acc, curr) => {
            return acc + curr.value;
        }, 0);
        let average = total / subjects.length;
        res.send({ average });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }

});

router.post("/bestsValuesBySubjectType", async (req, res) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        let subjectsType = data.grades.filter(s => {
            return (s.subject === req.body.subject) && (s.type === req.body.type);
        });
        subjectsType = subjectsType.sort((a, b) => {
            return b.value - a.value
        });
        res.send(subjectsType.splice(0, 3));
    } catch (err) {
        res.status(400).send({ error: err.message });
    }

});


export default router;