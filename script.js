// 1. Estado da Aplicação e Mapeamento do DOM
const form = document.querySelector('#form-lancamento');
const inputDescricao = document.querySelector('#descricao');
const inputValor = document.querySelector('#valor');
const selectTipo = document.querySelector('#tipo');
const listaUl = document.querySelector('#lista-lancamentos');
const spanTotalItens = document.querySelector('#total-itens');
const spanValorTotal = document.querySelector('#valor-total');
const botoesFiltro = document.querySelectorAll('.filtros button');

// Carrega os dados salvos do localStorage ou inicia com uma lista vazia
let lancamentos = JSON.parse(localStorage.getItem('lancamentos_db')) || [];
let filtroAtual = 'todos';
let idEdicao = null;

// 2. Função para salvar no localStorage
const salvarStorage = () => {
  localStorage.setItem('lancamentos_db', JSON.stringify(lancamentos));
};

// 3. Evento para adicionar um lançamento
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Validação do valor cadastrado
  const valor = parseFloat(inputValor.value);

  if (isNaN(valor) || valor <= 0) {
    alert('O valor deve ser maior que zero!');
    return;
  }

  if (inputDescricao.value.trim() === '') {
    alert('Informe a descrição do lançamento!');
    return;
  }

  const lancamento = {
    id: idEdicao !== null ? idEdicao : Date.now(),
    descricao: inputDescricao.value,
    valor: valor,
    tipo: selectTipo.value
  };

  if (idEdicao !== null) {
    // Atualiza o lançamento selecionado
    const indice = lancamentos.findIndex((item) => item.id === idEdicao);
    lancamentos[indice] = lancamento;
    idEdicao = null;
  } else {
    lancamentos.push(lancamento);
  }

  salvarStorage();
  renderizarLancamentos();

  form.reset();
});

// 4. Função para exibir os lançamentos
const renderizarLancamentos = () => {
  listaUl.innerHTML = '';

  lancamentos.forEach((lancamento) => {
    const li = document.createElement('li');

    li.textContent = `${lancamento.descricao} - R$ ${lancamento.valor.toFixed(2)} - ${lancamento.tipo}`;

    // Botão para editar o lançamento
    const botaoEditar = document.createElement('button');
    botaoEditar.textContent = 'Editar';
    botaoEditar.type = 'button';

    botaoEditar.addEventListener('click', () => {
      inputDescricao.value = lancamento.descricao;
      inputValor.value = lancamento.valor;
      selectTipo.value = lancamento.tipo;
      idEdicao = lancamento.id;
      inputDescricao.focus();
    });

    li.appendChild(botaoEditar);
    listaUl.appendChild(li);
  });

  // Atualiza a quantidade de lançamentos
  spanTotalItens.textContent = lancamentos.length;

  // Calcula o total de receitas menos despesas
  const total = lancamentos.reduce((soma, lancamento) => {
    if (lancamento.tipo === 'receita') {
      return soma + lancamento.valor;
    } else {
      return soma - lancamento.valor;
    }
  }, 0);

  spanValorTotal.textContent = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// 5. Função para ordenar os lançamentos do maior valor para o menor
const ordenarLancamentos = () => {
  lancamentos.sort((a, b) => b.valor - a.valor);

  salvarStorage();
  renderizarLancamentos();
};

// Cria o botão para ordenar os lançamentos
const botaoOrdenar = document.createElement('button');
botaoOrdenar.textContent = 'Ordenar por maior valor';
botaoOrdenar.type = 'button';
botaoOrdenar.addEventListener('click', ordenarLancamentos);

listaUl.parentElement.insertBefore(botaoOrdenar, listaUl);

// Exibe os lançamentos ao abrir a página
renderizarLancamentos();