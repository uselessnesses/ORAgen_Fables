// script.js
let currentQuestion = 0;

const questions = [
    "You have selected the Role of Generate Backstory. \n Does this role sound appealing to you? \n Press confirm to reserve/claim this role",
    "Based on your chosen role, write your FableBit to carry on from where the FableThread left off",
    "Your FableBit story is {userFableBit} \n What will the Title of your FableBit be?",
    "Summary of your inputs:" // This will be dynamically filled based on previous answers
];


const answers = Array(questions.length);

document.getElementById('openPopup').addEventListener('click', function() {
    document.getElementById('questionPopup').style.display = 'block';
    currentQuestion = 0;
    displayQuestion();
});

document.getElementsByClassName('close')[0].addEventListener('click', function() {
    document.getElementById('questionPopup').style.display = 'none';
});

document.getElementById('nextQuestion').addEventListener('click', function() {
    if (currentQuestion === 0 && document.getElementById('answerInput').style.display === 'none') {
        // Move to the next question without saving any empty answer from question 1
        currentQuestion++;
        displayQuestion();
    } else {
        saveAnswer();
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            displayQuestion();
        } else {
            document.getElementById('questionPopup').style.display = 'none';
            console.log('Completed Answers:', answers);
        }
    }
});

document.getElementById('prevQuestion').addEventListener('click', function() {
    if (currentQuestion > 0) {
        saveAnswer();
        currentQuestion--;
        displayQuestion();
    }
});

// Handling input for enter key in input field to switch questions based on the context
document.getElementById('answerInput').addEventListener('input', function() {
    document.getElementById('nextQuestion').disabled = !document.getElementById('answerInput').value.trim();
});

function displayQuestion() {
    let questionText = questions[currentQuestion];

    if (currentQuestion === 2 && answers[1]) {
        questionText = questionText.replace("{userFableBit}", `"${answers[1]}"`);
    } else if (currentQuestion === 3) {
        let rolesSelected = answers[2] && answers[2].roles ? answers[2].roles.join(", ") : "None";
        questionText += `\n\n1. Role Appeal: ${answers[0] || "Not answered"}\n\n2. Your FableBit: ${answers[1] || "Not answered"}\n\n3. Title of your FableBit: ${answers[2] ? answers[2].text : "Not answered"}\n\nSelected Roles: ${rolesSelected}`;
    } else {
        questionText = questionText.replace("{userFableBit}", "");
    }

    document.getElementById('questionText').textContent = questionText;

    if (currentQuestion === 0 || currentQuestion === 3) {
        document.getElementById('answerInput').style.display = 'none';
        document.getElementById('toggleContainer').style.display = 'none';
        document.getElementById('nextQuestion').disabled = false;
    } else {
        document.getElementById('answerInput').style.display = 'inline-block';
        document.getElementById('answerInput').value = answers[currentQuestion] || '';
        document.getElementById('nextQuestion').disabled = !document.getElementById('answerInput').value.trim();
    }

    if (currentQuestion === 2) {
        document.getElementById('toggleContainer').style.display = 'block';
    } else {
        document.getElementById('toggleContainer').style.display = 'none';
    }

    document.getElementById('nextQuestion').textContent = (currentQuestion === questions.length - 1) ? 'Finish' : 'Confirm';
    document.getElementById('prevQuestion').style.display = (currentQuestion > 0) ? 'inline-block' : 'none';
}



document.addEventListener('DOMContentLoaded', function() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"][name="role"]');
    var limit = 3;

    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function() {
            var checkedCount = Array.from(checkboxes).filter(el => el.checked).length;
            if (checkedCount >= limit) {
                // Disable all unchecked checkboxes
                Array.from(checkboxes).forEach(function(el) {
                    if (!el.checked) {
                        el.disabled = true;
                    }
                });
            } else {
                // Enable all checkboxes
                Array.from(checkboxes).forEach(function(el) {
                    el.disabled = false;
                });
            }
        });
    }
});


function saveAnswer() {
    if(document.getElementById('answerInput').style.display !== 'none') {
        answers[currentQuestion] = document.getElementById('answerInput').value;
    }
    if (currentQuestion === 2) {
        answers[currentQuestion] = {
            text: answers[currentQuestion],
            roles: [...document.querySelectorAll('input[name="role"]:checked')].map(el => el.value)
        };
    }
}
