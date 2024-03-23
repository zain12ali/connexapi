import express from "express";
import adminroutes from "./routes/adminroutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };
import dotenv from "dotenv";
dotenv.config();

const app = express();
const corsConfig = {
  origin: "*",
  credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
// Intialize the firebase-admin project/account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var jsonParser = bodyParser.json();

app.use(express.json());

app.use("/api/admin", adminroutes);
app.get("/", (req, res) => {
  res.send({
    message: "project is running",
  });
});

// connectDb();
let prot = process.env.PORT || 3000;
app.listen(prot, "0.0.0.0", () => {
  console.log(`server is running on port ${prot}`);
});
