// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD0JUkcZ1Mc_4Zosd5NEovRGIRb8kazqhU",
    authDomain: "quiz-40bb7.firebaseapp.com",
    projectId: "quiz-40bb7",
    storageBucket: "quiz-40bb7.appspot.com",
    messagingSenderId: "807178413256",
    appId: "1:807178413256:web:da86fc8f061577a2bcb1fd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Inicializa Base de datos
let db = firebase.firestore();

/**********************  STATS CHART *********************/
const dates = [];
const scores = [];
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    dates.push(key);
    scores.push(value);
}

var ctx = document.getElementById('statsChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dates,
        datasets: [{
            label: 'Score',
            data: scores,
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64,1 )'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                min: 0,
                max: 10,
            },
            x: {
                title: {
                    color: 'red',
                    display: true,
                    text: 'Day'
                }
            }
        }
    }
});


/*******************  HOME PAGE *******************/
const categories = document.querySelectorAll(".category");
let currentCategory = "";

// Adding category at sessionStorage

categories.forEach(category => {
    category.addEventListener("click", () => {
        currentCategory = category.title;
        setCategory();
    });
});

function setCategory() {
    const ssPermitted = sessionStorage.setItem("category", currentCategory);
    const ssForbidden = console.log("Tu browser no acepta webStorage :(");
    typeof (Storage) !== undefined ? ssPermitted : ssForbidden;

};



/*******************  LOGIN MODAL *********************/
// Get the modal
let modal = document.getElementById('login');
let signUpHead = document.getElementById('signUpHead');
signUpHead.addEventListener(("click"), () => {
    modal.style.display = 'block'

});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
//Cancel button
let cancelBtn = document.querySelector(".cancelbtn");
cancelBtn.addEventListener("click", () => {
    document.getElementById('login').style.display = 'none'
});

let loginBtn = document.querySelector(".loginbtn");
loginBtn.addEventListener("click", () => {
    signUp();
});

/************************* FIREBASE DATABASE **********************/



// Anade coleccion a la base de datos
const createUser = (email, password) => {
    db
        .collection("users")
        .add({
            email: email,
            password: password
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
};

// Regitra a un usuario en
const signUp = () => {
    let umail = document.querySelector("#umail");
    let umailText = umail.value;
    let psw = document.querySelector("#psw");
    let pswText = psw.value;

    firebase.auth()
        .createUserWithEmailAndPassword(umailText, pswText)
        .then((userCredential) => {
            // Directamente creamos el usuario y lo almacenamos en FireStore
            createUser(umailText, pswText);
        })
        .catch((error) => {
            let errorCode = error.code;
            console.log(errorCode);
            if (errorCode == "auth/email-already-in-use") {
                umail.style.backgroundColor = "#e07a5f";
                umail.value = "The email is already in use";
            } else if (errorCode == "auth/weak-password") {
                psw.style.backgroundColor = "#e07a5f";
                umail.value = "Password min length six characters";
            }

        });
};
