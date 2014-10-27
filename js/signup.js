/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/

"use strict";

document.addEventListener('DOMContentLoaded', function() {
    var signup = document.getElementById('signup');

    // populate the state dropdown selection
    var stateSelect = signup.elements['state'];
    var idx;
    var option;

    for (idx = 0; idx < usStates.length; ++idx) {
        option = document.createElement('option');
        option.innerHTML = usStates[idx].name;
        option.value = usStates[idx].code;
        stateSelect.appendChild(option);
    }

    // make the occupationOther input toggle its display
    var occupationSelect = signup.elements['occupation'];

    occupationSelect.addEventListener('change', function () {
        var occupationOther = document.getElementById('occupationOther');

        if (occupationSelect.value === 'other') {
            occupationOther.style.display = 'block';
        }
        else {
            occupationOther.style.display = 'none';
        }
    });

    // cancel button activity
    var cancelButton = document.getElementById('cancelButton');

    cancelButton.addEventListener('click', function() {
        if (window.confirm('If you choose to leave, I will be forced to send you to the All Knowing One. Are you sure you want to leave?')) {
            window.location = 'http://google.com';
        }
    });

    // onSubmit listener
    signup.addEventListener('submit', onSubmit);
});

function onSubmit(eventObject) {
    var valid = true;
    try {
        valid = validateForm(this);
    }
    catch(exception) {
        console.log(exception);
        valid = false; //stop form submission to see error
    }

    if (!valid && eventObject.preventDefault) {
        eventObject.preventDefault();
    }

    eventObject.returnValue = valid;
    return valid;
}

function validateForm(form) {
    var requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'birthdate'];
    var occupationSelect = form.elements['occupation'];
    if (occupationSelect.value === 'other') {
        requiredFields.push('occupationOther');
    }

    var idx;
    var formValid = true;
    for (idx = 0; idx < requiredFields.length; ++idx) {
        formValid &= validateRequiredField(form.elements[requiredFields[idx]]);
    }

    // check for valid zip
    var zipField = form.elements['zip'];
    var zipRegEx = new RegExp('^\\d{5}$');
    if (!zipRegEx.test(zipField.value)) {
        formValid = false;
        zipField.className = 'form-control invalid-field';
    }
    else {
        zipField.className = 'form-control';
    }

    // check to make sure person is at least 13 years old
    var ageField = form.elements['birthdate'];
    var dob = ageField.value;
    if (dob.trim().length > 0) {
        var today = new Date();
        dob = new Date(dob);
        var yearsDiff = today.getFullYear() - dob.getUTCFullYear();
        var monthsDiff = today.getMonth() - dob.getUTCMonth();
        var daysDiff = today.getDate() - dob.getUTCDate();

        if (monthsDiff < 0 || (0 === monthsDiff && daysDiff < 0)) {
            yearsDiff--;
        }

        var birthdateMessage = document.getElementById('birthdateMessage');
        if (yearsDiff < 13) {
            formValid = false;
            ageField.className = 'form-control invalid-field';
            birthdateMessage.innerHTML = "Sorry kiddo, gotta be at least 13 to make the poor decision of releasing your information to the world wide web."
        }
        else {
            ageField.className = 'form-control';
            birthdateMessage.innerHTML = "";
        }
    }

    return formValid;
}

// validate field
function validateRequiredField(field) {
    var value = field.value.trim();
    var valid = value.length > 0;
    if (valid) {
        field.className = 'form-control';
    }
    else {
        field.className = 'form-control invalid-field';
    }

    return valid;
}

