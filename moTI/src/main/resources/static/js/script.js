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
        <td class="acoes">
          <button class="excluir" onclick="excluirEquipamento(${equipamento.id})">Excluir</button>
        </td>
      `;
      tabela.appendChild(linha);
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

function configurarFormularioCadastro() {
  const form = document.getElementById('form-equipamento');
  if (!form) return;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const localId = document.getElementById('local').value;

    const dados = {
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

    const mensagem = document.getElementById('mensagem');

    try {
      const resposta = await fetch(`${API_URL}/equipamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!resposta.ok) throw new Error('Falha ao cadastrar');

      mensagem.textContent = 'Equipamento cadastrado com sucesso!';
      mensagem.className = 'mensagem sucesso';
      form.reset();
    } catch (erro) {
      mensagem.textContent = 'Erro ao cadastrar o equipamento. Verifique os dados e tente novamente.';
      mensagem.className = 'mensagem erro';
      console.error(erro);
    }
  });
}

carregarEquipamentos();
carregarLocaisNoSelect();
configurarFormularioCadastro();
