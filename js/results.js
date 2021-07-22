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


// Session Storage

let sessionScore = sessionStorage.getItem("tryScore");
let userLogged = sessionStorage.getItem("user");
let scoreTitle = document.querySelector("#sessionScore");
scoreTitle.innerHTML = `${sessionScore}/10`

db
    .collection("users").where("email", "==", userLogged)
    .get()
    .then((querySnapshot) => {

        let today = new Date();
        let date = today.getDate() + '-' + (today.getMonth() + 1);

        let user = querySnapshot.docs[0];
        let data = user.data();
        user.ref.update({
            scores:
            firebase.firestore.FieldValue.arrayUnion({[date]: sessionScore})
        });
        console.log(data);

     

    })
    .catch((error) => {
        console.log("Error", error);
    });


sessionStorage.removeItem("tryScore");
sessionStorage.removeItem("category");
sessionStorage.removeItem("questionNumber");