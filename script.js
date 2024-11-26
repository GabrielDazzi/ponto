function getUser() {
    let currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      document.getElementById('user-section').style.display = 'block';
      document.getElementById('app').style.display = 'none';
    } else {
      document.getElementById('user-section').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      document.getElementById('user-name').textContent = currentUser; // Exibe o nome do usuário
      updateLog();
    }
  }
  
  function setUser() {
    const username = document.getElementById('username').value.trim();
    if (username) {
      localStorage.setItem('currentUser', username);
      getUser(); // Atualiza a tela com o nome do usuário
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
      // Inverter a ordem dos registros para mostrar os mais recentes primeiro
      userLogs.reverse().forEach(entry => { // Modificação aqui: usamos reverse() para inverter a ordem
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
        `;
        logDiv.appendChild(div);
      });
    }
  }
  
  function registerEntry() {
    const now = new Date();
    const user = localStorage.getItem('currentUser');
    const logData = JSON.parse(localStorage.getItem('workLogs')) || {};
  
    if (!logData[user]) {
      logData[user] = [];
    }
  
    logData[user].push({ entrada: now, pausaAlmocoInicio: null, pausaAlmocoFim: null, pausaCafeInicio: null, pausaCafeFim: null });
    localStorage.setItem('workLogs', JSON.stringify(logData));
    updateLog();
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
    localStorage.setItem('workLogs', JSON.stringify(logData));
    updateLog();
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
    localStorage.setItem('workLogs', JSON.stringify(logData));
    updateLog();
  }
  
  function registerPausaAlmocoFim() {
    const now = new Date();
    const user = localStorage.getItem('currentUser');
    const logData = JSON.parse(localStorage.getItem('workLogs')) || {};
  
    if (!logData[user] || logData[user].length === 0 || !logData[user][logData[user].length - 1].pausaAlmocoInicio) {
      alert('Pausa para Almoço não foi iniciada!');
      return;
    }
  
    logData[user][logData[user].length - 1].pausaAlmocoFim = now;
    localStorage.setItem('workLogs', JSON.stringify(logData));
    updateLog();
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
    localStorage.setItem('workLogs', JSON.stringify(logData));
    updateLog();
  }
  
  function registerPausaCafeFim() {
    const now = new Date();
    const user = localStorage.getItem('currentUser');
    const logData = JSON.parse(localStorage.getItem('workLogs')) || {};
  
    if (!logData[user] || logData[user].length === 0 || !logData[user][logData[user].length - 1].pausaCafeInicio) {
      alert('Pausa para Café não foi iniciada!');
      return;
    }
  
    logData[user][logData[user].length - 1].pausaCafeFim = now;
    localStorage.setItem('workLogs', JSON.stringify(logData));
    updateLog();
  }
  
  document.getElementById('btnSetUser').addEventListener('click', setUser);
  document.getElementById('btnEntrada').addEventListener('click', registerEntry);
  document.getElementById('btnSaida').addEventListener('click', registerExit);
  document.getElementById('btnPausaAlmocoInicio').addEventListener('click', registerPausaAlmocoInicio);
  document.getElementById('btnPausaAlmocoFim').addEventListener('click', registerPausaAlmocoFim);
  document.getElementById('btnPausaCafeInicio').addEventListener('click', registerPausaCafeInicio);
  document.getElementById('btnPausaCafeFim').addEventListener('click', registerPausaCafeFim);
  
  window.onload = getUser;
  