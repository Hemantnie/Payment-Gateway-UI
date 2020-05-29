
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
        document.getElementById('card-number').value = '';
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
        cards.push(card);
        localStorage.setItem('cards', JSON.stringify(cards));
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

//eventlister for add card
document.getElementById('card-deatils').addEventListener('submit',
    function (e) {
        const cardNumber = document.getElementById('card-number').value;
        const cvv = document.getElementById('cvv').value;
        const expireyDate = document.getElementById('ex_date').value;

        const card = new Card(cardNumber, cvv, expireyDate);

        const ui = new UI();

        if (cardNumber === '') {
            ui.showAlert('Please fill in the card details properly', 'error');
        } else {
            ui.addCardTolist(card);
            Store.addCard(card);
            ui.showAlert('Card Added!', 'success');
            ui.clearFields();
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

