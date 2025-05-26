// Dados simulados (mock) para os chamados
let chamados = [];
let usuarioLogado = null;

// Função para acessar o sistema (navegar para login)
function acessarSistema() {
  window.location.hash = '#login';
}

// Abrir o formulário de novo chamado
function abrirFormularioChamado() {
  const form = document.getElementById('formChamado');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Evento de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  // Simples validação (para testes locais)
  if (email && senha) {
    usuarioLogado = { email };
    alert('Login realizado com sucesso!');
    window.location.hash = '#cliente';
    atualizarListaChamados();
  } else {
    alert('Preencha todos os campos.');
  }
});

// Evento de cadastro
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  if (nome && email && senha) {
    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    window.location.hash = '#login';
  } else {
    alert('Preencha todos os campos.');
  }
});

// Evento de criação de chamado
document.getElementById('chamadoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const tipo = document.getElementById('tipo').value;
  const descricao = document.getElementById('descricao').value;

  if (tipo && descricao) {
    const chamado = {
      id: Date.now(),
      cliente: usuarioLogado.email,
      tipo,
      descricao,
      status: 'Aberto',
      tecnico: 'Não atribuído',
      dataCriacao: new Date().toLocaleDateString()
    };
    chamados.push(chamado);
    alert('Chamado criado com sucesso!');
    document.getElementById('chamadoForm').reset();
    document.getElementById('formChamado').style.display = 'none';
    atualizarListaChamados();
  } else {
    alert('Preencha todos os campos.');
  }
});

// Atualizar lista de chamados (para cliente)
function atualizarListaChamados() {
  const lista = document.getElementById('listaChamados');
  lista.innerHTML = '';

  const meusChamados = chamados.filter(c => c.cliente === usuarioLogado.email);

  if (meusChamados.length === 0) {
    lista.innerHTML = '<p>Nenhum chamado registrado.</p>';
    return;
  }

  meusChamados.forEach(c => {
    const card = document.createElement('div');
    card.className = 'chamado-card';
    card.innerHTML = `
      <h3>Chamado #${c.id}</h3>
      <p><strong>Tipo:</strong> ${c.tipo}</p>
      <p><strong>Descrição:</strong> ${c.descricao}</p>
      <p><strong>Status:</strong> ${c.status}</p>
      <p><strong>Técnico:</strong> ${c.tecnico}</p>
      <p><strong>Data:</strong> ${c.dataCriacao}</p>
    `;
    lista.appendChild(card);
  });
}

// Atualizar lista de chamados (para técnico)
function atualizarChamadosTecnico() {
  const lista = document.getElementById('chamadosTecnico');
  lista.innerHTML = '';

  if (chamados.length === 0) {
    lista.innerHTML = '<p>Nenhum chamado registrado.</p>';
    return;
  }

  chamados.forEach(c => {
    const card = document.createElement('div');
    card.className = 'chamado-card';
    card.innerHTML = `
      <h3>Chamado #${c.id}</h3>
      <p><strong>Cliente:</strong> ${c.cliente}</p>
      <p><strong>Tipo:</strong> ${c.tipo}</p>
      <p><strong>Descrição:</strong> ${c.descricao}</p>
      <p><strong>Status:</strong> ${c.status}</p>
      <p><strong>Técnico:</strong> ${c.tecnico}</p>
      <p><strong>Data:</strong> ${c.dataCriacao}</p>
      <button onclick="alterarStatus(${c.id})">Alterar Status</button>
    `;
    lista.appendChild(card);
  });
}

// Alterar status do chamado (simples)
function alterarStatus(id) {
  const chamado = chamados.find(c => c.id === id);
  if (chamado) {
    const novoStatus = prompt('Digite o novo status (Aberto, Em andamento, Finalizado):', chamado.status);
    if (novoStatus) {
      chamado.status = novoStatus;
      chamado.tecnico = 'Técnico Fulano';
      atualizarChamadosTecnico();
    }
  }
}

// Navegação: atualizar painel técnico quando mudar para ele
window.addEventListener('hashchange', function() {
  if (window.location.hash === '#tecnico') {
    atualizarChamadosTecnico();
  }
});
