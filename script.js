function getUser() {
  let currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    document.getElementById('user-section').style.display = 'block';
    document.getElementById('app').style.display = 'none';
  } else {
    document.getElementById('user-section').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('user-name').textContent = currentUser;
    updateLog();
    updateStatus();
  }
}

function setUser() {
  const username = document.getElementById('username').value.trim();
  if (username) {
    localStorage.setItem('currentUser', username);
    getUser();
  } else {
    alert('Por favor, insira um nome!');
  }
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
}

function calculateWorkTime(start, end) {
  const diffMs = end - start;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}min`;
}

function updateLog() {
  const user = localStorage.getItem('currentUser');
  const logData = JSON.parse(localStorage.getItem('workLogs')) || {};
  const userLogs = logData[user] || [];

  const logDiv = document.getElementById('log');
  logDiv.innerHTML = '';

  if (userLogs.length === 0) {
    logDiv.innerHTML = '<p>Nenhum registro encontrado.</p>';
  } else {
    userLogs.reverse().forEach(entry => {
      const div = document.createElement('div');
      div.className = 'entry';
      const duration = entry.saida
        ? `Duração: ${calculateWorkTime(new Date(entry.entrada), new Date(entry.saida))}`
        : 'Aguardando saída...';
      div.innerHTML = `
        <h3>Dia: ${new Date(entry.entrada).toLocaleDateString()} - Tempo trabalhado: ${duration}</h3>
        <p>Entrada: ${formatDate(new Date(entry.entrada))}</p>
        ${entry.saida ? `<p>Saída: ${formatDate(new Date(entry.saida))}</p>` : ''}
        <p>${duration}</p>
        ${entry.pausaAlmocoInicio ? `<p>Pausa Almoço: Início às ${formatDate(new Date(entry.pausaAlmocoInicio))}</p>` : ''}
        ${entry.pausaAlmocoFim ? `<p>Pausa Almoço: Fim às ${formatDate(new Date(entry.pausaAlmocoFim))}</p>` : ''}
        ${entry.pausaCafeInicio ? `<p>Pausa Café: Início às ${formatDate(new Date(entry.pausaCafeInicio))}</p>` : ''}
        ${entry.pausaCafeFim ? `<p>Pausa Café: Fim às ${formatDate(new Date(entry.pausaCafeFim))}</p>` : ''}
      `;
      logDiv.appendChild(div);
    });
  }
}

function saveLogData(logData) {
  localStorage.setItem('workLogs', JSON.stringify(logData));

  const user = localStorage.getItem('currentUser');
  const endpoint = 'https://api.exemplo.com/logs';

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, logs: logData[user] }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao enviar os dados para o servidor');
      }
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });
}

function updateStatus() {
  const user = localStorage.getItem('currentUser');
  const logData = JSON.parse(localStorage.getItem('workLogs')) || {};
  const userLogs = logData[user] || [];
  const currentLog = userLogs[userLogs.length - 1];

  const statusElement = document.getElementById('current-status');

  if (!currentLog || currentLog.saida) {
    statusElement.textContent = 'Status: Fora do Trabalho';
  } else if (currentLog.pausaAlmocoInicio && !currentLog.pausaAlmocoFim) {
    statusElement.textContent = 'Status: Almoçando';
  } else if (currentLog.pausaCafeInicio && !currentLog.pausaCafeFim) {
    statusElement.textContent = 'Status: Pausa para Café';
  } else {
    statusElement.textContent = 'Status: Trabalhando';
  }
}

function registerEntry() {
  const now = new Date();
  const user = localStorage.getItem('currentUser');
  const logData = JSON.parse(localStorage.getItem('workLogs')) || {};

  if (!logData[user]) {
    logData[user] = [];
  }

  if (logData[user].length > 0 && !logData[user][logData[user].length - 1].saida) {
    alert('Você já tem um registro de entrada em andamento. Registre a saída antes de abrir um novo!');
    return;
  }

  logData[user].push({ entrada: now, pausaAlmocoInicio: null, pausaAlmocoFim: null, pausaCafeInicio: null, pausaCafeFim: null });

  saveLogData(logData);
  updateLog();
  updateStatus();
}

function registerExit() {
  const now = new Date();
  const user = localStorage.getItem('currentUser');
  const logData = JSON.parse(localStorage.getItem('workLogs')) || {};

  if (!logData[user] || logData[user].length === 0 || logData[user][logData[user].length - 1].saida) {
    alert('Por favor, registre uma entrada primeiro!');
    return;
  }

  logData[user][logData[user].length - 1].saida = now;

  saveLogData(logData);
  updateLog();
  updateStatus();
}

function registerPausaAlmocoInicio() {
  const now = new Date();
  const user = localStorage.getItem('currentUser');
  const logData = JSON.parse(localStorage.getItem('workLogs')) || {};

  if (!logData[user] || logData[user].length === 0 || logData[user][logData[user].length - 1].pausaAlmocoInicio) {
    alert('Pausa para Almoço já registrada ou entrada não registrada!');
    return;
  }

  logData[user][logData[user].length - 1].pausaAlmocoInicio = now;

  saveLogData(logData);
  updateLog();
  updateStatus();
}

function registerPausaAlmocoFim() {
  const now = new Date();
  const user = localStorage.getItem('currentUser');
  const logData = JSON.parse(localStorage.getItem('workLogs')) || {};

  if (!logData[user] || logData[user].length === 0 || !logData[user][logData[user].length - 1].pausaAlmocoInicio || logData[user][logData[user].length - 1].pausaAlmocoFim) {
    alert('Pausa para Almoço não foi iniciada!');
    return;
  }

  logData[user][logData[user].length - 1].pausaAlmocoFim = now;

  saveLogData(logData);
  updateLog();
  updateStatus();
}

function registerPausaCafeInicio() {
  const now = new Date();
  const user = localStorage.getItem('currentUser');
  const logData = JSON.parse(localStorage.getItem('workLogs')) || {};

  if (!logData[user] || logData[user].length === 0 || logData[user][logData[user].length - 1].pausaCafeInicio) {
    alert('Pausa para Café já registrada ou entrada não registrada!');
    return;
  }

  logData[user][logData[user].length - 1].pausaCafeInicio = now;

  saveLogData(logData);
  updateLog();
  updateStatus();
}

function registerPausaCafeFim() {
  const now = new Date();
  const user = localStorage.getItem('currentUser');
  const logData = JSON.parse(localStorage.getItem('workLogs')) || {};

  if (!logData[user] || logData[user].length === 0 || !logData[user][logData[user].length - 1].pausaCafeInicio || logData[user][logData[user].length - 1].pausaCafeFim) {
    alert('Pausa para Café não foi iniciada!');
    return;
  }

  logData[user][logData[user].length - 1].pausaCafeFim = now;

  saveLogData(logData);
  updateLog();
  updateStatus();
}

document.getElementById('btnSetUser').addEventListener('click', setUser);
document.getElementById('btnEntrada').addEventListener('click', registerEntry);
document.getElementById('btnSaida').addEventListener('click', registerExit);
document.getElementById('btnPausaAlmocoInicio').addEventListener('click', registerPausaAlmocoInicio);
document.getElementById('btnPausaAlmocoFim').addEventListener('click', registerPausaAlmocoFim);
document.getElementById('btnPausaCafeInicio').addEventListener('click', registerPausaCafeInicio);
document.getElementById('btnPausaCafeFim').addEventListener('click', registerPausaCafeFim);
