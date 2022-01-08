let userName = document.getElementById("txtUserName");
let password = document.getElementById("txtPwd");

let passwordErrorMessage = document.getElementById("password-message");
let usernameErrorMessage = document.getElementById("username-message");


document.getElementById("submit")
    .addEventListener("click", (event) => {
        event.preventDefault()
        validateForm(event)
        console.log('hiiiiiiiii')
        fetch(" http://127.0.0.1:5000/login", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ name: userName.value, password: password.value })
            })
            .then(response => response.json())
            .then(function(data) {
                console.log(data)
                console.log(data['message'])
                console.log(data['message'] == 'your not registered')
                console.log(data['message'] == 'welcome to time and weather service')
                if (data['message'] == 'your not registered') {
                    setLoginMessage(data['message'])
                }

                if (data['message'] == 'welcome to time and weather service') {
                    document.location.href = 'reminder.html'
                }
            })
    });

function validateForm(event) {
    let reg_name = /^[A-Za-z]+[A-Za-z0-9]*$/;

    if (userName.value == "" || userName.value == null) {
        setUsernameError("Username must not be empty");
    } else if (!reg_name.test(userName.value)) {
        setUsernameError("name should only starts with letter");
    } else {
        setUsernameError("");
    }

    if (password.value == "" || password.value == null) {
        setPasswordError("Password must not be empty");

    } else {
        setPasswordError("");
    }
}


function setUsernameError(message) {
    if (message) {
        usernameErrorMessage.style.visibility = "visible";
        usernameErrorMessage.style.color = "red";
        usernameErrorMessage.innerText = message;
    } else {
        usernameErrorMessage.style.visibility = "hidden";
        usernameErrorMessage.innerText = "";
    }
}

function setPasswordError(message) {
    if (message) {
        passwordErrorMessage.style.visibility = "visible";
        passwordErrorMessage.style.color = "red";
        passwordErrorMessage.innerText = message;
    } else {
        passwordErrorMessage.style.visibility = "hidden";
        passwordErrorMessage.innerText = "";
    }
}

function setLoginMessage(message) {
    passwordErrorMessage.style.visibility = "visible";
    passwordErrorMessage.style.color = "green";
    passwordErrorMessage.innerText = message;

}