let myForm = document.getElementById('myForm');
let textInput = document.getElementById('text_input');
let errorDiv = document.getElementById('error');
let myOl = document.getElementById('attempts');
let formLabel = document.getElementById('formLabel');

if (myForm) {
    myForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (textInput.value.trim()) {
            errorDiv.hidden = true;
            formLabel.classList.remove('error');

            let li = document.createElement('li');
            li.innerHTML = textInput.value;
            if (check(textInput.value)) {
                li.classList.add('is-palindrome');
            } else {
                li.classList.add('not-palindrome');
            }
            myOl.appendChild(li);
            myForm.reset();
            textInput.focus();
        } else {
            textInput.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a value';
            formLabel.className = 'error';
            textInput.focus();
        }
    });
}

function check(input) {
    input = input.toLowerCase();
    input = input.match(/[a-z0-9]+/g).join("");
    let head = 0, end = input.length - 1;
    while (end > head) {
        if (input[head] != input[end]) {
            return false;
        }
        head++;
        end--;
    }
    return true;
}