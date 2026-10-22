(() => {
  // src/features/conversations/conversation-dom.js
  function getConversationLinks() {
    return Array.from(document.querySelectorAll('a[href*="/c/"]')).filter(
      (link) => {
        const url = new URL(link.href, window.location.origin);
        return url.origin === window.location.origin && /^\/c\/[^/]+$/.test(url.pathname);
      }
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
        ...element.querySelectorAll('button[aria-label="A\xE7\xF5es do chat"]')
      ];
      if (containsLink && actionButtons.length === 1) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }
  function getConversationTitle(link) {
    return link?.innerText?.trim() ?? "";
  }
  function findConversationLink(id) {
    return getConversationLinks().find((link) => {
      const rect = link.getBoundingClientRect();
      return getConversationId(link) === id && rect.width > 0 && getConversationRow(link) !== null;
    }) ?? null;
  }
  function containsConversationLink(node) {
    if (!(node instanceof Element)) {
      return false;
    }
    return node.matches('a[href*="/c/"]') || node.querySelector('a[href*="/c/"]') !== null;
  }

  // src/features/conversations/conversation-selection.js
  var selectedConversations = /* @__PURE__ */ new Set();
  var deletionInProgress = false;
  function getSelectedConversationIds() {
    return Array.from(selectedConversations);
  }
  function getSelectedConversationCount() {
    return selectedConversations.size;
  }
  function isConversationSelected(id) {
    return selectedConversations.has(id);
  }
  function toggleConversationSelection(id, checked) {
    if (deletionInProgress || !id) {
      return false;
    }
    if (checked) {
      selectedConversations.add(id);
    } else {
      selectedConversations.delete(id);
    }
    return true;
  }
  function selectConversations(ids) {
    if (deletionInProgress) {
      return false;
    }
    for (const id of ids) {
      if (id) {
        selectedConversations.add(id);
      }
    }
    return true;
  }
  function clearSelection() {
    if (deletionInProgress) {
      return false;
    }
    selectedConversations.clear();
    return true;
  }
  function removeSelectedConversation(id) {
    selectedConversations.delete(id);
  }
  function setDeletionInProgress(value) {
    deletionInProgress = Boolean(value);
  }
  function isDeletionInProgress() {
    return deletionInProgress;
  }

  // src/features/conversations/conversation-deletion.js
  function normalizeText(value) {
    return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function waitForElement(getElement, timeout = 5e3, description = "elemento") {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      function checkElement() {
        const element = getElement();
        if (element) {
          resolve(element);
          return;
        }
        if (Date.now() - startTime >= timeout) {
          reject(
            new Error(`Tempo limite aguardando: ${description}.`)
          );
          return;
        }
        setTimeout(checkElement, 100);
      }
      checkElement();
    });
  }
  function getOpenMenuForButton(actionButton) {
    if (actionButton.getAttribute("data-state") !== "open") {
      return null;
    }
    return Array.from(
      document.querySelectorAll('[role="menu"][data-state="open"]')
    ).find((menu) => {
      const rect = menu.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }) ?? null;
  }
  function getDeleteMenuItem(menu) {
    return Array.from(menu.querySelectorAll('[role="menuitem"]')).find(
      (item) => normalizeText(item.textContent) === "excluir"
    ) ?? null;
  }
  function getConfirmationForm() {
    return Array.from(document.querySelectorAll("form")).find((form) => {
      const text = normalizeText(form.innerText);
      return text.includes("excluir chat?") && text.includes("nao sera possivel desfazer");
    }) ?? null;
  }
  function getConfirmationButton(form) {
    return Array.from(form.querySelectorAll('button[type="submit"]')).find(
      (button) => normalizeText(button.textContent) === "excluir chat"
    ) ?? null;
  }
  function getCancelButton(form) {
    return Array.from(form.querySelectorAll("button")).find(
      (button) => normalizeText(button.textContent) === "cancelar"
    ) ?? null;
  }
  async function deleteOneConversation(id) {
    const link = findConversationLink(id);
    if (!link) {
      throw new Error(
        "A conversa n\xE3o est\xE1 dispon\xEDvel na barra lateral. Ela n\xE3o foi exclu\xEDda."
      );
    }
    const title = getConversationTitle(link);
    if (!title) {
      throw new Error(
        "N\xE3o foi poss\xEDvel identificar o t\xEDtulo da conversa. Exclus\xE3o interrompida."
      );
    }
    const row = getConversationRow(link);
    const actionButton = row?.querySelector(
      'button[aria-label="A\xE7\xF5es do chat"]'
    );
    if (!actionButton) {
      throw new Error(
        `N\xE3o foi poss\xEDvel encontrar o bot\xE3o de a\xE7\xF5es da conversa "${title}".`
      );
    }
    if (document.querySelector('[role="menu"][data-state="open"]')) {
      throw new Error(
        "J\xE1 existe um menu aberto. Feche-o antes de continuar."
      );
    }
    actionButton.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
        button: 0,
        buttons: 1
      })
    );
    const menu = await waitForElement(
      () => getOpenMenuForButton(actionButton),
      5e3,
      `menu de a\xE7\xF5es da conversa "${title}"`
    );
    const deleteMenuItem = await waitForElement(
      () => getDeleteMenuItem(menu),
      5e3,
      `op\xE7\xE3o Excluir da conversa "${title}"`
    );
    deleteMenuItem.click();
    const confirmationForm = await waitForElement(
      getConfirmationForm,
      5e3,
      'di\xE1logo "Excluir chat?"'
    );
    const confirmationText = normalizeText(confirmationForm.innerText);
    const normalizedTitle = normalizeText(title);
    if (!confirmationText.includes(normalizedTitle)) {
      getCancelButton(confirmationForm)?.click();
      throw new Error(
        `O t\xEDtulo no di\xE1logo n\xE3o corresponde a "${title}". A opera\xE7\xE3o foi interrompida.`
      );
    }
    const confirmationButton = await waitForElement(
      () => getConfirmationButton(confirmationForm),
      5e3,
      `bot\xE3o de confirma\xE7\xE3o da conversa "${title}"`
    );
    confirmationButton.click();
    await waitForElement(
      () => findConversationLink(id) ? null : true,
      1e4,
      `desaparecimento da conversa "${title}"`
    );
    return { id, title };
  }

  // src/shared/icons.js
  var icons = {
    bot: `
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  `,
    messages: `
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  `,
    checkSquare: `
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="m9 12 2 2 4-4" />
  `,
    listChecks: `
    <path d="m3 5 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
    <path d="m3 11 2 2 4-4" />
    <path d="m3 17 2 2 4-4" />
  `,
    trash: `
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="m19 6-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  `,
    rotate: `
    <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
    <path d="M8 16H3v5" />
  `,
    alert: `
    <path d="m10.29 3.86-8.3 14.36A2 2 0 0 0 3.72 21h16.56a2 2 0 0 0 1.73-2.78l-8.3-14.36a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  `,
    x: `
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  `,
    arrowRight: `
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  `
  };
  function lucideIcon(name, size = 18) {
    const paths = icons[name];
    if (!paths) {
      return "";
    }
    return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      ${paths}
    </svg>
  `;
  }

  // src/features/toolbar/confirmation-modal.js
  var closeActiveModal = null;
  function showDeleteConfirmation(count, unavailableCount = 0) {
    closeActiveModal?.(false);
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.id = "bulk-delete-modal";
      overlay.className = "bd-modal-overlay";
      overlay.innerHTML = `
      <section
        class="bd-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="bd-modal-title"
        aria-describedby="bd-modal-description"
        tabindex="-1"
      >
        <div class="bd-modal-header">
          <div class="bd-modal-icon">
            ${lucideIcon("trash", 23)}
          </div>

          <h2 id="bd-modal-title">Excluir conversas?</h2>
        </div>

          <button
            type="button"
            class="bd-modal-close"
            aria-label="Cancelar e fechar"
          >
            ${lucideIcon("x", 18)}
          </button>

          <p id="bd-modal-description">
            Esta a\xE7\xE3o excluir\xE1 permanentemente as conversas
            selecionadas. N\xE3o ser\xE1 poss\xEDvel desfaz\xEA-la.
          </p>

        <div class="bd-modal-summary">
          <div class="bd-modal-summary-icon">
            ${lucideIcon("messages", 19)}
          </div>

          <div class="bd-modal-summary-copy">
            <strong>Conversas selecionadas</strong>
            <span>Confira a quantidade antes de continuar</span>
          </div>

          <strong class="bd-modal-count">${count}</strong>
        </div>

        ${unavailableCount > 0 ? `
              <p class="bd-modal-warning">
                ${unavailableCount} conversa(s) indispon\xEDvel(is)
                ser\xE3o ignoradas.
              </p>
            ` : ""}

        <div class="bd-modal-warning">
          ${lucideIcon("alert", 17)}
          <span>A exclus\xE3o \xE9 permanente.</span>
        </div>

        <div class="bd-modal-actions">
          <button type="button" class="bd-modal-cancel">
            Cancelar
          </button>

          <button type="button" class="bd-modal-confirm">
            ${lucideIcon("trash", 16)}
            Excluir ${count} ${count === 1 ? "conversa" : "conversas"}
          </button>
        </div>
      </section>
    `;
      const modal = overlay.querySelector(".bd-modal");
      const cancelButton = overlay.querySelector(".bd-modal-cancel");
      const confirmButton = overlay.querySelector(".bd-modal-confirm");
      const closeButton = overlay.querySelector(".bd-modal-close");
      let finished = false;
      function finish(confirmed) {
        if (finished) {
          return;
        }
        finished = true;
        document.removeEventListener("keydown", onKeyDown);
        if (closeActiveModal === finish) {
          closeActiveModal = null;
        }
        overlay.remove();
        resolve(confirmed);
      }
      function onKeyDown(event) {
        if (event.key === "Escape") {
          event.preventDefault();
          finish(false);
          return;
        }
        if (event.key !== "Tab") {
          return;
        }
        const focusable = [
          cancelButton,
          confirmButton,
          closeButton
        ];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      cancelButton.addEventListener("click", () => finish(false));
      closeButton.addEventListener("click", () => finish(false));
      confirmButton.addEventListener("click", () => finish(true));
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          finish(false);
        }
      });
      closeActiveModal = finish;
      document.addEventListener("keydown", onKeyDown);
      document.body.appendChild(overlay);
      modal.focus();
    });
  }

  // src/features/bulk-delete/bulk-deletion.js
  var bulkDeletionRunning = false;
  function setStatus(message, type = "info") {
    const status = document.querySelector("#bulk-delete-status");
    if (!status) {
      return;
    }
    status.textContent = message;
    status.dataset.type = type;
  }
  function setToolbarDisabled(disabled) {
    const toolbar = document.querySelector("#bulk-delete-toolbar");
    if (toolbar) {
      toolbar.querySelectorAll("button").forEach((button) => {
        button.disabled = disabled;
      });
    }
    document.querySelectorAll(".bulk-delete-checkbox").forEach((checkbox) => {
      checkbox.disabled = disabled;
    });
  }
  async function deleteSelectedConversations() {
    if (bulkDeletionRunning) {
      return;
    }
    const selectedIds = getSelectedConversationIds();
    if (selectedIds.length === 0) {
      setStatus(
        "Selecione ao menos uma conversa para excluir.",
        "warning"
      );
      return;
    }
    const availableIds = [];
    let unavailableCount = 0;
    for (const id of selectedIds) {
      if (findConversationLink(id)) {
        availableIds.push(id);
      } else {
        unavailableCount += 1;
      }
    }
    if (availableIds.length === 0) {
      setStatus(
        "Nenhuma das conversas selecionadas est\xE1 dispon\xEDvel na lista.",
        "warning"
      );
      return;
    }
    bulkDeletionRunning = true;
    setDeletionInProgress(true);
    setToolbarDisabled(true);
    try {
      const confirmed = await showDeleteConfirmation(
        availableIds.length,
        unavailableCount
      );
      if (!confirmed) {
        setStatus("Exclus\xE3o cancelada.", "neutral");
        return;
      }
      let deletedCount = 0;
      let failedTitle = null;
      let failedMessage = null;
      for (const [index, id] of availableIds.entries()) {
        const link = findConversationLink(id);
        const title = link ? getConversationTitle(link) : id;
        setStatus(
          `Excluindo conversa ${index + 1} de ${availableIds.length}: ${title}`
        );
        try {
          const deletedConversation = await deleteOneConversation(id);
          removeSelectedConversation(id);
          deletedCount += 1;
          setStatus(
            `Exclu\xEDdas ${deletedCount} de ${availableIds.length}. \xDAltima: ${deletedConversation.title}`
          );
        } catch (error) {
          failedTitle = title;
          failedMessage = error instanceof Error ? error.message : String(error);
          break;
        }
      }
      if (failedTitle) {
        setStatus(
          `Exclus\xE3o interrompida. ${deletedCount} conversa(s) exclu\xEDda(s). Falha em "${failedTitle}": ${failedMessage}`
        );
      } else {
        const unavailableMessage = unavailableCount > 0 ? ` ${unavailableCount} conversa(s) indispon\xEDvel(is) foram ignoradas.` : "";
        setStatus(
          `${deletedCount} conversa(s) exclu\xEDda(s) com sucesso.${unavailableMessage}`
        );
      }
    } finally {
      bulkDeletionRunning = false;
      setDeletionInProgress(false);
      setToolbarDisabled(false);
      document.dispatchEvent(new CustomEvent("bulk-delete:finished"));
    }
  }

  // src/features/toolbar/toolbar.js
  var TOOLBAR_ID = "bulk-delete-toolbar";
  function updateCounter() {
    const counter = document.querySelector("#bulk-delete-counter");
    if (counter) {
      counter.textContent = `${getSelectedConversationCount()} selecionada(s)`;
    }
  }
  function setStatus2(message) {
    const status = document.querySelector("#bulk-delete-status");
    if (status) {
      status.textContent = message;
    }
  }
  function setToolbarDisabled2(disabled) {
    const toolbar = document.querySelector(`#${TOOLBAR_ID}`);
    toolbar?.querySelectorAll("button").forEach((button) => {
      button.disabled = disabled;
    });
    document.querySelectorAll(".bulk-delete-checkbox").forEach((checkbox) => {
      checkbox.disabled = disabled;
    });
  }
  function createToolbar() {
    let toolbar = document.querySelector(`#${TOOLBAR_ID}`);
    if (toolbar) {
      updateCounter();
      return toolbar;
    }
    toolbar = document.createElement("section");
    toolbar.id = TOOLBAR_ID;
    toolbar.setAttribute("aria-label", "Exclus\xE3o de conversas");
    toolbar.innerHTML = `
    <header class="bd-header">
      <div class="bd-brand">
        <div class="bd-brand-icon">
          ${lucideIcon("bot", 21)}
        </div>

        <div class="bd-brand-copy">
          <h2>ChatGPT Bulk Delete</h2>
          <p>Remova v\xE1rios chats de uma s\xF3 vez</p>
        </div>
      </div>

      <div class="bd-selection-badge">
        <span class="bd-selection-dot"></span>
        <span id="bulk-delete-counter" aria-live="polite">0 selecionada(s)</span>
      </div>
    </header>

    <div
      class="bd-status"
      id="bulk-delete-status"
      role="status"
      aria-live="polite"
    >
      Selecione as conversas que deseja excluir.
    </div>

    <div class="bd-divider"></div>

    <div class="bd-section-label">
      <span>SELE\xC7\xC3O</span>
    </div>

    <div class="bd-actions">
      <button
        type="button"
        id="bulk-select-visible"
        class="bd-button bd-button-secondary bd-button-select"
      >
        ${lucideIcon("checkSquare", 17)}
        <span>Selecionar vis\xEDveis</span>
      </button>

      <button
        type="button"
        id="bulk-clear-selection"
        class="bd-button bd-button-icon"
        aria-label="Limpar sele\xE7\xE3o"
        title="Limpar sele\xE7\xE3o"
      >
        ${lucideIcon("rotate", 17)}
      </button>
    </div>

    <button
      type="button"
      id="bulk-delete-selected"
      class="bd-button bd-button-danger bd-delete-button"
    >
      ${lucideIcon("trash", 17)}
      <span>Excluir selecionadas</span>
      ${lucideIcon("arrowRight", 17)}
    </button>

    <p class="bd-footer-note">
      ${lucideIcon("alert", 14)}
      <span>A exclus\xE3o \xE9 permanente.</span>
    </p>

    <div class="bd-footer">
      <small class="bd-footer-version">v1.0.0</small>

      <button
        type="button"
        id="bulk-open-extension-settings"
        class="bd-footer-manage"
      >
        Gerenciar extens\xE3o
        ${lucideIcon("arrowRight", 13)}
      </button>
    </div>
  `;
    document.body.appendChild(toolbar);
    toolbar.querySelector("#bulk-select-visible").addEventListener("click", () => {
      const ids = getConversationLinks().map(getConversationId).filter(Boolean);
      selectConversations(ids);
      document.dispatchEvent(
        new CustomEvent("bulk-delete:selection-changed")
      );
      setStatus2(`${ids.length} conversa(s) vis\xEDvel(is) selecionada(s).`);
    });
    toolbar.querySelector("#bulk-clear-selection").addEventListener("click", () => {
      clearSelection();
      document.dispatchEvent(
        new CustomEvent("bulk-delete:selection-changed")
      );
      setStatus2("Sele\xE7\xE3o limpa.");
    });
    toolbar.querySelector("#bulk-delete-selected").addEventListener("click", () => {
      void deleteSelectedConversations();
    });
    toolbar.querySelector("#bulk-open-extension-settings").addEventListener("click", () => {
      chrome.runtime.sendMessage({
        action: "open-extension-settings"
      });
    });
    updateCounter();
    return toolbar;
  }

  // src/content.js
  var CHECKBOX_CLASS = "bulk-delete-checkbox";
  var TOOLBAR_ID2 = "bulk-delete-toolbar";
  var observerScheduled = false;
  function addCheckbox(link) {
    if (link.querySelector(`.${CHECKBOX_CLASS}`)) {
      return;
    }
    const id = getConversationId(link);
    if (!id) {
      return;
    }
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = CHECKBOX_CLASS;
    checkbox.dataset.conversationId = id;
    checkbox.checked = isConversationSelected(id);
    checkbox.disabled = isDeletionInProgress();
    checkbox.setAttribute("aria-label", "Selecionar conversa");
    checkbox.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    checkbox.addEventListener("change", () => {
      if (isDeletionInProgress()) {
        checkbox.checked = isConversationSelected(id);
        return;
      }
      toggleConversationSelection(id, checkbox.checked);
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
        checkbox.dataset.conversationId = id;
        checkbox.checked = isConversationSelected(id);
        checkbox.disabled = isDeletionInProgress();
      }
    });
    updateCounter();
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
  function registerAudiowideFont() {
    const font = new FontFace(
      "Audiowide",
      `url("${chrome.runtime.getURL("assets/fonts/audiowide-regular.woff2")}")`,
      {
        weight: "400",
        style: "normal"
      }
    );
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((error) => {
      console.error("Erro ao carregar Audiowide:", error);
    });
  }
  function initialize() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", initialize, {
        once: true
      });
      return;
    }
    createToolbar();
    refreshCheckboxes();
    document.addEventListener("bulk-delete:selection-changed", () => {
      refreshCheckboxes();
    });
    document.addEventListener("bulk-delete:finished", () => {
      setToolbarDisabled2(false);
      refreshCheckboxes();
    });
    const observer = new MutationObserver((mutations) => {
      const toolbarMissing = !document.getElementById(TOOLBAR_ID2);
      const conversationListChanged = mutations.some((mutation) => {
        const changedNodes = [
          ...mutation.addedNodes,
          ...mutation.removedNodes
        ];
        return changedNodes.some((node) => {
          if (!(node instanceof Element)) {
            return false;
          }
          if (node.closest(`#${TOOLBAR_ID2}`)) {
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
      subtree: true
    });
  }
  registerAudiowideFont();
  initialize();
})();
