const answers = document.querySelectorAll('.radio-btn');
const options = document.querySelectorAll('.options');

answers.forEach((answer, index) => {
  const option = Array.from(options);
  answer.addEventListener('change', (event) => {
    if (answer.checked) {
      answer.value = option[index].value;
    }
  });
});

options.forEach((option, index) => {
  const answer = Array.from(answers);
  option.addEventListener('input', (event) => {
    if (answer[index].checked) {
      answer[index].value = option.value;
    }
  });
});