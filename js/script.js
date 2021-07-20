
/**********************  STATS CHART *********************/
const dates = [];
const scores = [];
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    dates.push(key);
    scores.push(value);
}


if (document.title === "Home") {

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
                x:{
                    title: {
                        color: 'red',
                        display: true,
                        text: 'Day'
                      }
                }
            }
        }
    });
}
/***********************************************************/
(async () => {

    try {

        let fetchQuestions = await fetch('https://opentdb.com/api.php?amount=50&type=multiple')
        let response = await fetchQuestions.json();
        let questions = response.results;
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
        /*******************  SET SCORE *******************/

        const setScore = () => {

            const ssPermitted = () => {
                let currentScore = sessionStorage.getItem("tryScore");
                currentScore++;
                sessionStorage.setItem("tryScore", currentScore);
            };
            const ssForbidden = () => console.log("Tu browser no acepta webStorage :(");

            typeof (Storage) !== undefined ? ssPermitted() : ssForbidden();
        };

        /*******************  QUESTIONS *******************/
        // Check number of Question

        const checkNumberQuestion = () => {
            const ssPermitted = () => {
                let questionNumber = sessionStorage.getItem("questionNumber");
                questionNumber++;
                sessionStorage.setItem("questionNumber", questionNumber);
                if (questionNumber === 10) {
                    setTimeout(() => {
                        window.open('results.html', '_self')
                    }, 3000);
                } else {
                    setTimeout(() => {
                        location.reload()
                    }, 3000);
                }
            };
            const ssForbidden = () => console.log("Tu browser no acepta webStorage :(");

            typeof (Storage) !== undefined ? ssPermitted() : ssForbidden();
        };

        const paintQuestion = () => {
            // Selecting DOM Objects
            const question = document.querySelector("#question");
            const answers = document.querySelectorAll(".answer")
            const buttons = document.querySelectorAll(".button");

            // Random Question
            currentCategory = sessionStorage.getItem("category");
            const categoryQuestions = questions.filter(question => question.category.startsWith(currentCategory));
            const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];
            const currentQuestion = randomQuestion.question;
            const currentAnswers = randomQuestion.incorrect_answers;
            const correctAnswer = randomQuestion.correct_answer;
            // Shuffle the correct answer
            let allAnswers = currentAnswers.concat(correctAnswer);
            allAnswers = allAnswers.sort(() => Math.random() - 0.5);

            // Painting Question in HTML
            if (document.title == "Quiz") {
                question.innerHTML = currentQuestion;
            };

            // Painting Answers in HTML

            for (let i = 0; i < answers.length; i++) {
                answers[i].innerHTML = allAnswers[i];
                let currentButton = buttons[i];
                currentButton.addEventListener("click", function () {
                    //! PENDING OF REFACTOR
                    if (currentButton.textContent === correctAnswer) {
                        currentButton.style.backgroundColor = "#38b000";
                        setScore();
                        disableButtons();
                        hightlightCorrect();
                        checkNumberQuestion();

                    } else {
                        currentButton.style.backgroundColor = "#e71d36";
                        disableButtons();
                        hightlightCorrect();
                        checkNumberQuestion();
                    }
                    //! PENDING OF REFACTOR
                });
            };
            // Disable buttons

            const disableButtons = () => {

                for (let button of buttons) {
                    button.disabled = true
                    button.style.webkitFilter = "blur(6px)"
                    button.style.boxShadow = "none";
                }
            };
            // Highlight correct answer

            const hightlightCorrect = () => {

                for (let button of buttons) {
                    if (button.textContent === correctAnswer) {
                        button.style.webkitFilter = "blur(0px)";
                        button.style.fontWeight = "bold";
                    };
                };
            };

        };
        paintQuestion();
        setTryScore();

    } catch (error) {
        console.log(`Error: ${error}`);
    }

})();


// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}






const setTryScore = () => {

    if (document.title == "Results") {

        
        // Setting score
        let sessionScore = sessionStorage.getItem("tryScore");
        
        let scoreTitle = document.querySelector("#sessionScore");
        scoreTitle.innerHTML = `${sessionScore}/10`
        let today = new Date();
        let date = today.getDate() + '-' + (today.getMonth() + 1)
        localStorage.setItem(date, sessionScore);
        sessionStorage.clear();
    }

};


