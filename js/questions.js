/***********************************************************/
(async () => {

    try {

        let fetchQuestions = await fetch('https://opentdb.com/api.php?amount=50&type=multiple')
        let response = await fetchQuestions.json();
        let questions = response.results;

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

        //         /*******************  QUESTIONS *******************/
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

            question.innerHTML = currentQuestion;


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

    } catch (error) {
        console.log(`Error: ${error}`);
    }

})();