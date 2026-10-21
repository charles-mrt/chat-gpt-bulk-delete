# ChatGPT Bulk Delete

Uma extensão experimental para Google Chrome que permite selecionar e excluir múltiplas conversas do ChatGPT de forma prática e organizada.

## ✨ Funcionalidades

- **Seleção múltipla:** selecione individualmente as conversas que deseja excluir.
- **Selecionar conversas visíveis:** marque rapidamente todas as conversas atualmente visíveis na barra lateral.
- **Limpar seleção:** desmarque todas as conversas selecionadas.
- **Exclusão em lote:** exclua várias conversas em sequência.
- **Confirmação antes de excluir:** revise a ação antes de iniciar a exclusão.
- **Interface moderna:** painel integrado à interface do ChatGPT.
- **Ícones SVG:** interface com ícones vetoriais inspirados no Lucide.

## 🖥️ Prévia

![ChatGPT Bulk Delete](assets/screenshot-1.png)
![ChatGPT Bulk Delete](assets/screenshot-2.png)
## 📦 Instalação

Atualmente, a extensão pode ser instalada manualmente no Google Chrome, utilizando o modo de desenvolvedor.

1. Clone este repositório:

   ```bash
   git clone https://github.com/SEU_USUARIO/chatgpt-bulk-delete.git
   ```

2. Acesse `chrome://extensions` no Google Chrome.
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta do projeto que contém o arquivo `manifest.json`.
6. Acesse o [ChatGPT](https://chatgpt.com/) e atualize a página.

> **Observação:** substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub no comando de clonagem.

## 🚀 Como usar

1. Abra o ChatGPT e localize a barra lateral de conversas.
2. Utilize as caixas de seleção para marcar as conversas desejadas.
3. Utilize a opção **Selecionar visíveis** para marcar as conversas exibidas.
4. Confira a quantidade de conversas selecionadas no painel da extensão.
5. Clique em **Excluir selecionadas**.
6. Leia o aviso e confirme a operação para iniciar a exclusão.

**Atenção:** revise cuidadosamente a seleção antes de confirmar. A exclusão de conversas pode ser permanente.

## 📁 Estrutura do projeto

```text
chatgpt-bulk-delete/
├── manifest.json
├── assets/
│   ├── icon-16.png
│   ├── icon-48.png
│   ├── icon-128.png
│   └── screenshot.png
└── src/
    ├── content.js
    └── styles.css
```

- `manifest.json`: configurações, permissões e informações da extensão.
- `src/content.js`: lógica de seleção e exclusão das conversas.
- `src/styles.css`: estilos do painel e dos componentes visuais.
- `assets/`: ícones e recursos visuais da extensão.

## 🛠️ Tecnologias

- JavaScript
- CSS
- HTML e SVG
- Chrome Extensions API

## 🔄 Desenvolvimento

Após modificar os arquivos da extensão:

1. Acesse `chrome://extensions`.
2. Localize a extensão instalada.
3. Clique no botão de recarregar.
4. Atualize a página do ChatGPT para aplicar as alterações.

Como a extensão interage diretamente com a interface do ChatGPT, mudanças no site podem afetar seu funcionamento e exigir ajustes no código.

## 🔒 Privacidade

A extensão foi desenvolvida para realizar a seleção e a exclusão de conversas diretamente pela interface do ChatGPT.

Antes de utilizá-la, recomenda-se revisar o código-fonte, verificar as permissões solicitadas e avaliar eventuais comunicações externas. Não presuma que a extensão seja livre de riscos apenas por funcionar localmente no navegador.

## ⚠️ Aviso importante

Esta extensão é um **projeto experimental e independente**, sem vínculo oficial com a OpenAI.

O funcionamento depende da estrutura e do comportamento da interface do ChatGPT, que podem mudar sem aviso prévio. Por esse motivo, não há garantia de funcionamento contínuo, compatibilidade futura ou ausência de erros.

**O uso da extensão é de responsabilidade do próprio usuário e ocorre por sua conta e risco.** A exclusão de conversas pode ser permanente, e falhas na interface ou no processo de exclusão podem produzir resultados inesperados.

Antes de utilizar a extensão, revise o código-fonte, verifique as permissões e confirme cuidadosamente quais conversas serão excluídas.

## 📄 Licença

A licença deste projeto ainda não foi definida.

Até que uma licença seja adicionada ao repositório, não presuma que o código possa ser livremente modificado, redistribuído ou utilizado em outros projetos.

---

Desenvolvido para tornar a exclusão de conversas do ChatGPT mais prática e organizada.