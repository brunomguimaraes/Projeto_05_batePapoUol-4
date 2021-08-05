let messages;
let userName = { name: 'camilo' };
let chatUsers;

let messageConfiguration = {
    to: 'Todos',
    type: 'message'
}

function login() {

    const promise = axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants',
        userName);
    promise.then(confirmLogin);
    promise.catch(failLogin);

}

function failLogin(erro) {
    userName = { name: 'camilo2' }
    login();
}

function confirmLogin() {
    getServerData();
    keepConnection();
    setInterval(getServerData, 3000);
    setInterval(keepConnection, 5000);
}

function keepConnection() {
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status', userName);
}

function getServerData() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages');
    promise.then(saveServerData);
    getChatUsers();
}

function saveServerData(answer) {
    messages = answer.data;
    renderMessages(messages);
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

function getChatUsers() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants');
    promise.then(saveChatUsers);
}

function saveChatUsers(answer) {
    chatUsers = answer.data;
    renderParticipants();
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

function toggleSideMenu() {
    document.querySelector('.side-menu').classList.toggle('hide');
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

login(userName);