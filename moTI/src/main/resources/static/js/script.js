const API_URL = 'http://localhost:8080';

const LABEL_TIPO = {
  COMPUTADOR: 'Computador',
  NOTEBOOK: 'Notebook',
  IMPRESSORA: 'Impressora',
  PROJETOR: 'Projetor',
  ROTEADOR: 'Roteador',
  SWITCH: 'Switch',
  OUTRO: 'Outro'
};

const LABEL_STATUS = {
  FUNCIONANDO: 'Funcionando',
  EM_MANUTENCAO: 'Em manutenção',
  COM_PROBLEMA: 'Com problema',
  INATIVO: 'Inativo'
};

function exibirMensagem(texto, tipo) {
  const mensagem = document.getElementById('mensagem');
  if (!mensagem) return;
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  setTimeout(() => { mensagem.className = 'mensagem'; }, 4000);
}

async function carregarEquipamentos() {
  const tabela = document.getElementById('tabela-equipamentos');
  const vazio = document.getElementById('vazio');
  if (!tabela) return;

  try {
    const resposta = await fetch(`${API_URL}/equipamentos`);
    const equipamentos = await resposta.json();

    tabela.innerHTML = '';

    if (equipamentos.length === 0) {
      vazio.style.display = 'block';
      return;
    }
    vazio.style.display = 'none';

    equipamentos.forEach(equipamento => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${equipamento.patrimonio ?? '-'}</td>
        <td>${LABEL_TIPO[equipamento.tipo] ?? equipamento.tipo}</td>
        <td>${equipamento.marca ?? ''} ${equipamento.modelo ?? ''}</td>
        <td>${equipamento.local ? equipamento.local.nome : '-'}</td>
        <td><span class="status status-${equipamento.status}">${LABEL_STATUS[equipamento.status] ?? equipamento.status}</span></td>
        <td>
          <div class="acoes">
            <a class="editar" href="editar.html?id=${equipamento.id}">Editar</a>
            <a class="editar" href="manutencao.html?equipamento=${equipamento.id}">Histórico</a>
            <button class="excluir" data-id="${equipamento.id}">Excluir</button>
          </div>
        </td>
      `;
      tabela.appendChild(linha);
    });

    tabela.querySelectorAll('.excluir').forEach(botao => {
      botao.addEventListener('click', () => excluirEquipamento(botao.dataset.id));
    });
  } catch (erro) {
    tabela.innerHTML = `<tr><td colspan="6">Não foi possível conectar à API. O backend está rodando em ${API_URL}?</td></tr>`;
    console.error(erro);
  }
}

async function excluirEquipamento(id) {
  if (!confirm('Tem certeza que deseja excluir este equipamento?')) return;

  try {
    await fetch(`${API_URL}/equipamentos/${id}`, { method: 'DELETE' });
    carregarEquipamentos();
  } catch (erro) {
    alert('Erro ao excluir o equipamento.');
    console.error(erro);
  }
}

async function carregarLocaisNoSelect() {
  const select = document.getElementById('local');
  if (!select) return;

  try {
    const resposta = await fetch(`${API_URL}/locais`);
    const locais = await resposta.json();

    locais.forEach(local => {
      const opcao = document.createElement('option');
      opcao.value = local.id;
      opcao.textContent = `${local.nome}${local.setor ? ' — ' + local.setor : ''}`;
      select.appendChild(opcao);
    });
  } catch (erro) {
    console.error('Não foi possível carregar os locais.', erro);
  }
}

function lerFormularioEquipamento() {
  const localId = document.getElementById('local').value;

  return {
    tipo: document.getElementById('tipo').value,
    marca: document.getElementById('marca').value,
    modelo: document.getElementById('modelo').value,
    patrimonio: document.getElementById('patrimonio').value,
    numeroSerie: document.getElementById('numeroSerie').value,
    local: localId ? { id: Number(localId) } : null,
    dataAquisicao: document.getElementById('dataAquisicao').value || null,
    status: document.getElementById('status').value,
    detalhesEspecificos: document.getElementById('detalhesEspecificos').value
  };
}

function configurarFormularioCadastro() {
  const form = document.getElementById('form-equipamento');
  if (!form) return;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
      const resposta = await fetch(`${API_URL}/equipamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lerFormularioEquipamento())
      });

      if (!resposta.ok) throw new Error('Falha ao cadastrar');

      exibirMensagem('Equipamento cadastrado com sucesso!', 'sucesso');
      form.reset();
    } catch (erro) {
      exibirMensagem('Erro ao cadastrar o equipamento. Verifique os dados e tente novamente.', 'erro');
      console.error(erro);
    }
  });
}

async function iniciarEdicao() {
  const form = document.getElementById('form-editar');
  if (!form) return;

  const id = new URLSearchParams(window.location.search).get('id');

  if (!id) {
    exibirMensagem('Nenhum equipamento informado.', 'erro');
    return;
  }

  await carregarLocaisNoSelect();

  try {
    const resposta = await fetch(`${API_URL}/equipamentos/${id}`);
    if (!resposta.ok) throw new Error('Equipamento não encontrado');
    const equipamento = await resposta.json();

    document.getElementById('tipo').value = equipamento.tipo ?? '';
    document.getElementById('marca').value = equipamento.marca ?? '';
    document.getElementById('modelo').value = equipamento.modelo ?? '';
    document.getElementById('patrimonio').value = equipamento.patrimonio ?? '';
    document.getElementById('numeroSerie').value = equipamento.numeroSerie ?? '';
    document.getElementById('local').value = equipamento.local ? equipamento.local.id : '';
    document.getElementById('dataAquisicao').value = equipamento.dataAquisicao ?? '';
    document.getElementById('status').value = equipamento.status ?? 'FUNCIONANDO';
    document.getElementById('detalhesEspecificos').value = equipamento.detalhesEspecificos ?? '';
  } catch (erro) {
    exibirMensagem('Não foi possível carregar o equipamento.', 'erro');
    console.error(erro);
    return;
  }

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
      const resposta = await fetch(`${API_URL}/equipamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lerFormularioEquipamento())
      });

      if (!resposta.ok) throw new Error('Falha ao atualizar');

      exibirMensagem('Equipamento atualizado com sucesso!', 'sucesso');
      setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    } catch (erro) {
      exibirMensagem('Erro ao atualizar o equipamento.', 'erro');
      console.error(erro);
    }
  });
}

let localEmEdicao = null;

async function carregarTabelaLocais() {
  const tabela = document.getElementById('tabela-locais');
  const vazio = document.getElementById('vazio-locais');
  if (!tabela) return;

  try {
    const resposta = await fetch(`${API_URL}/locais`);
    const locais = await resposta.json();

    tabela.innerHTML = '';

    if (locais.length === 0) {
      vazio.style.display = 'block';
      return;
    }
    vazio.style.display = 'none';

    locais.forEach(local => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${local.nome}</td>
        <td>${local.setor ?? '-'}</td>
        <td>
          <div class="acoes">
            <a href="#" class="editar" data-id="${local.id}">Editar</a>
            <button class="excluir" data-id="${local.id}">Excluir</button>
          </div>
        </td>
      `;
      tabela.appendChild(linha);
    });

    tabela.querySelectorAll('.editar').forEach(botao => {
      botao.addEventListener('click', (evento) => {
        evento.preventDefault();
        const local = locais.find(item => item.id === Number(botao.dataset.id));
        localEmEdicao = local.id;
        document.getElementById('nome').value = local.nome ?? '';
        document.getElementById('setor').value = local.setor ?? '';
        document.querySelector('#form-local button').textContent = 'Salvar alterações';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    tabela.querySelectorAll('.excluir').forEach(botao => {
      botao.addEventListener('click', () => excluirLocal(botao.dataset.id));
    });
  } catch (erro) {
    tabela.innerHTML = `<tr><td colspan="3">Não foi possível conectar à API.</td></tr>`;
    console.error(erro);
  }
}

async function excluirLocal(id) {
  if (!confirm('Excluir este local? Equipamentos vinculados ficarão sem local.')) return;

  try {
    const resposta = await fetch(`${API_URL}/locais/${id}`, { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Falha ao excluir');
    exibirMensagem('Local excluído.', 'sucesso');
    carregarTabelaLocais();
  } catch (erro) {
    exibirMensagem('Não foi possível excluir o local. Verifique se há equipamentos vinculados.', 'erro');
    console.error(erro);
  }
}

function iniciarLocais() {
  const form = document.getElementById('form-local');
  if (!form) return;

  carregarTabelaLocais();

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const dados = {
      nome: document.getElementById('nome').value,
      setor: document.getElementById('setor').value || null
    };

    const url = localEmEdicao ? `${API_URL}/locais/${localEmEdicao}` : `${API_URL}/locais`;
    const metodo = localEmEdicao ? 'PUT' : 'POST';

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) throw new Error('Falha ao salvar');

      exibirMensagem(localEmEdicao ? 'Local atualizado.' : 'Local cadastrado.', 'sucesso');
      localEmEdicao = null;
      form.reset();
      form.querySelector('button').textContent = 'Cadastrar local';
      carregarTabelaLocais();
    } catch (erro) {
      exibirMensagem('Erro ao salvar o local.', 'erro');
      console.error(erro);
    }
  });
}

carregarEquipamentos();
configurarFormularioCadastro();
iniciarEdicao();
iniciarLocais();

if (!document.getElementById('form-editar')) {
  carregarLocaisNoSelect();
}