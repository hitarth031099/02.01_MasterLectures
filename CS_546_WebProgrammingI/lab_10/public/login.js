let loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let flag = true;

        let inputs = { "username": "", "password": "" };

        for (let key in inputs) {
            let input = document.getElementById(key + 'Input');
            if (!(inputs[key] = check(input.value, key))) {
                flag = false;

                input.value = "";
                let inputLabel = document.getElementById(key + 'Label');
                inputLabel.className='error';
                let inputErrorDiv = document.getElementById(key + 'ErrorDiv');
                inputErrorDiv.hidden = false;
            }else{
                let inputLabel = document.getElementById(key + 'Label');
                inputLabel.classList.remove('error');
                let inputErrorDiv = document.getElementById(key + 'ErrorDiv');
                inputErrorDiv.hidden = true;
            }
        }

        if (flag) {
            window.location.replace("/login");
        }
    });
}
