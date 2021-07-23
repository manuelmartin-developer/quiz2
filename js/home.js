// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyD0JUkcZ1Mc_4Zosd5NEovRGIRb8kazqhU",
    authDomain: "quiz-40bb7.firebaseapp.com",
    projectId: "quiz-40bb7",
    storageBucket: "quiz-40bb7.appspot.com",
    messagingSenderId: "807178413256",
    appId: "1:807178413256:web:da86fc8f061577a2bcb1fd"
};
// Init Firebase
firebase.initializeApp(firebaseConfig);
// Init Data Base
let db = firebase.firestore();

//Cheking if user is already logged in
let loggedUser = sessionStorage.getItem("user");

let signInHead = document.querySelector("#signInHead");
let signUpBtn = document.querySelector('#signUpHead');
let logOutBtn = document.querySelector('#logOutHead');

if (loggedUser) {
    signInHead.style.display = 'none';
    signUpHead.style.display = 'none';
    logOutBtn.style.display = 'block';
}
// Getting the scores from firebase
let userLogged = sessionStorage.getItem("user");
let labelStats = document.querySelector("#labelStats");

if (userLogged != null) {
    db
        .collection("users").where("email", "==", userLogged)
        .get()
        .then((querySnapshot) => {
            let user = querySnapshot.docs[0];
            let scores = user.data().scores;
            let dates = [];
            let firebaseScores = [];
            for (let score of scores) {
                dates.push(Object.keys(score));
                firebaseScores.push(parseInt(Object.values(score)));
            };


            /**********************  STATS CHART *********************/

            var ctx = document.getElementById('statsChart');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Scores',
                        data: firebaseScores,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
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
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            min: 0,
                            max: 10
                        }
                    }
                }
            });

        });
}




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
let modalSignUp = document.getElementById('signup');
signUpBtn.addEventListener(("click"), () => {
    modalSignUp.style.display = 'block'

});
let modalSignIn = document.getElementById('login');
let signInBtn = document.getElementById('signInHead');
signInBtn.addEventListener(("click"), () => {
    modalSignIn.style.display = 'block'

});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modalSignUp) {
        modalSignUp.style.display = "none";
    } else if (event.target == modalSignIn) {
        modalSignIn.style.display = "none";
    };
}
//Cancel buttons
let cancelBtnSu = document.querySelector(".cancelSignUp");
cancelBtnSu.addEventListener("click", () => {
    modalSignUp.style.display = 'none'
});
let cancelBtnSi = document.querySelector(".cancelSignIn");
cancelBtnSi.addEventListener("click", () => {
    modalSignIn.style.display = 'none'
});


//Sign Up Button
let signupBtn = document.querySelector(".signupbtn");
signupBtn.addEventListener("click", () => {
    signUp();
});
//Sign In Button
let loginBtn = document.querySelector(".loginbtn");

loginBtn.addEventListener("click", () => {
    signIn();
});

// Log out button
logOutBtn.addEventListener("click", () => {
    logOut();
});

/************************* FIREBASE DATABASE **********************/

// Add a user to db
const createUser = (email, password) => {
    db
        .collection("users")
        .add({
            email: email,
            password: password,
            scores: []
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
};

// Authenticate an user
const signUp = () => {
    let umail = document.querySelector("#umail");
    let umailText = umail.value;
    let psw = document.querySelector("#psw");
    let pswText = psw.value;
    let alerts = document.querySelector("#alert");
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (umailText.length == 0 || pswText.length == 0) {
        umail.style.backgroundColor = "#f2cc8f";
        psw.style.backgroundColor = "#f2cc8f";
        alerts.innerHTML = 'You must fill in two inputs';

    } else if (!umailText.match(regexEmail) && pswText.length < 6) {
        umail.style.backgroundColor = "#e07a5f";
        psw.style.backgroundColor = "#e07a5f";
        alerts.innerHTML = `Email is not valid
        Password must be min 6 characters`;
    } else if (!umailText.match(regexEmail)) {
        umail.style.backgroundColor = "#e07a5f";
        alerts.innerHTML = 'Email is not valid';
        psw.style.backgroundColor = "#f4f1de";

    } else if (pswText.length < 6) {
        psw.style.backgroundColor = "#e07a5f";
        alerts.innerHTML = 'Password must be min 6 characters';
        umail.style.backgroundColor = "#f4f1de";

    } else if (umailText.match(regexEmail) && pswText.length > 6) {
        umail.style.backgroundColor = "#81b29a";
        psw.style.backgroundColor = "#81b29a";
        alerts.innerHTML = '';

        firebase.auth()
            .createUserWithEmailAndPassword(umailText, pswText)
            .then((userCredential) => {
                createUser(umailText, pswText);
                document.getElementById('signup').style.display = 'none'
                signupBtn.style.display = 'none';

            })
            .catch((error) => {
                umail.style.backgroundColor = "#e07a5f";
                alerts.innerHTML = error.code;
            });

    }
};

const signIn = () => {
    let umail = document.querySelector("#loginmail");
    let umailText = umail.value;
    let psw = document.querySelector("#loginpsw");
    let pswText = psw.value;
    let alerts = document.querySelector("#alertLogin");
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (umailText.length == 0 || pswText.length == 0) {
        umail.style.backgroundColor = "#e07a5f";
        psw.style.backgroundColor = "#e07a5f";
        alerts.innerHTML = 'You must fill in two inputs';

    } else if (!umailText.match(regexEmail) && pswText.length < 6) {
        umail.style.backgroundColor = "#e07a5f";
        psw.style.backgroundColor = "#e07a5f";
        alerts.innerHTML = `Email is not valid
        Password must be min 6 characters`;
    } else if (!umailText.match(regexEmail)) {
        umail.style.backgroundColor = "#e07a5f";
        alerts.innerHTML = 'Email is not valid';
        psw.style.backgroundColor = "#f4f1de";

    } else if (pswText.length < 6) {
        psw.style.backgroundColor = "#e07a5f";
        alerts.innerHTML = 'Password must be min 6 characters';
        umail.style.backgroundColor = "#f4f1de";

    } else if (umailText.match(regexEmail) && pswText.length > 6) {
        umail.style.backgroundColor = "#f4f1de";
        psw.style.backgroundColor = "#f4f1de";
        alerts.innerHTML = '';

        firebase.auth().signInWithEmailAndPassword(umailText, pswText)
            .then((userCredential) => {

                let user = userCredential.user.email;
                console.log(user);
                sessionStorage.setItem("user", user);
                document.getElementById('login').style.display = 'none'
                signUpHead.style.display = 'none';
                signInHead.style.display = 'none';
                logOutBtn.style.display = 'block';
                labelStats.style.visibility = 'hidden';
                location.reload();

            })
            .catch((error) => {
                let errorCode = error.code;
                if (errorCode == 'auth/user-not-found') {
                    umail.style.backgroundColor = "#e07a5f";
                    alerts.innerHTML = 'This email is not registered';

                } else if (errorCode == 'auth/wrong-password') {

                    psw.style.backgroundColor = "#e07a5f";
                    alerts.innerHTML = 'The password is invalid';
                }
            });
    }

};

const logOut = () => {
    let user = firebase.auth().currentUser;
    firebase.auth().signOut().then(() => {
        logOutBtn.style.display = 'none';
        signUpHead.style.display = 'block';
        signInHead.style.display = 'block';
        sessionStorage.clear();
        labelStats.style.visibility = 'visible';
        location.reload();

    }).catch((error) => {
        console.log(`Error: ${error.code}`);
    });
};