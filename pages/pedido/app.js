let orderCounter = 1;
let listaDePedidosAtivos = [];
function addOrder(items, customer, tipoEntrega) {
  const ordersList = document.getElementById(tipoEntrega);

  const orderObj = {
    numeroPedido: orderCounter,
    status: "Em andamento",
    tempoAtivo: 0, // Inicializa o tempo ativo em segundos
    tempoLimite: calcularTempoLimite(tipoEntrega), // Adiciona o tempo limite ao objeto
    intervalId: null, // Armazena o ID do intervalo
  };

  const tempoAtivoFormatado = formatTime(orderObj.tempoAtivo)

  const orderContainer = buildOrderContainer(orderCounter, tempoAtivoFormatado, orderObj, items, customer);

  ordersList.appendChild(orderContainer);
  orderCounter++;

  // Inicia a atualização do tempo ativo
  orderObj.intervalId = setInterval(() => updateActiveTime(orderObj, orderContainer), 1000);

  listaDePedidosAtivos.push(orderObj);
}

function updateActiveTime(orderObj, orderContainer) {
  orderObj.tempoAtivo++;

  // Verifica se o tempo ativo ultrapassou o tempo limite
  if (orderObj.tempoAtivo > orderObj.tempoLimite) {
    orderObj.status = "Expirado";
    const orderStatus = orderContainer.querySelector(".orderStatus");
    orderStatus.textContent = "Expirado";
    finishOrder(orderObj, orderContainer);
  }
}

function finishOrder(orderObj, orderContainer) {
  // Para o intervalo se ainda estiver ativo
  clearInterval(orderObj.intervalId);

  // Remove o pedido da lista
  orderContainer.remove();
}

function removeOrder(button, event) {
  const orderContainer = button.parentNode;
  const ordersList = orderContainer.parentNode;
  ordersList.removeChild(orderContainer);

  // Evita que o evento se propague e cause problemas no HTML
  event.stopPropagation();
}

function addNewOrder() {
  const items = document.getElementById("items").value.split(',').map(item => item.trim());
  const customer = {
    name: document.getElementById("customerName").value,
    address: document.getElementById("customerAddress").value,
    phone: document.getElementById("customerPhone").value,
    email: document.getElementById("customerEmail").value,
  }
  const tipoEntrega = document.getElementById("tipoEntrega").value

  if (!items || items.length === 0 || !customer.name || !customer.address || !customer.phone || !customer.email || !tipoEntrega) {
    alert("Por favor, preencha todos os campos do formulário.");
    return;
  }

  addOrder(items, customer, tipoEntrega);
}

function updateOrderStatus(button, event) {
  const orderContainer = button.closest(".order-container");
  const progressBar = orderContainer.querySelector(".progress-bar-inner");
  const orderStatus = orderContainer.querySelector(".orderStatus");

  // Recupera orderObj do atributo de dados (data attribute) do botão
  const orderObjString = button.dataset.orderObj;

  if (!orderObjString) {
    console.error("Objeto de pedido não encontrado.");
    return;
  }

  const orderObj = JSON.parse(orderObjString);

  let currentProgress = parseInt(progressBar.style.width) || 0;
  if (currentProgress < 100) {
    currentProgress += 25;
    progressBar.style.width = currentProgress + "%";
    progressBar.textContent = currentProgress + "%";
    if (currentProgress === 100) {
      orderObj.status = "Concluído";
      orderStatus.textContent = "Concluído";

      // Chama a função para finalizar o pedido
      finishOrder(orderObj, orderContainer);
    } else {
      orderStatus.textContent = "Em andamento";
    }
  }

  // Evita que o evento se propague e cause problemas no HTML
  event.stopPropagation();
}

function toggleVisibility(element) {
  const hiddenElement = element.querySelector('.hidden');
  hiddenElement.classList.toggle('visible');

  // const detailsElement = element.querySelector('.hidden');
  // const isHidden = detailsElement.classList.contains('hidden');

  // if (isHidden) {
  //   detailsElement.classList.remove('hidden');
  // } else {
  //   detailsElement.classList.add('hidden');
  // }
}

function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return ''; // Tratar o caso em que o número de telefone é nulo ou indefinido

  // Ajuste o formato do número de telefone conforme necessário
  // Neste exemplo, estamos adicionando parênteses e hífens
  const formattedNumber = phoneNumber.toString().replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  return formattedNumber;
}

function emptyText() {
  document.getElementById('items').value = null
  document.getElementById('customerName').value = null
  document.getElementById('customerAddress').value = null
  document.getElementById('customerPhone').value = null
  document.getElementById('customerEmail').value = null
}

function toggleFormVisibility() {
  const formContainer = document.getElementById('newOrderForm');
  formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
}

function calcularTempoLimite(tipoEntrega) {
  switch (tipoEntrega) {
    case 'clienteEmLoja':
      return 10; // 10 minutos
    case 'paraBuscar':
      return 2 * 60; // 2 horas
    case 'paraEntregar':
      return 24 * 60; // 24 horas
    default:
      return 0;
  }
}

function formatLimitTime(tempoLimiteEmMinutos) {
  const horas = Math.floor(tempoLimiteEmMinutos / 60);
  const minutos = tempoLimiteEmMinutos % 60;

  return `${horas}:${minutos}`
}

function formatTime(tempoEmSegundos) {
  const horas = Math.floor(tempoEmSegundos / 3600);
  const minutos = Math.floor((tempoEmSegundos % 3600) / 60);
  const segundos = tempoEmSegundos % 60;

  // Adiciona zeros à esquerda, se necessário
  const horasFormatadas = horas.toString().padStart(2, '0');
  const minutosFormatados = minutos.toString().padStart(2, '0');
  const segundosFormatados = segundos.toString().padStart(2, '0');

  return `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`;
}

function buildOrderContainer(orderCounter, activeTimeElement, orderObj, items, customer) {
  const orderContainer = document.createElement("div");

  orderContainer.className = "order-container";

  orderContainer.innerHTML = `
  <p>
    <h2>Número do Pedido: <span>${orderCounter}</span></h2>
    <h4>Tempo Ativo: ${activeTimeElement}</h4>
    <div class="order-status">Status do Pedido: <span class="orderStatus">${orderObj.status}</span></div>
      <div class="progress-bar">
        <div class="progress-bar-inner">0%</div>
      </div>

      <div class="order-details" onclick="toggleVisibility(this)">
        <h3>Detalhes do Pedido</h3>
        <div class="hidden">
          <ul class="item-list">
          ${Array.isArray(items) ? items.map(item => `<li class="item">${item}</li>`).join('') : ''}
          </ul>
        </div>
      </div>

      <div class="customer-info" onclick="toggleVisibility(this)">
        <h3>Informações do Cliente</h3>
        <div class="hidden">
          <p><strong>Nome:</strong> ${customer.name}</p>
          <p><strong>Endereço:</strong> ${customer.address}</p>
          <p><strong>Telefone:</strong> ${formatPhoneNumber(customer.phone)}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
        </div>
      </div>
    </p>
  `;

  const orderButton = document.createElement("button");
  orderButton.textContent = "Atualizar status";

  const removeOrderButton = document.createElement("button");
  removeOrderButton.textContent = "Remover Pedido";

  // Adicionar orderObj como um atributo de dados
  orderButton.dataset.orderObj = JSON.stringify(orderObj);

  orderButton.addEventListener("click", function (event) {
    updateOrderStatus(this, event);
  });

  removeOrderButton.addEventListener("click", function (event) {
    removeOrder(this, event)
  })

  orderContainer.appendChild(orderButton);
  orderContainer.appendChild(removeOrderButton);
  return orderContainer;
}
