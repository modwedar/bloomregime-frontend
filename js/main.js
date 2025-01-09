window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("sticky");
        navbar.classList.add("px-3");
    } else {
        navbar.classList.remove("sticky");
        navbar.classList.remove("px-3");
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const countryOptions = document.querySelectorAll('.country-option');
    const btnCountry = document.getElementById('btn-country');
    const btnCc = btnCountry.querySelector('.btn-cc');
    const flagSpan = btnCountry.querySelector('.fi');
    const phoneNumberInput = document.getElementById('phone-number');
    const signUpNextButton = document.getElementById('signup-next');
    const otpNextButton = document.getElementById('otp-next');
    const OTPContainer = document.querySelector("#otp-input");
    const OTPValueContainer = document.querySelector("#otp-value");
    const timerElement = document.getElementById('timer');
    const otpModal = document.getElementById('otpModal');

    countryOptions.forEach(option => {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            const code = this.getAttribute('data-code');
            const flag = this.getAttribute('data-flag');

            // Update the button text and flag
            btnCc.textContent = `${code}+`;
            flagSpan.className = `fi ${flag} fis`;

            // Update the input field placeholder with the new country code
            phoneNumberInput.placeholder = `${code}${phoneNumberInput.placeholder}`;
        });
    });

    signUpNextButton.addEventListener('click', function(e) {
        e.preventDefault();

        const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        signupModal.hide();

        const modal = new bootstrap.Modal(document.getElementById('otpModal'));
        modal.show();
    });

    otpNextButton.addEventListener('click', function(e) {
        e.preventDefault();

        const otpModal = bootstrap.Modal.getInstance(document.getElementById('otpModal'));
        otpModal.hide();

        const modal = new bootstrap.Modal(document.getElementById('doneModal'));
        modal.show();

        setTimeout(function() {
            window.location.href = '/followups.html';
        }, 2000);
    });

    const firstInput = OTPContainer.querySelector(".font-h2-strong");
    firstInput.focus();

    otpModal.addEventListener('show.bs.modal', function () {
        let timeLeft = 59;
        timerElement.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;

        const timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerElement.textContent = "00:00";
            }
        }, 1000);
    });


    // OTP Logic
    const updateValue = (inputs) => {
        OTPValueContainer.value = Array.from(inputs).reduce((acc, curInput) => acc.concat(curInput.value ? curInput.value : "*"), "");
    };

    const isValidInput = (inputValue) => {
        return Number(inputValue) === 0 && inputValue !== "0" ? false : true;
    };

    const setInputValue = (inputElement, inputValue) => {
        inputElement.value = inputValue;
    };

    const resetInput = (inputElement) => {
        setInputValue(inputElement, "");
    };

    const focusNext = (inputs, curIndex) => {
        const nextElement = curIndex < inputs.length - 1 ? inputs[curIndex + 1] : inputs[curIndex];

        nextElement.focus();
        nextElement.select();
    };

    const focusPrev = (inputs, curIndex) => {
        const prevElement = curIndex > 0 ? inputs[curIndex - 1] : inputs[curIndex];

        prevElement.focus();
        prevElement.select();
    };

    const focusIndex = (inputs, index) => {
        const element = index < inputs.length - 1 ? inputs[index] : inputs[inputs.length - 1];

        element.focus();
        element.select();
    };

    const handleValidMultiInput = (inputElement, inputValue, curIndex, inputs) => {
        const inputLength = inputValue.length;
        const numInputs = inputs.length;

        const endIndex = Math.min(curIndex + inputLength - 1, numInputs - 1);
        const inputsToChange = Array.from(inputs).slice(curIndex, endIndex + 1);
        inputsToChange.forEach((input, index) => setInputValue(input, inputValue[index]));
        focusIndex(inputs, endIndex);
    };

    const handleInput = (inputElement, inputValue, curIndex, inputs) => {
        if (!isValidInput(inputValue)) return handleInvalidInput(inputElement);
        if (inputValue.length === 1) handleValidSingleInput(inputElement, inputValue, curIndex, inputs);
        else handleValidMultiInput(inputElement, inputValue, curIndex, inputs);
    };

    const handleValidSingleInput = (inputElement, inputValue, curIndex, inputs) => {
        setInputValue(inputElement, inputValue.slice(-1));
        focusNext(inputs, curIndex);
    };

    const handleInvalidInput = (inputElement) => {
        resetInput(inputElement);
    };

    const handleKeyDown = (event, key, inputElement, curIndex, inputs) => {
        if (key === "Delete") {
            resetInput(inputElement);
            focusPrev(inputs, curIndex);
        }
        if (key === "ArrowLeft") {
            event.preventDefault();
            focusPrev(inputs, curIndex);
        }
        if (key === "ArrowRight") {
            event.preventDefault();
            focusNext(inputs, curIndex);
        }
    };
    const handleKeyUp = (event, key, inputElement, curIndex, inputs) => {
        if (key === "Backspace") focusPrev(inputs, curIndex);
    };

    const inputs = OTPContainer.querySelectorAll("input:not(#otp-value)");
    inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => handleInput(input, e.target.value, index, inputs));

        input.addEventListener("keydown", (e) => handleKeyDown(e, e.key, input, index, inputs));

        input.addEventListener("keyup", (e) => handleKeyUp(e, e.key, input, index, inputs));

        input.addEventListener("focus", (e) => e.target.select());
    });
});