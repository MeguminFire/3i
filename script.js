import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// PASTE YOUR GENERATED CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "it-troubl.firebaseapp.com",
  databaseURL: "https://it-troubl-default-rtdb.firebaseio.com",
  projectId: "it-troubl",
  storageBucket: "it-troubl.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const logsRef = ref(db, 'logs');

// Handling the Submit Button
document.getElementById('submitBtn').addEventListener('click', () => {
    const device = document.getElementById('device').value;
    const issue = document.getElementById('issue').value;
    const steps = document.getElementById('steps').value;
    const solution = document.getElementById('solution').value;

    if(!device && !issue) return alert("Please enter device or issue.");

    // This sends the data to the Cloud instead of Local Storage
    push(logsRef, {
        device,
        issue,
        steps,
        solution,
        timestamp: new Date().toLocaleString()
    });

    // Clear inputs
    document.getElementById('device').value = '';
    document.getElementById('issue').value = '';
    document.getElementById('steps').value = '';
    document.getElementById('solution').value = '';
});

// The Real-Time Listener: Updates screen for everyone instantly
onValue(logsRef, (snapshot) => {
    const logsArea = document.getElementById('logsArea');
    logsArea.innerHTML = '';
    const data = snapshot.val();

    if (data) {
        // Reverse so the newest logs appear at the top
        Object.keys(data).reverse().forEach(key => {
            const log = data[key];
            const logHtml = `
                <div class="log-entry">
                    <div class="log-header">
                        <span><strong>Device:</strong> ${log.device}</span>
                        <span>${log.timestamp}</span>
                    </div>
                    <div class="log-section"><strong>Issue:</strong> ${log.issue}</div>
                    <div class="log-section"><strong>Steps:</strong><br>${log.steps}</div>
                    <div class="log-section"><strong>Resolution:</strong><br>${log.solution}</div>
                </div>
            `;
            logsArea.insertAdjacentHTML('beforeend', logHtml);
        });
    }
});
