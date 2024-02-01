document.addEventListener("DOMContentLoaded", function () {
  const ordersData = [
    { orderNumber: 1, invoiceNumber: 12345, itemCount: 3, sellerName: 'Vendedor 1', priority: 'high' },
    { orderNumber: 2, invoiceNumber: 67890, itemCount: 2, sellerName: 'Vendedor 2', priority: 'medium' },
    { orderNumber: 3, invoiceNumber: 75148, itemCount: 2, sellerName: 'Vendedor 2', priority: 'low' },
    { orderNumber: 4, invoiceNumber: 86426, itemCount: 10, sellerName: 'Vendedor 1', priority: 'high' },
    // Adicione mais dados conforme necessário
  ];

  const orderContainer = document.getElementById('orderContainer');
  const toggleMenuBtn = document.getElementById('toggleMenuBtn');
  const menu = document.getElementById('menu');
  const addOrderBtn = document.getElementById('addOrderBtn');
  const orderNumberInput = document.getElementById('orderNumberInput');
  const invoiceNumberInput = document.getElementById('invoiceNumberInput');
  const itemCountInput = document.getElementById('itemCountInput');
  const sellerNameInput = document.getElementById('sellerNameInput');
  const prioritySelect = document.getElementById('prioritySelect');

  function formatWaitingTime(waitingTime) {
    const hours = Math.floor(waitingTime / 3600);
    const minutes = Math.floor((waitingTime % 3600) / 60);
    const seconds = waitingTime % 60;

    // Adiciona zeros à esquerda, se necessário
    const formatedHours = hours.toString().padStart(2, '0');
    const formatedMinutes = minutes.toString().padStart(2, '0');
    const formatedSeconds = seconds.toString().padStart(2, '0');

    return `${formatedHours}:${formatedMinutes}:${formatedSeconds}`;
  }

  function createOrder(order) {
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order');

    const orderInfo = document.createElement('p');
    orderInfo.innerHTML = `Pedido #${order.orderNumber} | NF #${order.invoiceNumber} | Itens: ${order.itemCount} | Vendedor: ${order.sellerName}`;

    const waitingTime = document.createElement('p');
    waitingTime.classList.add('waiting-time');

    let remainingTime;
    switch (order.priority) {
      case 'high': remainingTime = 10 * 60; break;
      case 'medium': remainingTime = 120 * 60; break;
      case 'low': remainingTime = 1440 * 60; break;
      default: remainingTime = 10 * 60;
    }

    function updateTimer() {
      if (remainingTime > 0) {
        remainingTime--;
        waitingTime.innerHTML = `Tempo de espera: ${formatWaitingTime(remainingTime)}`;
      } else {
        clearInterval(timerInterval);
        waitingTime.innerHTML = 'Pedido finalizado!';
      }
    }

    const timerInterval = setInterval(updateTimer, 1000) // Atualiza a cada minuto

    const removeIcon = document.createElement('span');
    removeIcon.innerHTML = '🗑️';
    removeIcon.style.cursor = 'pointer';
    removeIcon.addEventListener('click', function () {
      clearInterval(timerInterval);
      orderContainer.removeChild(orderDiv);
    });

    orderDiv.appendChild(orderInfo);
    orderDiv.appendChild(waitingTime);
    orderDiv.appendChild(removeIcon);

    // Adiciona o pedido à div de prioridade correta
    const priorityContainer = document.getElementById(`${order.priority.toLowerCase()}PriorityContainer`);
    if (priorityContainer) {
      priorityContainer.appendChild(orderDiv);
    }

  }

  function toggleMenu() {
    menu.classList.toggle('hidden');
  }

  function addNewOrder() {
    const orderNumber = orderNumberInput.value;
    const invoiceNumber = invoiceNumberInput.value;
    const itemCount = itemCountInput.value;
    const sellerName = sellerNameInput.value;
    const priority = prioritySelect.value;

    if (orderNumber && invoiceNumber && itemCount && sellerName && priority) {
      const newOrder = {
        orderNumber: parseInt(orderNumber),
        invoiceNumber: parseInt(invoiceNumber),
        itemCount: parseInt(itemCount),
        sellerName: sellerName,
        priority: priority,
      };

      // Adiciona o pedido ao contêiner correspondente com base na prioridade
      const priorityContainer = document.getElementById(`${priority.toLowerCase()}PriorityContainer`);

      if (priorityContainer) {
        createOrder(newOrder);
      } else {
        console.error(`Container de prioridade não encontrado para ${priority}`);
      }

      // Limpa os campos de entrada após adicionar o pedido
      orderNumberInput.value = '';
      invoiceNumberInput.value = '';
      itemCountInput.value = '';
      sellerNameInput.value = '';
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }

  function initializeOrders() {
    // Adiciona cada pedido à página
    ordersData.forEach(function (order) {
      const priorityContainer = document.getElementById(`${order.priority.toLowerCase()}PriorityContainer`);
      if (priorityContainer) {
        createOrder(order);
      }
    });
  }

  // Adiciona funções aos eventos
  toggleMenuBtn.addEventListener('click', toggleMenu);
  addOrderBtn.addEventListener('click', addNewOrder);

  // Inicializa os pedidos
  initializeOrders();
});
