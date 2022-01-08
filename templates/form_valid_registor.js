let userName = document.getElementById("userName")
let password = document.getElementById("Password")
let date = document.getElementById("date")
let errorMessageUserName = document.getElementById("username-message")
let errorMessagePassword = document.getElementById("password-message")
let errorMessageDate = document.getElementById("date-message")
let registerMessage = document.getElementById('date-message')
let successfulMessage = document.getElementById('signinFrm')
let success = document.getElementById('success')


document.getElementById("submit")
    .addEventListener("click", (event) => {
        event.preventDefault()
        console.log('validate form started')
        validateForm()
        console.log('validate form ended')

        fetch("http://127.0.0.1:5000/registor", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ name: userName.value, password: password.value, day: date.value })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data['message'] == 'you are already have an account') {
                    setRegisterMessage(data['message'])
                }

                if (data['message'] == 'welcome, you are registered') {
                    document.location.href = 'registered.html'


                }
            })
    })

function validateForm() {
    let reg_name = /^[A-Za-z]+[A-Za-z0-9 _]*$/;
    let reg_date = /^2021-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0])$/;

    if (userName.value == "") {
        setUserNameError("user name must not be empty");
    } else if (!reg_name.test(userName.value)) {
        setUserNameError("name should start with letter");
    }
    if (password.value == "") {
        setPasswordError("password must not be empty");
    }
    if (date.value == "") {
        setDateError("date must not be empty")
    } else if (!reg_date.test(date.value)) {
        setDateError("enter valid date formate")
    }
    console.log('validate')
}

function setUserNameError(message) {
    if (message) {
        errorMessageUserName.style.visibility = "visible";
        errorMessageUserName.style.color = "red";
        errorMessageUserName.innerText = message
    } else {
        errorMessageUserName.style.visibility = "hidden";
        errorMessageUserName.innerText = ""
    }
}

function setPasswordError(message) {
    if (message) {
        errorMessagePassword.style.visibility = "visible"
        errorMessagePassword.style.color = "red"
        errorMessagePassword.innerText = message
    } else {
        errorMessagePassword.style.visibility = "hidden"
        errorMessagePassword.innerText = message
    }
}

function setDateError(message) {
    if (message) {
        errorMessageDate.style.visibility = "visible"
        errorMessageDate.style.color = "red"
        errorMessageDate.innerText = message
    } else {
        errorMessageDate.style.visibility = "hidden"
        errorMessageDate.innerText = message
    }
}

function setRegisterMessage(message) {
    registerMessage.style.visibility = 'visible'
    registerMessage.style.color = 'green'
    registerMessage.innerText = message
}