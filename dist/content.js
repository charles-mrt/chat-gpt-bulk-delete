(()=>{function g(){return Array.from(document.querySelectorAll('a[href*="/c/"]')).filter(e=>{let t=new URL(e.href,window.location.origin);return t.origin===window.location.origin&&/^\/c\/[^/]+$/.test(t.pathname)})}function p(e){return new URL(e.href,window.location.origin).pathname.match(/^\/c\/([^/]+)$/)?.[1]??null}function M(e){let t=e.parentElement;for(;t&&t!==document.body;){let n=t.contains(e),o=[...t.querySelectorAll('button[aria-label="A\xE7\xF5es do chat"]')];if(n&&o.length===1)return t;t=t.parentElement}return null}function w(e){return e?.innerText?.trim()??""}function v(e){return g().find(t=>{let n=t.getBoundingClientRect();return p(t)===e&&n.width>0&&M(t)!==null})??null}function N(e){return e instanceof Element?e.matches('a[href*="/c/"]')||e.querySelector('a[href*="/c/"]')!==null:!1}var m=new Set,y=!1;function O(){return Array.from(m)}function F(){return m.size}function x(e){return m.has(e)}function P(e,t){return y||!e?!1:(t?m.add(e):m.delete(e),!0)}function H(e){if(y)return!1;for(let t of e)t&&m.add(t);return!0}function K(){return y?!1:(m.clear(),!0)}function V(e){m.delete(e)}function q(e){y=!!e}function E(){return y}function h(e){return(e??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim().toLowerCase()}function C(e,t=5e3,n="elemento"){return new Promise((o,i)=>{let d=Date.now();function s(){let l=e();if(l){o(l);return}if(Date.now()-d>=t){i(new Error(`Tempo limite aguardando: ${n}.`));return}setTimeout(s,100)}s()})}function Q(e){return e.getAttribute("data-state")!=="open"?null:Array.from(document.querySelectorAll('[role="menu"][data-state="open"]')).find(t=>{let n=t.getBoundingClientRect();return n.width>0&&n.height>0})??null}function Y(e){return Array.from(e.querySelectorAll('[role="menuitem"]')).find(t=>h(t.textContent)==="excluir")??null}function ee(){return Array.from(document.querySelectorAll("form")).find(e=>{let t=h(e.innerText);return t.includes("excluir chat?")&&t.includes("nao sera possivel desfazer")})??null}function te(e){return Array.from(e.querySelectorAll('button[type="submit"]')).find(t=>h(t.textContent)==="excluir chat")??null}function ne(e){return Array.from(e.querySelectorAll("button")).find(t=>h(t.textContent)==="cancelar")??null}async function U(e){let t=v(e);if(!t)throw new Error("A conversa n\xE3o est\xE1 dispon\xEDvel na barra lateral. Ela n\xE3o foi exclu\xEDda.");let n=w(t);if(!n)throw new Error("N\xE3o foi poss\xEDvel identificar o t\xEDtulo da conversa. Exclus\xE3o interrompida.");let i=M(t)?.querySelector('button[aria-label="A\xE7\xF5es do chat"]');if(!i)throw new Error(`N\xE3o foi poss\xEDvel encontrar o bot\xE3o de a\xE7\xF5es da conversa "${n}".`);if(document.querySelector('[role="menu"][data-state="open"]'))throw new Error("J\xE1 existe um menu aberto. Feche-o antes de continuar.");i.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0,pointerId:1,pointerType:"mouse",isPrimary:!0,button:0,buttons:1}));let d=await C(()=>Q(i),5e3,`menu de a\xE7\xF5es da conversa "${n}"`);(await C(()=>Y(d),5e3,`op\xE7\xE3o Excluir da conversa "${n}"`)).click();let l=await C(ee,5e3,'di\xE1logo "Excluir chat?"'),u=h(l.innerText),c=h(n);if(!u.includes(c))throw ne(l)?.click(),new Error(`O t\xEDtulo no di\xE1logo n\xE3o corresponde a "${n}". A opera\xE7\xE3o foi interrompida.`);return(await C(()=>te(l),5e3,`bot\xE3o de confirma\xE7\xE3o da conversa "${n}"`)).click(),await C(()=>v(e)?null:!0,1e4,`desaparecimento da conversa "${n}"`),{id:e,title:n}}var oe={bot:`
    <path d="M12 6V2H8" />
    <path d="M15 11v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
    <path d="M9 11v2" />
  `,messages:`
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  `,checkSquare:`
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="m9 12 2 2 4-4" />
  `,listChecks:`
    <path d="m3 5 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
    <path d="m3 11 2 2 4-4" />
    <path d="m3 17 2 2 4-4" />
  `,trash:`
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="m19 6-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  `,rotate:`
    <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
    <path d="M8 16H3v5" />
  `,alert:`
    <path d="m10.29 3.86-8.3 14.36A2 2 0 0 0 3.72 21h16.56a2 2 0 0 0 1.73-2.78l-8.3-14.36a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  `,x:`
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  `,arrowRight:`
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  `,close:`
  <path d="M18 6 6 18" />
  <path d="m6 6 12 12" />
`};function a(e,t=18){let n=oe[e];return n?`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${t}"
      height="${t}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      ${n}
    </svg>
  `:""}var S=null;function _(e,t=0){return S?.(!1),new Promise(n=>{let o=document.createElement("div");o.id="bulk-delete-modal",o.className="bd-modal-overlay",o.innerHTML=`
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
            ${a("trash",23)}
          </div>

          <h2 id="bd-modal-title">Excluir conversas?</h2>
        </div>

          <button
            type="button"
            class="bd-modal-close"
            aria-label="Cancelar e fechar"
          >
            ${a("x",18)}
          </button>

          <p id="bd-modal-description">
            Esta a\xE7\xE3o excluir\xE1 permanentemente as conversas
            selecionadas. N\xE3o ser\xE1 poss\xEDvel desfaz\xEA-la.
          </p>

        <div class="bd-modal-summary">
          <div class="bd-modal-summary-icon">
            ${a("messages",19)}
          </div>

          <div class="bd-modal-summary-copy">
            <strong>Conversas selecionadas</strong>
            <span>Confira a quantidade antes de continuar</span>
          </div>

          <strong class="bd-modal-count">${e}</strong>
        </div>

        ${t>0?`
              <p class="bd-modal-warning">
                ${t} conversa(s) indispon\xEDvel(is)
                ser\xE3o ignoradas.
              </p>
            `:""}

        <div class="bd-modal-warning">
          ${a("alert",17)}
          <span>A exclus\xE3o \xE9 permanente.</span>
        </div>

        <div class="bd-modal-actions">
          <button type="button" class="bd-modal-cancel">
            Cancelar
          </button>

          <button type="button" class="bd-modal-confirm">
            ${a("trash",16)}
            Excluir ${e} ${e===1?"conversa":"conversas"}
          </button>
        </div>
      </section>
    `;let i=o.querySelector(".bd-modal"),d=o.querySelector(".bd-modal-cancel"),s=o.querySelector(".bd-modal-confirm"),l=o.querySelector(".bd-modal-close"),u=!1;function c(r){u||(u=!0,document.removeEventListener("keydown",b),S===c&&(S=null),o.remove(),n(r))}function b(r){if(r.key==="Escape"){r.preventDefault(),c(!1);return}if(r.key!=="Tab")return;let A=[d,s,l],z=A[0],R=A[A.length-1];r.shiftKey&&document.activeElement===z?(r.preventDefault(),R.focus()):!r.shiftKey&&document.activeElement===R&&(r.preventDefault(),z.focus())}d.addEventListener("click",()=>c(!1)),l.addEventListener("click",()=>c(!1)),s.addEventListener("click",()=>c(!0)),o.addEventListener("click",r=>{r.target===o&&c(!1)}),S=c,document.addEventListener("keydown",b),document.body.appendChild(o),i.focus()})}var T=!1;function f(e,t="info"){let n=document.querySelector("#bulk-delete-status");n&&(n.textContent=e,n.dataset.type=t)}function j(e){let t=document.querySelector("#bulk-delete-toolbar");t&&t.querySelectorAll("button").forEach(n=>{n.disabled=e}),document.querySelectorAll(".bulk-delete-checkbox").forEach(n=>{n.disabled=e})}async function G(){if(T)return;let e=O();if(e.length===0){f("Selecione ao menos uma conversa para excluir.","warning");return}let t=[],n=0;for(let o of e)v(o)?t.push(o):n+=1;if(t.length===0){f("Nenhuma das conversas selecionadas est\xE1 dispon\xEDvel na lista.","warning");return}T=!0,q(!0),j(!0);try{if(!await _(t.length,n)){f("Exclus\xE3o cancelada.","neutral");return}let i=0,d=null,s=null;for(let[l,u]of t.entries()){let c=v(u),b=c?w(c):u;f(`Excluindo conversa ${l+1} de ${t.length}: ${b}`);try{let r=await U(u);V(u),i+=1,f(`Exclu\xEDdas ${i} de ${t.length}. \xDAltima: ${r.title}`)}catch(r){d=b,s=r instanceof Error?r.message:String(r);break}}if(d)f(`Exclus\xE3o interrompida. ${i} conversa(s) exclu\xEDda(s). Falha em "${d}": ${s}`);else{let l=n>0?` ${n} conversa(s) indispon\xEDvel(is) foram ignoradas.`:"";f(`${i} conversa(s) exclu\xEDda(s) com sucesso.${l}`)}}finally{T=!1,q(!1),j(!1),document.dispatchEvent(new CustomEvent("bulk-delete:finished"))}}var I="bulk-delete-toolbar";function k(){let e=document.querySelector("#bulk-delete-counter");e&&(e.textContent=`${F()} selecionada(s)`)}function W(e){let t=document.querySelector("#bulk-delete-status");t&&(t.textContent=e)}function J(e){document.querySelector(`#${I}`)?.querySelectorAll("button").forEach(n=>{n.disabled=e}),document.querySelectorAll(".bulk-delete-checkbox").forEach(n=>{n.disabled=e})}function re(e){let t=document.querySelector("#bulk-delete-toolbar-toggle");t||(t=document.createElement("button"),t.id="bulk-delete-toolbar-toggle",t.type="button",t.className="bd-toolbar-toggle",t.setAttribute("aria-label","Mostrar toolbar"),t.title="Mostrar toolbar",t.innerHTML=a("bot",18),document.body.appendChild(t));let n=e.querySelector(".close-toolbar");if(e.dataset.toggleInitialized==="true"){t.hidden=!e.classList.contains("bd-toolbar-hidden");return}e.dataset.toggleInitialized="true",n?.addEventListener("click",()=>{e.classList.contains("bd-toolbar-minimizing")||e.classList.contains("bd-toolbar-hidden")||(e.classList.remove("bd-toolbar-restoring"),e.classList.remove("bd-toolbar-minimizing"),e.offsetWidth,e.classList.add("bd-toolbar-minimizing"))}),t.addEventListener("click",()=>{e.classList.contains("bd-toolbar-hidden")&&(t.hidden=!0,e.classList.remove("bd-toolbar-hidden"),e.classList.remove("bd-toolbar-minimizing"),e.classList.remove("bd-toolbar-restoring"),e.offsetWidth,e.classList.add("bd-toolbar-restoring"))}),e.addEventListener("animationend",o=>{o.target===e&&(o.animationName==="bd-toolbar-minimize"&&(e.classList.remove("bd-toolbar-minimizing"),e.classList.add("bd-toolbar-hidden"),t.hidden=!1),o.animationName==="bd-toolbar-restore"&&e.classList.remove("bd-toolbar-restoring"))}),t.hidden=!e.classList.contains("bd-toolbar-hidden")}function B(){let e=document.querySelector(`#${I}`);return e?(k(),e):(e=document.createElement("section"),e.id=I,e.setAttribute("aria-label","Exclus\xE3o de conversas"),e.innerHTML=`
    <header class="bd-header">
      <div class="bd-brand">
        <div class="bd-brand-icon">
          ${a("bot",21)}
        </div>
         <button class="close-toolbar" type="button">${a("close",21)}</button> 
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
        ${a("checkSquare",17)}
        <span>Selecionar vis\xEDveis</span>
      </button>

      <button
        type="button"
        id="bulk-clear-selection"
        class="bd-button bd-button-icon"
        aria-label="Limpar sele\xE7\xE3o"
        title="Limpar sele\xE7\xE3o"
      >
        ${a("rotate",17)}
      </button>
    </div>

    <button
      type="button"
      id="bulk-delete-selected"
      class="bd-button bd-button-danger bd-delete-button"
    >
      ${a("trash",17)}
      <span>Excluir selecionadas</span>
      ${a("arrowRight",17)}
    </button>

    <p class="bd-footer-note">
      ${a("alert",14)}
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
        ${a("arrowRight",13)}
      </button>
    </div>
  `,document.body.appendChild(e),e.classList.add("bd-entering"),e.addEventListener("animationend",t=>{t.target===e&&t.animationName==="bd-enter"&&e.classList.remove("bd-entering")}),re(e),e.querySelector("#bulk-select-visible").addEventListener("click",()=>{let t=g().map(p).filter(Boolean);H(t),document.dispatchEvent(new CustomEvent("bulk-delete:selection-changed")),W(`${t.length} conversa(s) vis\xEDvel(is) selecionada(s).`)}),e.querySelector("#bulk-clear-selection").addEventListener("click",()=>{K(),document.dispatchEvent(new CustomEvent("bulk-delete:selection-changed")),W("Sele\xE7\xE3o limpa.")}),e.querySelector("#bulk-delete-selected").addEventListener("click",()=>{G()}),e.querySelector("#bulk-open-extension-settings").addEventListener("click",()=>{chrome.runtime.sendMessage({action:"open-extension-settings"})}),k(),e)}var $="bulk-delete-checkbox",X="bulk-delete-toolbar",D=!1;function ae(e){if(e.querySelector(`.${$}`))return;let t=p(e);if(!t)return;let n=document.createElement("input");n.type="checkbox",n.className=$,n.dataset.conversationId=t,n.checked=x(t),n.disabled=E(),n.setAttribute("aria-label","Selecionar conversa"),n.addEventListener("click",o=>{o.stopPropagation()}),n.addEventListener("change",()=>{if(E()){n.checked=x(t);return}P(t,n.checked),k()}),e.prepend(n)}function L(){g().forEach(e=>{ae(e);let t=e.querySelector(`.${$}`),n=p(e);t&&n&&(t.dataset.conversationId=n,t.checked=x(n),t.disabled=E())}),k()}function ie(){D||(D=!0,requestAnimationFrame(()=>{D=!1,document.body&&(B(),L())}))}function se(){new FontFace("Audiowide",`url("${chrome.runtime.getURL("assets/fonts/audiowide-regular.woff2")}")`,{weight:"400",style:"normal"}).load().then(t=>{document.fonts.add(t)}).catch(t=>{console.error("Erro ao carregar Audiowide:",t)})}function Z(){if(!document.body){document.addEventListener("DOMContentLoaded",Z,{once:!0});return}B(),L(),document.addEventListener("bulk-delete:selection-changed",()=>{L()}),document.addEventListener("bulk-delete:finished",()=>{J(!1),L()}),new MutationObserver(t=>{let n=!document.getElementById(X),o=t.some(i=>[...i.addedNodes,...i.removedNodes].some(s=>!(s instanceof Element)||s.closest(`#${X}`)||s.matches(`.${$}`)?!1:N(s)));(n||o)&&ie()}).observe(document.body,{childList:!0,subtree:!0})}se();Z();})();
