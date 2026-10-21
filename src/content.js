
const selectedConversations = new Set();

const CHECKBOX_CLASS = 'bulk-delete-checkbox';
const TOOLBAR_ID = 'bulk-delete-toolbar';

let observerScheduled = false;
let deletionInProgress = false;

function getConversationLinks() {
  return Array.from(document.querySelectorAll('a[href*="/c/"]')).filter(
    (link) => {
      const url = new URL(link.href, window.location.origin);

      return (
        url.origin === window.location.origin &&
        /^\/c\/[^/]+$/.test(url.pathname)
      );
    },
  );
}

function getConversationId(link) {
  const url = new URL(link.href, window.location.origin);

  return url.pathname.match(/^\/c\/([^/]+)$/)?.[1] ?? null;
}

function getConversationRow(link) {
  let element = link.parentElement;

  while (element && element !== document.body) {
    const containsLink = element.contains(link);

    const actionButtons = [
      ...element.querySelectorAll(
        'button[aria-label="Ações do chat"]',
      ),
    ];

    if (containsLink && actionButtons.length === 1) {
      return element;
    }

    element = element.parentElement;
  }

  return null;
}
function getConversationTitle(link) {
  return link?.innerText?.trim() ?? '';
}

function updateCounter() {
  const counter = document.querySelector('#bulk-delete-counter');

  if (counter) {
    counter.textContent = `${selectedConversations.size} selecionada(s)`;
  }
}

function setStatus(message) {
  const status = document.querySelector('#bulk-delete-status');

  if (status) {
    status.textContent = message;
  }
}

function setToolbarDisabled(disabled) {
  const toolbar = document.getElementById(TOOLBAR_ID);

  if (!toolbar) {
    return;
  }

  toolbar.querySelectorAll('button').forEach((button) => {
    button.disabled = disabled;
  });

  toolbar
    .querySelectorAll(`.${CHECKBOX_CLASS}`)
    .forEach((checkbox) => {
      checkbox.disabled = disabled;
    });
}

function createToolbar() {
  const existingToolbar = document.getElementById(TOOLBAR_ID);

  if (existingToolbar) {
    return existingToolbar;
  }

  const toolbar = document.createElement('section');
  toolbar.id = TOOLBAR_ID;
  toolbar.setAttribute('aria-label', 'Exclusão de conversas');

  toolbar.innerHTML = `
    <header class="bd-header">
      <div class="bd-brand">
        <div class="bd-brand-icon">
          ${lucideIcon('bot', 21)}
        </div>

        <div class="bd-brand-copy">
        <h2>Excluir conversas</h2>
        <p>Remova vários chats de uma só vez</p>
        </div>
      </div>

      <div class="bd-selection-badge">
        <span class="bd-selection-dot"></span>
        <span id="bulk-delete-counter">0 selecionadas</span>
      </div>
    </header>

    <div class="bd-status" id="bulk-delete-status"
      role="status" aria-live="polite">
      Selecione as conversas que deseja excluir.
    </div>

    <div class="bd-divider"></div>

    <div class="bd-section-label">
      <span>SELEÇÃO</span>
    </div>

    <div class="bd-actions">
      <button
        type="button"
        id="bulk-select-visible"
        class="bd-button bd-button-secondary bd-button-select"
      >
        ${lucideIcon('checkSquare', 17)}
        <span>Selecionar visíveis</span>
      </button>

      <button
        type="button"
        id="bulk-clear-selection"
        class="bd-button bd-button-icon"
        aria-label="Limpar seleção"
        title="Limpar seleção"
      >
        ${lucideIcon('rotate', 17)}
      </button>
    </div>

    <button
      type="button"
      id="bulk-delete-selected"
      class="bd-button bd-button-danger bd-delete-button"
    >
      ${lucideIcon('trash', 17)}
      <span>Excluir selecionadas</span>
      ${lucideIcon('arrowRight', 17)}
    </button>

    <p class="bd-footer-note">
      ${lucideIcon('alert', 14)}
      <span>A exclusão é permanente.</span>
      
    </p>
    <div class="bd-footer">
  <small class="bd-footer-version">v1.0.0</small>

  <button
    type="button"
    id="bulk-open-extension-settings"
    class="bd-footer-manage"
  >
    Gerenciar extensão
    ${lucideIcon('arrowRight', 13)}
  </button>
</div>
  `;

  toolbar
    .querySelector('#bulk-select-visible')
    .addEventListener('click', () => {
      if (deletionInProgress) {
        return;
      }

      getConversationLinks().forEach((link) => {
        const id = getConversationId(link);

        if (id) {
          selectedConversations.add(id);
        }
      });

      refreshCheckboxes();
      setStatus('Conversas visíveis selecionadas.');
    });

  toolbar
    .querySelector('#bulk-clear-selection')
    .addEventListener('click', () => {
      if (deletionInProgress) {
        return;
      }

      selectedConversations.clear();
      refreshCheckboxes();
      setStatus('Seleção limpa.');
    });

  toolbar
    .querySelector('#bulk-delete-selected')
    .addEventListener('click', deleteSelectedConversations);

    toolbar
  .querySelector('#bulk-open-extension-settings')
  .addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'open-extension-settings',
    });
  });
  
  document.body.appendChild(toolbar);

  updateCounter();

  return toolbar;
}

function addCheckbox(link) {
  if (link.querySelector(`.${CHECKBOX_CLASS}`)) {
    return;
  }

  const id = getConversationId(link);

  if (!id) {
    return;
  }

  const checkbox = document.createElement('input');

  checkbox.type = 'checkbox';
  checkbox.className = CHECKBOX_CLASS;
  checkbox.checked = selectedConversations.has(id);
  checkbox.setAttribute('aria-label', 'Selecionar conversa');

  checkbox.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  checkbox.addEventListener('change', () => {
    if (deletionInProgress) {
      checkbox.checked = selectedConversations.has(id);
      return;
    }

    if (checkbox.checked) {
      selectedConversations.add(id);
    } else {
      selectedConversations.delete(id);
    }

    updateCounter();
  });

  link.prepend(checkbox);
}

function refreshCheckboxes() {
  getConversationLinks().forEach((link) => {
    addCheckbox(link);

    const checkbox = link.querySelector(`.${CHECKBOX_CLASS}`);
    const id = getConversationId(link);

    if (checkbox && id) {
      checkbox.checked = selectedConversations.has(id);
      checkbox.disabled = deletionInProgress;
    }
  });

  updateCounter();
}

function findConversationLink(id) {
  return getConversationLinks().find(
    (link) =>
      getConversationId(link) === id &&
      link.getBoundingClientRect().width > 0 &&
      getConversationRow(link),
  ) ?? null;
}

function normalizeText(value) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();
}

function waitForElement(getElement, timeout = 5000, description = 'elemento') {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    function check() {
      const element = getElement();

      if (element) {
        resolve(element);
        return;
      }

      if (Date.now() - startedAt >= timeout) {
        reject(
          new Error(
            `Tempo limite aguardando: ${description}.`,
          ),
        );
        return;
      }

      setTimeout(check, 100);
    }

    check();
  });
}

function getOpenMenuForButton(actionButton) {
  if (actionButton.getAttribute('data-state') !== 'open') {
    return null;
  }

  return [
    ...document.querySelectorAll(
      '[role="menu"][data-state="open"]',
    ),
  ].find((menu) => {
    const rect = menu.getBoundingClientRect();

    return rect.width > 0 && rect.height > 0;
  }) ?? null;
}

function getDeleteMenuItem(menu) {
  return [...menu.querySelectorAll('[role="menuitem"]')].find(
    (item) => item.textContent.trim() === 'Excluir',
  ) ?? null;
}

function getConfirmationForm() {
  return [...document.querySelectorAll('form')].find((form) => {
    const text = normalizeText(form.innerText);

    return (
      text.includes('excluir chat?') &&
      text.includes('nao sera possivel desfazer')
    );
  }) ?? null;
}

function getConfirmationButton(form) {
  return [...form.querySelectorAll('button[type="submit"]')].find(
    (button) => normalizeText(button.textContent) === 'excluir chat',
  ) ?? null;
}

async function deleteOneConversation(id) {
  const link = findConversationLink(id);

  if (!link) {
    throw new Error(
      'A conversa não está disponível na barra lateral. Ela não foi excluída.',
    );
  }

  const title = getConversationTitle(link);

  if (!title) {
    throw new Error(
      'Não foi possível identificar o título da conversa. Exclusão interrompida.',
    );
  }

  function openConversationMenu(actionButton) {
  if (!actionButton) {
    throw new Error('Botão de ações da conversa não encontrado.');
  }

  if (
    document.querySelector(
      '[role="menu"][data-state="open"]',
    )
  ) {
    throw new Error(
      'Já existe um menu aberto. Feche-o antes de continuar.',
    );
  }

  actionButton.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      buttons: 1,
    }),
  );
}

  const row = getConversationRow(link);
  const actionButton = row?.querySelector(
    'button[aria-label="Ações do chat"]',
  );

  if (!actionButton) {
    throw new Error(
      `Não foi possível abrir o menu de "${title}".`,
    );
  }

// Não inicia a operação se já houver um menu aberto.
// Isso evita fechar acidentalmente um menu que estava aberto.
if (
  document.querySelector(
    '[role="menu"][data-state="open"]',
  )
) {
  throw new Error(
    'Já existe um menu aberto. Feche-o e tente novamente.',
  );
}

openConversationMenu(actionButton);

const menu = await waitForElement(
  () => getOpenMenuForButton(actionButton),
  5000,
  `menu de ações da conversa "${title}"`,
);

  const deleteItem = getDeleteMenuItem(menu);

  if (!deleteItem) {
    throw new Error(
      `A opção Excluir não foi encontrada para "${title}".`,
    );
  }

  deleteItem.click();

const form = await waitForElement(
  getConfirmationForm,
  5000,
  'diálogo "Excluir chat?"',
);
  const confirmationText = normalizeText(form.innerText);
  const normalizedTitle = normalizeText(title);

  // Não confirma se o diálogo não identificar a conversa esperada.
  if (!confirmationText.includes(normalizedTitle)) {
    const cancelButton = [...form.querySelectorAll('button')].find(
      (button) => normalizeText(button.textContent) === 'cancelar',
    );

    cancelButton?.click();

    throw new Error(
      `O título no diálogo não corresponde a "${title}". A operação foi interrompida.`,
    );
  }

  const confirmationButton = getConfirmationButton(form);

  if (!confirmationButton) {
    throw new Error(
      `O botão de confirmação não foi encontrado para "${title}".`,
    );
  }

  confirmationButton.click();

 await waitForElement(
  () => findConversationLink(id) === null,
  10000,
  `desaparecimento da conversa "${title}"`,
);
  selectedConversations.delete(id);

  return title;
}

async function deleteSelectedConversations() {
  if (deletionInProgress) {
    return;
  }

  const ids = [...selectedConversations];

  if (ids.length === 0) {
    setStatus('Selecione pelo menos uma conversa.');
    return;
  }

  const availableIds = ids.filter((id) => findConversationLink(id));

  if (availableIds.length === 0) {
    setStatus(
      'Nenhuma das conversas selecionadas está disponível na barra lateral.',
    );
    return;
  }

  const unavailableCount = ids.length - availableIds.length;

  const message = [
    `Você selecionou ${ids.length} conversa(s).`,
    '',
    `${availableIds.length} conversa(s) estão disponíveis para processamento.`,
    unavailableCount > 0
      ? `${unavailableCount} conversa(s) não estão disponíveis e serão ignoradas.`
      : '',
    '',
    'A exclusão é permanente e não pode ser desfeita.',
    'Deseja continuar?',
  ]
    .filter(Boolean)
    .join('\n');

 const confirmed = await showDeleteConfirmation(
  availableIds.length,
  unavailableCount,
);

if (!confirmed) {
  setStatus('Exclusão cancelada.');
  return;
}
  deletionInProgress = true;
  setToolbarDisabled(true);

  let deletedCount = 0;
  let failedTitle = '';

  try {
    for (let index = 0; index < availableIds.length; index++) {
      const id = availableIds[index];

      setStatus(
        `Processando ${index + 1} de ${availableIds.length}...`,
      );

      try {
        const title = await deleteOneConversation(id);
        deletedCount++;

        setStatus(
          `Excluídas ${deletedCount} de ${availableIds.length}. Última: ${title}`,
        );
      } catch (error) {
        failedTitle = error.message;

        setStatus(
          `Processo interrompido. ${deletedCount} excluída(s). ${failedTitle}`,
        );

        break;
      }
    }

    if (!failedTitle) {
      setStatus(
        `Concluído: ${deletedCount} conversa(s) excluída(s).`,
      );
    }
  } finally {
    deletionInProgress = false;

    createToolbar();
    refreshCheckboxes();
    setToolbarDisabled(false);
  }
}

function containsConversationLink(node) {
  if (!(node instanceof Element)) {
    return false;
  }

  return (
    node.matches('a[href*="/c/"]') ||
    node.querySelector('a[href*="/c/"]') !== null
  );
}

function scheduleRefresh() {
  if (observerScheduled) {
    return;
  }

  observerScheduled = true;

  requestAnimationFrame(() => {
    observerScheduled = false;

    if (!document.body) {
      return;
    }

    createToolbar();
    refreshCheckboxes();
  });
}

function initialize() {
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', initialize, {
      once: true,
    });

    return;
  }

  createToolbar();
  refreshCheckboxes();

  const observer = new MutationObserver((mutations) => {
    const toolbarMissing = !document.getElementById(TOOLBAR_ID);

    const conversationListChanged = mutations.some((mutation) => {
      const changedNodes = [
        ...mutation.addedNodes,
        ...mutation.removedNodes,
      ];

      return changedNodes.some((node) => {
        if (!(node instanceof Element)) {
          return false;
        }

        if (node.closest(`#${TOOLBAR_ID}`)) {
          return false;
        }

        if (node.matches(`.${CHECKBOX_CLASS}`)) {
          return false;
        }

        return containsConversationLink(node);
      });
    });

    if (toolbarMissing || conversationListChanged) {
      scheduleRefresh();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
function showDeleteConfirmation(count, unavailableCount = 0) {
  return new Promise((resolve) => {
    document.getElementById('bulk-delete-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'bulk-delete-modal';
    overlay.className = 'bd-modal-overlay';

    overlay.innerHTML = `
      <section
        class="bd-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="bd-modal-title"
        aria-describedby="bd-modal-description"
        tabindex="-1"
      >
        <div class="bd-modal-icon">
          ${lucideIcon('trash', 23)}
        </div>

        <button
          type="button"
          class="bd-modal-close"
          aria-label="Cancelar e fechar"
        >
          ${lucideIcon('x', 18)}
        </button>

        <h2 id="bd-modal-title">Excluir conversas?</h2>

        <p id="bd-modal-description">
          Esta ação excluirá permanentemente as conversas
          selecionadas. Não será possível desfazê-la.
        </p>

        <div class="bd-modal-summary">
          <div class="bd-modal-summary-icon">
            ${lucideIcon('messages', 19)}
          </div>

          <div class="bd-modal-summary-copy">
            <strong>Conversas selecionadas</strong>
            <span>Confira a quantidade antes de continuar</span>
          </div>

          <strong class="bd-modal-count">${count}</strong>
        </div>

        ${
          unavailableCount > 0
            ? `
              <p class="bd-modal-warning">
                ${unavailableCount} conversa(s) indisponível(is)
                serão ignoradas.
              </p>
            `
            : ''
        }

        <div class="bd-modal-warning">
          ${lucideIcon('alert', 17)}
          <span>A exclusão é permanente.</span>
        </div>

        <div class="bd-modal-actions">
          <button type="button" class="bd-modal-cancel">
            Cancelar
          </button>

          <button type="button" class="bd-modal-confirm">
            ${lucideIcon('trash', 16)}
            Excluir ${count} ${count === 1 ? 'conversa' : 'conversas'}
          </button>
        </div>
      </section>
    `;

    const modal = overlay.querySelector('.bd-modal');
    const cancelButton = overlay.querySelector('.bd-modal-cancel');
    const confirmButton = overlay.querySelector('.bd-modal-confirm');
    const closeButton = overlay.querySelector('.bd-modal-close');

    let finished = false;

    function finish(confirmed) {
      if (finished) {
        return;
      }

      finished = true;
      document.removeEventListener('keydown', onKeyDown);
      overlay.remove();
      resolve(confirmed);
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        finish(false);
      }

      if (event.key === 'Tab') {
        const focusable = [
          cancelButton,
          confirmButton,
          closeButton,
        ];

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    cancelButton.addEventListener('click', () => finish(false));
    closeButton.addEventListener('click', () => finish(false));
    confirmButton.addEventListener('click', () => finish(true));

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        finish(false);
      }
    });

    document.addEventListener('keydown', onKeyDown);

    document.body.appendChild(overlay);
    modal.focus();
  });
}
function lucideIcon(name, size = 18) {
  const icons = {
   
  bot: `
    <path d="M12 6V2H8"/>
    <path d="M15 11v2"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>
    <path d="M9 11v2"/>
  `,

    messages: `
      <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
      <path d="M8 9h8M8 13h5"/>
    `,
    checkSquare: `
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <path d="m8 12 3 3 5-6"/>
    `,
    listChecks: `
      <path d="m3 17 2 2 4-4"/>
      <path d="m3 7 2 2 4-4"/>
      <path d="M13 6h8M13 12h8M13 18h8"/>
    `,
    trash: `
      <path d="M3 6h18"/>
      <path d="M8 6V4h8v2"/>
      <path d="m19 6-1 14H6L5 6"/>
      <path d="M10 11v5M14 11v5"/>
    `,
    rotate: `
      <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16"/>
      <path d="M8 16H3v5"/>
    `,
    alert: `
      <path d="m10.29 3.86-8.1 14A2 2 0 0 0 3.92 21h16.16a2 2 0 0 0 1.73-3.14l-8.1-14a2 2 0 0 0-3.42 0z"/>
      <path d="M12 9v4M12 17h.01"/>
    `,
    x: `
      <path d="m18 6-12 12M6 6l12 12"/>
    `,
    arrowRight: `
      <path d="M5 12h14M12 5l7 7-7 7"/>
    `,
  };

  const paths = icons[name];

  if (!paths) {
    return '';
  }

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      ${paths}
    </svg>
  `;
}

initialize();

