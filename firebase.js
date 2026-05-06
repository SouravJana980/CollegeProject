import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* 🔥 YOUR FIREBASE CONFIG */
const firebaseConfig = {
    apiKey: "AIzaSyC6M4OHT4n0Cd7aVpTHklQqku_MfornKak",
    authDomain: "air-q-6132b.firebaseapp.com",
    databaseURL: "https://air-q-6132b-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "air-q-6132b",
    storageBucket: "air-q-6132b.appspot.com",
    messagingSenderId: "955178151873",
    appId: "1:955178151873:web:6617e265c56ab372de8940"
};

/* INIT */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* 🔥 REALTIME LISTENER */
const airRef = ref(db, "air");

window.firebaseData = null;

onValue(airRef, (snapshot) => {
    const d = snapshot.val();

    if (!d) {
        console.log("No data found");
        return;
    }

    if (d.pm25 !== undefined && d.pm25 !== null) {
        d.pm25 = parseFloat((d.pm25 / 100).toFixed(1));
    }

    console.log("LIVE DATA:", d);
    window.firebaseData = d;
    window.dispatchEvent(new CustomEvent('firebase-updated', { detail: d }));
});
