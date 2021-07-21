// Setting score
let sessionScore = sessionStorage.getItem("tryScore");

let scoreTitle = document.querySelector("#sessionScore");
scoreTitle.innerHTML = `${sessionScore}/10`
let today = new Date();
let date = today.getDate() + '-' + (today.getMonth() + 1)
localStorage.setItem(date, sessionScore);
sessionStorage.clear();