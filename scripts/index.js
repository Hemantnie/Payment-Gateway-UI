function Emitter() {
    this.event = {};
}

Emitter.prototype.emit = function (eventName) {

    const listOfFunction = this.event.eventName || [];

    listOfFunction.forEach(callback => {
        callback();
    });
}

Emitter.prototype.on = function (eventName, callback) {
    this.event.eventName = this.event.eventName || [];
    this.event.eventName.push(callback)
}

class Card {
    constructor(cardNumber, cvv, expireyDate) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.expireyDate = expireyDate;
    }
}

class UI {
    addCardTolist(card) {
        const list = document.getElementById('card-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" class="delete">X<a></td>
            <td>${card.cardNumber}</td>
            <td>${card.cvv}</td>
            <td>${card.expireyDate}</td>
        `;

        list.appendChild(row);
    }

    deleteCard(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('card_number').value = '';
        document.getElementById('cvv').value = '';
        document.getElementById('ex_date').value = '';
    }

    showAlert(message, className) {
        const div = document.createElement('div');

        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.my-container');
        const form = document.querySelector('#card-deatils');
        container.insertBefore(div, form);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }


}

//Local Storeage for card deatils

class Store {
    static getCards() {
        let cards;
        if (localStorage.getItem('cards') === null) {
            cards = [];
        } else {
            cards = JSON.parse(localStorage.getItem('cards'))
        }

        return cards;
    }

    static displayCards() {
        const cards = Store.getCards();

        cards.forEach(function (card) {
            const ui = new UI;
            ui.addCardTolist(card);
        })
    }

    static addCard(card) {
        const cards = Store.getCards();

        cards.forEach(function (card1, index) {
            if (card1.cardNumber === card.cardNumber) {
                return false;
            }
        })
        cards.push(card);
        localStorage.setItem('cards', JSON.stringify(cards));
        return true;
    }

    static removeCard(cardNumber) {
        const cards = Store.getCards();

        cards.forEach(function (card, index) {
            if (card.cardNumber === cardNumber) {
                cards.splice(index, 1);
            }
        })

        localStorage.setItem('cards', JSON.stringify(cards));
    }
}

document.addEventListener('DOMContentLoaded', Store.displayCards());


//Adding event listers for few events

const emitter = new Emitter();

emitter.on('cardNumberIsFilled', () => {
    document.getElementById('cvv').disabled = true
    document.getElementById('ex_date').disabled = true
})

emitter.on('cardNumberIsEmpty', () => {
    document.getElementById('cvv').disabled = true
    document.getElementById('ex_date').disabled = true
})

const hasError = function (field) {
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;
    var validity = field.validity;

    if (validity.valid) return;

    if (validity.valueMissing) return 'Please fill out this field.';
    if (validity.typeMismatch) return 'Please use the correct input type.';
    if (validity.tooShort) return 'Please lengthen this text.';
    if (validity.tooLong) return 'Please shorten this text.';
    if (validity.badInput) return 'Please enter a number.';
    if (validity.stepMismatch) return 'Please select a valid value.';
    if (validity.patternMismatch) return 'Please match the requested format.';
    return 'The value you entered for this field is invalid.';
}

document.addEventListener('blur', function (event) {

    // Only run if the field is in a form to be validated
    if (!event.target.form.classList.contains('validate')) return;

    // Validate the field
    const error = hasError(event.target);
    console.log(error);

}, true);

const acceptedCreditCards = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
    diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/
};


function validateCard(value) {
    // remove all non digit characters
    var value = value.replace(/\D/g, '');
    var sum = 0;
    var shouldDouble = false;
    // loop through values starting at the rightmost side
    for (var i = value.length - 1; i >= 0; i--) {
        var digit = parseInt(value.charAt(i));

        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    var valid = (sum % 10) == 0;
    var accepted = false;

    // loop through the keys (visa, mastercard, amex, etc.)
    Object.keys(acceptedCreditCards).forEach(function (key) {
        var regex = acceptedCreditCards[key];
        if (regex.test(value)) {
            accepted = true;
        }
    });

    return valid && accepted;
}

function validateCVV(creditCard, cvv) {
    // remove all non digit characters
    var creditCard = creditCard.replace(/\D/g, '');
    var cvv = cvv.replace(/\D/g, '');
    // american express and cvv is 4 digits
    if ((acceptedCreditCards.amex).test(creditCard)) {
        if ((/^\d{4}$/).test(cvv))
            return true;
    } else if ((/^\d{3}$/).test(cvv)) { // other card & cvv is 3 digits
        return true;
    }
    return false;
}

function checkLuhn(value) {
    // remove all non digit characters
    var value = value.replace(/\D/g, '');
    var sum = 0;
    var shouldDouble = false;
    // loop through values starting at the rightmost side
    for (var i = value.length - 1; i >= 0; i--) {
        var digit = parseInt(value.charAt(i));

        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) == 0;
}

function getCreditCardType(cardNumber) {

    //start without knowing the credit card type
    var result = "unknown";

    //first check for MasterCard
    if (/^5[1-5]/.test(cardNumber)) {
        result = "mastercard";
    }

    //then check for Visa
    else if (/^4/.test(cardNumber)) {
        result = "visa";
    }

    //then check for AmEx
    else if (/^3[47]/.test(cardNumber)) {
        result = "amex";
    }

    return result;
}

function handleCardEvent(event) {
    var cardNumber = event.target.value,
        type = getCreditCardType(cardNumber);

    console.log(type);

    if (cardNumber.length > 0) {
        document.getElementById('cvv').disabled = false;
        document.getElementById('ex_date').disabled = false;
    } else {
        document.getElementById('cvv').disabled = true;
        document.getElementById('ex_date').disabled = true;
    }
    const icon = document.getElementById("cardTypeIcon");
    icon.classList = [];
    icon.classList.add("fa");
    // document.getElementById("card_number").classList.add('invalid')
    switch (type) {
        case "mastercard":
            //show MasterCard icon
            icon.classList.add("fa-cc-mastercard");
            break;

        case "visa":
            //show Visa icon
            icon.classList.add("fa-cc-visa");
            break;

        case "amex":
            //show American Express icon
            icon.classList.add("fa-cc-amex");
            break;

        default:
            return document.getElementById("card_number").classList.add('invalid');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var textbox = document.getElementById("card_number");
    textbox.addEventListener("keyup", handleCardEvent, false);
    textbox.addEventListener("blur", handleCardEvent, false);
}, false);

function validateExpiryDate(expireyDate) {
    console.log(expireyDate);
    expireyDate = expireyDate + "-01";
    const date = new Date(expireyDate);
    if (date - new Date() < 0) {
        return false;
    }
    return true;
}

//eventlister for add card
document.getElementById('card-deatils').addEventListener('submit',
    function (e) {
        const cardNumber = document.getElementById('card_number').value;
        const cvv = document.getElementById('cvv').value;
        const expireyDate = document.getElementById('ex_date').value;

        const card = new Card(cardNumber, cvv, expireyDate);

        const ui = new UI();

        if (cardNumber === '' || !validateCard(cardNumber)) {
            ui.showAlert('Please fill in the valid card number', 'error');
        } else if (!validateCVV(cardNumber, cvv)) {
            ui.showAlert('Please fill in the valid cvv number', 'error');
        } else if (!validateExpiryDate(expireyDate)) {
            ui.showAlert('Please fill in the valid expiry date', 'error');
        } else {

            if (Store.addCard(card)) {
                ui.showAlert('Duplicate card Number', 'error');
            } else {
                ui.addCardTolist(card);
                ui.showAlert('Card Added!', 'success');
                ui.clearFields();
            }

        }
        e.preventDefault();
    }
);

document.getElementById('clear-button').addEventListener('click',
    function (e) {
        const ui = new UI();
        ui.clearFields();
        e.preventDefault();
    }
);

document.getElementById('card-list').addEventListener('click',
    function (e) {
        const ui = new UI();

        ui.deleteCard(e.target);

        // Remove from LS
        Store.removeCard(e.target.parentElement.nextElementSibling.textContent);

        ui.showAlert('Card Removed!', 'success');
    }
);

function isNumberKey(evt) {
    const charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}


