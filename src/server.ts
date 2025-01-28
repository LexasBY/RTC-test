import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.MOCK_SERVER_PORT || 4000;

const dbFilePath = path.resolve(__dirname, "../db.json");

const readDbFile = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.readFile(dbFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Failed to read db.json:", err);
        return reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

app.get("/api/state", async (_req: Request, res: Response) => {
  try {
    const data = await readDbFile();
    console.log(data);
    if (data.state) {
      res.json(data.state);
    } else {
      res.status(404).json({ error: "State not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve state" });
  }
});

app.get("/api/mappings", async (_req: Request, res: Response) => {
  try {
    const data = await readDbFile();
    console.log(data);
    if (data.mappings) {
      res.json(data.mappings);
    } else {
      res.status(404).json({ error: "Mappings not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve mappings" });
  }
});

app.listen(PORT, () => {
  console.log(`Mock server is running at http://localhost:${PORT}`);
});
