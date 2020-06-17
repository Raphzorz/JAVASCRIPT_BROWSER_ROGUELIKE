window.onload = function() {

    const loggedIn = (JSON.parse(sessionStorage.getItem("LoggedInUser") || "0"));

    // Changes the log in page if there is a logged in user.

    if (loggedIn !== 0) {

        document.getElementById("login-text").innerHTML = "Welcome " + loggedIn.username;
        // Removes an element from the document
        let element = document.getElementById("remove-on-login");
        element.parentNode.removeChild(element);

        const paragraph = document.createElement("h4");
        let element2 = document.getElementById("login-text");
        paragraph.classList.add("mt-5");
        element2.classList.add("mt-5");
        element2.classList.add("display-2");
        element2.appendChild(paragraph);

        const btn = document.createElement("button");       // Creating a button element
        const signOutText = document.createTextNode("Sign out and play as a different user");
        btn.appendChild(signOutText);
        // Appending the text to the button
        document.body.appendChild(btn);
        btn.classList.add("btn");
        btn.classList.add("text-center");
        btn.classList.add("btn-signout");
        btn.classList.add("mt-4");
        paragraph.appendChild(btn);

        btn.onclick = function () {
            sessionStorage.clear();
            alert("You have successfully signed out");
            location.reload();
        }
    }
};


function validateForm() {

    const userName = document.forms["myRegisterForm"]["user-name-register"].value;
    //User name must be between 3-12 characters, contain no spaces and/or special characters or numbers
    if (!(/^[a-zA-Z]{3,12}$/.test(userName))) {
        alert("Please enter a user name with no spaces, numbers or special characters. It needs to be between 3 and 12 characters in length");
        return false;
    }
    const password = document.forms["myRegisterForm"]["user-password-register"].value;
    //Minimum eight characters, at least one letter and one number:
    if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).test(password)) {
        alert("Please enter a password between with a minimum of 6 characters, at least one letter and a number ");
        return false;
    }
    const passwordConfirm = document.forms["myRegisterForm"]["confirm-password"].value;
    // Confirms that the passwords entered match
    if (passwordConfirm !== password) {
        alert("Your passwords do not match");
        return false;
    }
    const userEmail = document.forms["myRegisterForm"]["user-email"].value;
    //Confirms that it is in email format
    if (!(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{3,})$/.test(userEmail))) {
        alert("Please enter a valid email address");
        return false;
    }

    const securityQuestion = document.forms["myRegisterForm"]["register-option"].value;
    //confirms that the user has selected a question
    if (securityQuestion === "blank") {
        alert("Please select a security question");
        return false;
    }

    const securityQuestionAnswer = document.forms["myRegisterForm"]["security-question-answer"].value;
    //Confirms that the user has entered some string
    if (securityQuestionAnswer === "") {
        alert("Please answer the security question");
        return false;
    }

    const acceptedTerms = document.forms["myRegisterForm"]["checkbox-terms"].checked;
    //Confirms that the user has accepted the terms and conditions
    if (!acceptedTerms) {
        console.log(acceptedTerms);
        alert('Please accept the terms and conditions');
        return false;
    }
    // Checks whether the user is under or over 18. The user may play no matter his age. This is gathered for statistical purposes
    const userAge = document.querySelector('input[name="age"]:checked').value;

    // The registered user list is gotten from local storage if available, otherwise an empty array is created

    const registeredUserList = JSON.parse(localStorage.getItem("RegisteredUserList") || "[]");
    console.log("# of RegisteredUsers: " + registeredUserList.length);


    let i = 0;

    // If the user name or email entered is found inside of the registered user list, the registration will not go through

    for (i; i < registeredUserList.length; ++i) {
        console.log(registeredUserList[i].username);
        if (userName === registeredUserList[i].username){
            alert ("That user name is already taken. Please choose a different one");
            return false;
        }
        if (userEmail === registeredUserList[i].Email){
            alert ("That email has already been used to register. Please use a different one");
            return false;
        }
    }

    // The user is created according to data entered inside of the registration form
    const registeredUser = {'username': userName, 'password': password, 'Email': userEmail, 'securityQuestion': securityQuestion, 'Security Question Answer': securityQuestionAnswer,'Age':userAge};
    // the user is added to the list
    registeredUserList.push(registeredUser);
    // The list is put inside of local storage once again
    localStorage.setItem('RegisteredUserList', JSON.stringify(registeredUserList));

    alert("Welcome " + registeredUser.username+ ". You have successfully registered");
}

//Login validation from here downwards

function validateLogin() {

    // Retrieving the object from storage

    const logInName = document.forms["myLoginForm"]["user-login"].value;

    const logInPassword = document.forms["myLoginForm"]["user-login-password"].value;

    const RegisteredUserList = JSON.parse(localStorage.getItem("RegisteredUserList") || "[]");

    // checks whether the user has entered a user name
    if (logInName === ""){
        alert("Please enter your username before proceeding");
        return false;
    }
    // checks whether the user has entered a password
    if (logInPassword === ""){
        alert("Please enter your password before proceeding");
        return false;
    }

    // Checks whether the password and username match those of one of the registered users inside of the registered userlist
    if ((logInPassword !== "") && (logInName !== "")) {
        console.log("Checking for users");
        let i = 0;

        for (i; i < RegisteredUserList.length; ++i) {

            if ((RegisteredUserList[i].username === logInName) && (RegisteredUserList[i].password === logInPassword)) {
                alert("congrats you have logged in");

                let loggedInUser = {'username': logInName};

                // Putting the logged in user into session storage
                sessionStorage.setItem('LoggedInUser', JSON.stringify(loggedInUser));

                return true;
            }
        }
        alert("Oops..we cannot match your details..are you sure those are your username & password?")
        return false;
    }
}




