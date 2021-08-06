let messages;
let userName;
let chatUsers;

let messageConfiguration = {
    to: 'Todos',
    type: 'message'
}

function failLogin(erro) {
    document.querySelector('.login-input').classList.add('red-border');
    document.querySelector('.fail-message').classList.add('check');
}

function toggleSideMenu() {
    document.querySelector('.side-menu').classList.toggle('hide');
    document.querySelector('.dark-menu').classList.toggle('hide');
    document.querySelector('.participants-live').classList.toggle('hide');
}

function changeMessageDestinatary(element) {
    element.parentNode.querySelector('.check').classList.remove('check');
    messageConfiguration.to = chatUsers[element.id].name;
    element.querySelector('.checkmark').classList.add('check');
}

function changeMessageType(element) {
    element.parentNode.querySelector('.check').classList.remove('check');
    messageConfiguration.type = element.id;
    element.querySelector('.checkmark').classList.add('check');
}

function renderParticipants() {
    chatUsers.unshift({ name: 'Todos' })
    const participantsWindow = document.querySelector('.all-participants');
    participantsWindow.innerHTML = '';
    let checked = false;

    for (let i = 0; i < chatUsers.length; i++) {
        if (chatUsers[i].name === messageConfiguration.to) {
            participantsWindow.innerHTML += `
            <li id=${i} class="visibility-menu-item button" onclick="changeMessageDestinatary(this)">
                <div class="side-icon">
                    <ion-icon name="person-circle"></ion-icon>
                </div>
                <div class='visibility-menu-item-label'>
                    <p>${chatUsers[i].name}</p>
                </div>
                <ion-icon class="checkmark check" name="checkmark"></ion-icon>
            </li>
            `;
            checked = true;
        }

        else {
            participantsWindow.innerHTML += `
            <li id=${i} class="visibility-menu-item button" onclick="changeMessageDestinatary(this)">
                <div class="side-icon">
                    <ion-icon name="person-circle"></ion-icon>
                </div>
                <div class='visibility-menu-item-label'>
                    <p>${chatUsers[i].name}</p>
                </div>
                <ion-icon class="checkmark" name="checkmark"></ion-icon>
            </li>
            `;
        }
    }
    if (!checked) {
        participantsWindow.querySelector('.checkmark').classList.add('check');
        messageConfiguration.to = 'Todos';
    }
}

function saveChatUsers(answer) {
    chatUsers = answer.data;
    renderParticipants();
}

function getChatUsers() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants');
    promise.then(saveChatUsers);
}

function keepConnection() {
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status', userName);
}

function sendMessage() {

    const message = {
        from: userName.name,
        to: messageConfiguration.to,
        type: messageConfiguration.type,
        text: document.querySelector('.input-message').value
    }

    const promise = axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages',
        message);
    promise.then(getServerData);
    document.querySelector('.input-message').value = '';

}

function renderMessages(messages) {
    const chatWindow = document.querySelector('.chat');

    chatWindow.innerHTML = '';
    for (let i = 0; i < messages.length; i++) {
        switch (messages[i].type) {

            case 'status':

                chatWindow.innerHTML += `
                <li id=${i} class='message background-grey'>
                    <p>
                        <spam class='time-message'>(${messages[i].time})</spam> <strong>${messages[i].from} </strong>${messages[i].text}
                    </p>
                </li>
                `;

                break;

            case 'message':

                chatWindow.innerHTML += `
                <li id=${i} class='message background-white'>
                    <p>
                        <spam class='time-message'>(${messages[i].time})</spam> <strong>${messages[i].from} </strong> para <strong>${messages[i].to}: </strong> ${messages[i].text}
                    </p>
                </li>
                `;

                break;

            case 'private_message':

                if ((messages[i].to === userName.name || messages[i].from === userName.name)) {
                    chatWindow.innerHTML += `
                <li id=${i} class='message background-pink'>
                    <p>
                        <spam class='time-message'>(${messages[i].time})</spam> <strong>${messages[i].from} </strong> reservadamente para <strong>${messages[i].to}: </strong> ${messages[i].text}
                    </p>
                </li>
                `;
                }

                break;
        }
    }
    chatWindow.querySelector('.message:last-child').scrollIntoView();
}

function saveServerData(answer) {
    messages = answer.data;
    renderMessages(messages);
}

function getServerData() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages');
    promise.then(saveServerData);
}

function renderMain() {
    document.querySelector('main').innerHTML =
        `
        <header class="bar top-bar">
            <img class="logo-img" src="./img/Logo.jpg" alt="Logo">
            <div class="button" onclick="toggleSideMenu()">
                <ion-icon class='people-icon' name="people"></ion-icon>
            </div>
        </header>

        <aside class="side-menu hide">
            <div class="dark-menu button hide" onclick="toggleSideMenu()">

            </div>
            <div class="participants-live hide">
                <header>
                    <p><strong>Escolha um contato para enviar mensagem:</strong></p>
                </header>

                <ul class="all-participants">

                </ul>

                <header>
                    <p><strong>Escolha a visibilidade:</strong></p>
                </header>
                <ul class='visibility-menu'>
                    <li id="message" class="visibility-menu-item button" onclick="changeMessageType(this)">
                        <div class="side-icon">
                            <ion-icon class="lock-open" name="lock-open"></ion-icon>
                        </div>
                        <div class='visibility-menu-item-label'>
                            <p>Público</p>
                        </div>
                        <ion-icon class="checkmark check" name="checkmark"></ion-icon>
                    </li>

                    <li id="private_message" class="visibility-menu-item button" onclick="changeMessageType(this)">
                        <div class="side-icon">
                            <ion-icon class="lock-close" name="lock-closed"></ion-icon>
                        </div>
                        <div class='visibility-menu-item-label'>
                            <p>Reservadamente</p>
                        </div>
                        <ion-icon class="checkmark" name="checkmark"></ion-icon>
                    </li>
                </ul>
            </div>
        </aside>

        <ul class="chat">

        </ul>

        <footer class="bar send-field">
            <input class="input-message" type="text" placeholder="Escreva aqui...">
            <ion-icon onclick="sendMessage()" class="paper-plane-outline button" name="paper-plane-outline"></ion-icon>
        </footer>
    
    `
    let input = document.querySelector(".input-message");

    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            sendMessage();
        }
    });
}

function confirmLogin() {
    document.querySelector('.login-entries').classList.add('display-none');
    document.querySelector('.login-gif').classList.remove('display-none');
    setTimeout(
        () => {
            renderMain();
            getServerData();
            keepConnection();
            getChatUsers();
            setInterval(getServerData, 3000);
            setInterval(keepConnection, 5000);
            setInterval(getChatUsers, 10000);
        }, 1000
    )
}

function login() {
    userName = { name: document.querySelector('.login-input').value }

    const promise = axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants',
        userName);

    promise.then(confirmLogin);
    promise.catch(failLogin);

}

document.querySelector(".login-input").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        login();
    }
});

