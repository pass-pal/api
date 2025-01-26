import express from "express";
import xml2js from "xml2js";
import fs from "node:fs";

function read_data(table, callback) {
  fs.readFile(`./data/${table}.xml`, (err, data) => {
    if(err) {
      throw err;
    }

    xml2js.parseString(data, { explicitArray: false }, callback);
  });
}

function write_data(table, data, callback) {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(data);

  fs.writeFile(`./data/${table}.xml`, xml, callback);
}

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Welcome!");
});

app.get("/users", (_req, res) => {
  read_data("users", (err, result) => {
    if(err) {
      return res.status(500).send(`Error reading data.`);
    }

    res.json(result.records.record);
  });
});

app.get("/new", (req, res) => {
  const { name, email } = req.query;

  read_data("users", (err, result) => {
    if(err) {
      return res.status(500).send('Error reading data.');
    }

    const new_id = result.records.record.length + 1;
    const new_record = { id: new_id, name, email };

    res.send(result.records.record);
    // result.records.record.push(new_record);

    // write_data("users", result, (err) => {
    //   if(err) {
    //     return res.status(500).send('Error creating new record.');
    //   }

    //   res.redirect(`/users`);
    // });
  });
});

app.listen(80, "0.0.0.0", () => console.log(`live`));