// Nordeste Office - lógica do Sistema de Solicitação de Manutenção

const formulario = document.getElementById("formulario-chamado");
const listaChamados = document.getElementById("lista-chamados");
const estadoVazio = document.getElementById("estado-vazio");
const mensagem = document.getElementById("mensagem");
const totalChamados = document.getElementById("total-chamados");
const campoDescricao = document.getElementById("descricao");
const contadorCaracteres = document.getElementById("caracteres");

let proximoCodigo = 1;

// Atualiza a contagem de caracteres da descrição.
campoDescricao.addEventListener("input", function () {
    contadorCaracteres.textContent = campoDescricao.value.length;
});

// Exibe mensagens de erro ou de sucesso próximas ao formulário.
function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;
}

function limparMensagem() {
    mensagem.textContent = "";
    mensagem.className = "mensagem";
}

// Cria uma informação do chamado usando createElement() e textContent.
function criarDetalhe(rotulo, valor) {
    const detalhe = document.createElement("div");
    detalhe.className = "detalhe";

    const titulo = document.createElement("strong");
    titulo.textContent = rotulo;

    const texto = document.createElement("span");
    texto.textContent = valor;

    detalhe.appendChild(titulo);
    detalhe.appendChild(texto);
    return detalhe;
}

// Monta e adiciona um chamado à lista sem substituir os anteriores.
function adicionarChamado(dados) {
    const codigo = "MAN-" + String(proximoCodigo).padStart(3, "0");
    proximoCodigo++;

    const chamado = document.createElement("article");
    chamado.className = "chamado";

    const topo = document.createElement("div");
    topo.className = "chamado-topo";

    const identificacao = document.createElement("div");
    const codigoElemento = document.createElement("span");
    codigoElemento.className = "chamado-codigo";
    codigoElemento.textContent = codigo;

    const nome = document.createElement("div");
    nome.className = "chamado-nome";
    nome.textContent = dados.nome;

    const setor = document.createElement("div");
    setor.className = "chamado-setor";
    setor.textContent = dados.setor;

    identificacao.appendChild(codigoElemento);
    identificacao.appendChild(nome);
    identificacao.appendChild(setor);

    const prioridade = document.createElement("span");
    prioridade.className = "prioridade";
    prioridade.textContent = "Prioridade: " + dados.prioridade;

    if (dados.prioridade === "Baixa") {
        prioridade.classList.add("prioridade-baixa");
    } else if (dados.prioridade === "Média") {
        prioridade.classList.add("prioridade-media");
    } else {
        prioridade.classList.add("prioridade-alta");
    }

    topo.appendChild(identificacao);
    topo.appendChild(prioridade);
    chamado.appendChild(topo);

    const detalhes = document.createElement("div");
    detalhes.className = "chamado-detalhes";
    detalhes.appendChild(criarDetalhe("Equipamento", dados.equipamento));
    detalhes.appendChild(criarDetalhe("Patrimônio", dados.patrimonio));
    detalhes.appendChild(criarDetalhe("Tipo de problema", dados.problema));
    detalhes.appendChild(criarDetalhe("Setor", dados.setor));
    chamado.appendChild(detalhes);

    const descricao = document.createElement("div");
    descricao.className = "chamado-descricao";
    descricao.textContent = dados.descricao;
    chamado.appendChild(descricao);

    const rodape = document.createElement("div");
    rodape.className = "chamado-rodape";

    const email = document.createElement("span");
    email.className = "chamado-email";
    email.textContent = "Contato: " + dados.email;

    // Desafio extra: botão remove somente o chamado selecionado.
    const botaoRemover = document.createElement("button");
    botaoRemover.type = "button";
    botaoRemover.className = "botao-remover";
    botaoRemover.textContent = "Remover";
    botaoRemover.addEventListener("click", function () {
        // Desafio extra: confirmação antes da remoção.
        const confirmar = confirm("Deseja realmente remover o chamado " + codigo + "?");
        if (confirmar) {
            chamado.remove();
            atualizarContador();
            mostrarEstadoVazio();
        }
    });

    rodape.appendChild(email);
    rodape.appendChild(botaoRemover);
    chamado.appendChild(rodape);

    listaChamados.appendChild(chamado);
    estadoVazio.hidden = true;
    atualizarContador();
}

// Atualiza o contador de solicitações registradas.
function atualizarContador() {
    const quantidade = listaChamados.querySelectorAll(".chamado").length;
    totalChamados.textContent = quantidade;
}

// Mostra o aviso inicial quando não houver nenhum chamado na lista.
function mostrarEstadoVazio() {
    const quantidade = listaChamados.querySelectorAll(".chamado").length;
    estadoVazio.hidden = quantidade !== 0;
}

// Controla o envio do formulário.
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limparMensagem();

    // Captura os valores e remove espaços das extremidades dos textos.
    const dados = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        setor: document.getElementById("setor").value,
        equipamento: document.getElementById("equipamento").value,
        patrimonio: document.getElementById("patrimonio").value.trim(),
        problema: document.getElementById("problema").value,
        prioridade: document.getElementById("prioridade").value,
        descricao: campoDescricao.value.trim()
    };

    // Validações: em caso de erro, mostra a mensagem e interrompe com return.
    if (!dados.nome || !dados.email || !dados.setor || !dados.equipamento ||
        !dados.patrimonio || !dados.problema || !dados.prioridade || !dados.descricao) {
        mostrarMensagem("Preencha todos os campos obrigatórios antes de registrar.", "erro");
        return;
    }

    if (dados.nome.length < 3) {
        mostrarMensagem("Nome inválido: informe pelo menos 3 caracteres.", "erro");
        document.getElementById("nome").focus();
        return;
    }

    // A validação básica do formato do e-mail também é feita pelo input type=email.
    const campoEmail = document.getElementById("email");
    if (!campoEmail.checkValidity()) {
        mostrarMensagem("E-mail inválido. Confira o endereço informado.", "erro");
        campoEmail.focus();
        return;
    }

    if (dados.patrimonio.length < 4) {
        mostrarMensagem("Patrimônio inválido: informe pelo menos 4 caracteres.", "erro");
        document.getElementById("patrimonio").focus();
        return;
    }

    if (dados.descricao.length < 15 || dados.descricao.length > 300) {
        mostrarMensagem("Descrição inválida: utilize entre 15 e 300 caracteres.", "erro");
        campoDescricao.focus();
        return;
    }

    // Somente após todas as verificações o chamado é criado.
    adicionarChamado(dados);
    mostrarMensagem("Solicitação registrada com sucesso! Código: MAN-" +
        String(proximoCodigo - 1).padStart(3, "0") + ".", "sucesso");

    // Limpa os campos após o cadastro válido, conforme solicitado no PDF.
    formulario.reset();
    contadorCaracteres.textContent = "0";
});

mostrarEstadoVazio();
atualizarContador();
