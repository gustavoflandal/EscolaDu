# Manual de Padrões de UI/UX - Sistema EscolaDu

## 📋 Índice Completo

Este manual documenta todos os padrões de design, componentes e diretrizes de interface do sistema EscolaDu. O objetivo é garantir consistência visual e funcional em todas as telas.

### Documentos do Manual

1. **[01-SISTEMA-CORES.md](./01-SISTEMA-CORES.md)** - Paleta de cores, significados e aplicações
2. **[02-TIPOGRAFIA.md](./02-TIPOGRAFIA.md)** - Fontes, tamanhos e hierarquia de texto
3. **[03-ESPACAMENTOS.md](./03-ESPACAMENTOS.md)** - Sistema de margens, paddings e gaps
4. **[04-BOTOES.md](./04-BOTOES.md)** - Estilos, variantes e estados de botões
5. **[05-FORMULARIOS.md](./05-FORMULARIOS.md)** - Inputs, selects, validações e labels
6. **[06-TABELAS.md](./06-TABELAS.md)** - Estrutura, paginação e ações em tabelas
7. **[07-MODAIS.md](./07-MODAIS.md)** - Estrutura, tamanhos e comportamentos de modais
8. **[08-CARDS.md](./08-CARDS.md)** - Containers, cards e painéis
9. **[09-NAVEGACAO.md](./09-NAVEGACAO.md)** - Menu, breadcrumbs e navegação
10. **[10-ICONES.md](./10-ICONES.md)** - Biblioteca de ícones e uso
11. **[11-FEEDBACK.md](./11-FEEDBACK.md)** - Toasts, alerts e loading states
12. **[12-LAYOUT.md](./12-LAYOUT.md)** - Estrutura de páginas e responsividade
13. **[13-COMPONENTES-ESPECIAIS.md](./13-COMPONENTES-ESPECIAIS.md)** - Badges, avatares e outros

---

## 🎯 Princípios de Design

### 1. Consistência Visual
- Manter padrões uniformes em toda a aplicação
- Usar sempre as classes CSS definidas no manual
- Seguir a paleta de cores estabelecida

### 2. Hierarquia Clara
- Títulos devem seguir ordem lógica (H1 > H2 > H3)
- Elementos importantes devem ter maior destaque visual
- Ações primárias devem se destacar das secundárias

### 3. Acessibilidade
- Contraste adequado entre texto e fundo
- Labels descritivos em todos os inputs
- Estados de foco visíveis

### 4. Responsividade
- Design mobile-first
- Breakpoints consistentes
- Adaptação de layout para diferentes telas

### 5. Feedback ao Usuário
- Indicações visuais de loading
- Mensagens de sucesso/erro claras
- Estados disabled e hover visíveis

---

## 🛠️ Stack Tecnológico

- **Framework Frontend**: Vue 3 (Composition API)
- **CSS Framework**: Tailwind CSS 3.x
- **Ícones**: SVG inline (Heroicons pattern)
- **Notificações**: Vue Toastification
- **Roteamento**: Vue Router 4
- **Build**: Vite

---

## 📦 Estrutura de Arquivos

```
frontend/src/
├── layouts/
│   └── DashboardLayout.vue       # Layout principal do sistema
├── views/                         # Páginas da aplicação
│   ├── auth/
│   ├── alunos/
│   ├── professores/
│   ├── turmas/
│   └── ...
├── components/                    # Componentes reutilizáveis
│   ├── objetivos-aprendizagem/
│   └── programas-ensino/
├── services/                      # Serviços de API
├── stores/                        # Gerenciamento de estado (Pinia)
├── composables/                   # Composables Vue
└── style.css                      # Estilos globais e classes Tailwind
```

---

## 🎨 Tailwind Configuration

**Arquivo**: `frontend/tailwind.config.js`

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

---

## 📝 Como Usar Este Manual

### Para Desenvolvedores

1. **Antes de criar uma nova tela**: Consulte os documentos relevantes (layout, formulários, tabelas)
2. **Ao adicionar um botão**: Verifique [04-BOTOES.md](./04-BOTOES.md) para usar a classe correta
3. **Para feedback visual**: Consulte [11-FEEDBACK.md](./11-FEEDBACK.md)
4. **Dúvidas sobre cores**: Veja [01-SISTEMA-CORES.md](./01-SISTEMA-CORES.md)

### Para Designers

1. Use este manual como referência para manter consistência
2. Novos componentes devem seguir os padrões existentes
3. Alterações em padrões devem ser documentadas aqui

### Para QA

1. Verifique se novas telas seguem os padrões documentados
2. Teste estados de hover, focus, disabled e loading
3. Valide responsividade em diferentes tamanhos de tela

---

## 🔄 Atualizações do Manual

**Data de Criação**: 31 de outubro de 2025
**Última Atualização**: 31 de outubro de 2025
**Versão**: 1.0.0

### Histórico de Mudanças

- **v1.0.0** (31/10/2025): Criação inicial do manual completo

---

## 👥 Contribuindo

Para sugerir melhorias ou reportar inconsistências:

1. Documente o problema encontrado
2. Sugira a solução alinhada aos padrões existentes
3. Atualize este manual após aprovação

---

**Nota**: Este manual é um documento vivo e deve ser atualizado sempre que novos padrões forem estabelecidos ou padrões existentes forem modificados.
