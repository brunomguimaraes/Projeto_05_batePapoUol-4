let messages;
let userName = { name: prompt('Qual seu lindo nome?') };


function login(userName) {

    const promise = axios.post(
        'https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants',
        userName);
    promise.then(getServerData);

    setInterval(keepConnection, 5000, userName);
}

function keepConnection(userName) {
    axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status', userName);
}

function getServerData() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages')
    console.log(promise);
    promise.then(saveServerData);
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

                chatWindow.innerHTML += `
                <li id=${i} class='message background-pink'>
                    <p>
                        <spam class='time-message'>(${messages[i].time})</spam> <strong>${messages[i].from} </strong> reservadamente para <strong>${messages[i].to}: </strong> ${messages[i].text}
                    </p>
                </li>
                `;

                break;
        }
    }
    chatWindow.querySelector('.message:last-child').scrollIntoView();
}

login(userName);