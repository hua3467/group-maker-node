import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express()
const port = 3000;

app.use( express.static( __dirname + '/client' ));

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update, onValue, child, get, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebase = initializeApp(firebaseConfig);
const db = getDatabase(firebase);

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/client/home.html');
});

app.get('/edit-event', (req, res) => {
  res.sendFile(__dirname + '/client/edit-event.html');
});

app.get('/manage-group', (req, res) => {
  res.sendFile(__dirname + '/client/manage-group.html');
});


app.get('/all-data', (req, res) => {

  const starCountRef = ref(db, '/group-app');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    return res.json(data);
  });

});

app.get("/event-data/:eventId", (req, res) => {
  const dbRef = ref(db);
  get(child(dbRef, `/group-app/${req.params.eventId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return res.json(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

});


app.post("/add-event/:eventId", jsonParser, async (req, res) => {
  console.log("/add-event/:eventId", req.body);
  
  return res.json(req.body);
});

app.post("/edit-event/:eventId", jsonParser, async (req, res) => {
  console.log("/edit-event/:eventId", req.body);
  
  update(ref(db, `/group-app/${req.params.eventId}`), req.body)
  .then(() => {
    console.log("Data saved successfully!");
  })
  .catch((error) => {
    console.log(error);
  });

  return res.json(req.body);
});

app.post("/add-group/:eventId", jsonParser, async (req, res) => {

  console.log("/add-group/:eventId", req.body);

  set(ref(db, `/group-app/${req.params.eventId}/group-data/${req.body.id}`), {
    name: req.body.name,
    description: req.body.description,
    image : req.body.image,
    id: req.body.id
  })
  .then(() => {
    console.log("Data saved successfully!");
  })
  .catch((error) => {
    console.log(error);
  });

  return res.json(req.body);

});


app.post("/sign-up-group/:eventId", jsonParser, async (req, res) => {
  console.log("/sign-up-group/:eventId", req.body);
  
  return res.json(req.body);
});


app.post("/remove/:eventId", jsonParser, async (req, res) => {

  console.log("/remove/:eventId", `${req.params.eventId}/${req.body.dataPath}`);
  

  remove(ref(db, `/group-app/${req.params.eventId}/${req.body.dataPath}`))
  .then(() => {
    console.log("Data removed");
  })
  .catch((error) => {
    console.log(error);
  });

  return res.json(req.body);
});



app.listen(port, () => {
  console.log(`App listening at port ${port}`)
});