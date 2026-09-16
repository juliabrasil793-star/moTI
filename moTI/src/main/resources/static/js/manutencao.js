const API = "http://localhost:8080";

const selectEquipamento = document.getElementById("equipamento");
const form = document.getElementById("form-manutencao");
const mensagem = document.getElementById("mensagem");
const tabela = document.getElementById("tabela-manutencoes");
const vazio = document.getElementById("vazio-manutencoes");

let equipamentoSelecionado = null;
let edicaoId = null;

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;
    setTimeout(() => {
        mensagem.className = "mensagem";
    }, 4000);
}

function formatarData(data) {
    if (!data) return "—";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

async function carregarEquipamentos() {
    try {
        const resposta = await fetch(`${API}/equipamentos`);
        const equipamentos = await resposta.json();

        selectEquipamento.innerHTML = '<option value="">Selecione...</option>';

        equipamentos.forEach(e => {
            const option = document.createElement("option");
            option.value = e.id;
            option.textContent = `${e.patrimonio} — ${e.tipo} ${e.marca || ""} ${e.modelo || ""}`.trim();
            selectEquipamento.appendChild(option);
        });

        const params = new URLSearchParams(window.location.search);
        const id = params.get("equipamento");
        if (id) {
            selectEquipamento.value = id;
            selectEquipamento.dispatchEvent(new Event("change"));
        }
    } catch (erro) {
        mostrarMensagem("Não foi possível carregar os equipamentos.", "erro");
    }
}

async function carregarHistorico(equipamentoId) {
    tabela.innerHTML = "";

    if (!equipamentoId) {
        vazio.textContent = "Selecione um equipamento para ver o histórico.";
        vazio.style.display = "block";
        return;
    }

    try {
        const resposta = await fetch(`${API}/manutencoes/equipamento/${equipamentoId}`);
        const manutencoes = await resposta.json();

        if (manutencoes.length === 0) {
            vazio.textContent = "Nenhuma manutenção registrada para este equipamento.";
            vazio.style.display = "block";
            return;
        }

        vazio.style.display = "none";

        manutencoes.forEach(m => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
        <td>${formatarData(m.dataAbertura)}</td>
        <td>${formatarData(m.dataResolucao)}</td>
        <td>${m.problema || "—"}</td>
        <td>${m.solucao || "—"}</td>
        <td><span class="status status-${m.status}">${m.status.replace("_", " ")}</span></td>
        <td>
          <div class="acoes">
            <a href="#" class="editar" data-id="${m.id}">Editar</a>
            <button class="excluir" data-id="${m.id}">Excluir</button>
          </div>
        </td>
      `;
            tabela.appendChild(linha);
        });

        tabela.querySelectorAll(".editar").forEach(botao => {
            botao.addEventListener("click", evento => {
                evento.preventDefault();
                const id = Number(botao.dataset.id);
                const m = manutencoes.find(item => item.id === id);
                preencherFormulario(m);
            });
        });

        tabela.querySelectorAll(".excluir").forEach(botao => {
            botao.addEventListener("click", () => excluirManutencao(botao.dataset.id));
        });
    } catch (erro) {
        mostrarMensagem("Não foi possível carregar o histórico.", "erro");
    }
}

function preencherFormulario(m) {
    edicaoId = m.id;
    document.getElementById("dataAbertura").value = m.dataAbertura || "";
    document.getElementById("dataResolucao").value = m.dataResolucao || "";
    document.getElementById("problema").value = m.problema || "";
    document.getElementById("solucao").value = m.solucao || "";
    document.getElementById("status").value = m.status;
    form.querySelector("button").textContent = "Salvar alterações";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function limparFormulario() {
    edicaoId = null;
    form.reset();
    selectEquipamento.value = equipamentoSelecionado || "";
    form.querySelector("button").textContent = "Registrar manutenção";
}

async function excluirManutencao(id) {
    if (!confirm("Excluir esta manutenção?")) return;

    try {
        const resposta = await fetch(`${API}/manutencoes/${id}`, { method: "DELETE" });

        if (resposta.ok) {
            mostrarMensagem("Manutenção excluída.", "sucesso");
            carregarHistorico(equipamentoSelecionado);
        } else {
            mostrarMensagem("Não foi possível excluir.", "erro");
        }
    } catch (erro) {
        mostrarMensagem("Erro de conexão com o servidor.", "erro");
    }
}

selectEquipamento.addEventListener("change", () => {
    equipamentoSelecionado = selectEquipamento.value;
    edicaoId = null;
    form.querySelector("button").textContent = "Registrar manutenção";
    carregarHistorico(equipamentoSelecionado);
});

form.addEventListener("submit", async evento => {
    evento.preventDefault();

    const dados = {
        equipamento: { id: Number(selectEquipamento.value) },
        dataAbertura: document.getElementById("dataAbertura").value,
        dataResolucao: document.getElementById("dataResolucao").value || null,
        problema: document.getElementById("problema").value,
        solucao: document.getElementById("solucao").value || null,
        status: document.getElementById("status").value
    };

    const url = edicaoId ? `${API}/manutencoes/${edicaoId}` : `${API}/manutencoes`;
    const metodo = edicaoId ? "PUT" : "POST";

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            mostrarMensagem(edicaoId ? "Manutenção atualizada." : "Manutenção registrada.", "sucesso");
            limparFormulario();
            carregarHistorico(equipamentoSelecionado);
        } else {
            mostrarMensagem("Não foi possível salvar a manutenção.", "erro");
        }
    } catch (erro) {
        mostrarMensagem("Erro de conexão com o servidor.", "erro");
    }
});

carregarEquipamentos();