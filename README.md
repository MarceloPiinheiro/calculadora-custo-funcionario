# calculadora-custo-funcionario
# 💼 Calculadora de Custo de Funcionário & Salário Líquido (2026)

Simulador web desenvolvido para calcular o **salário líquido do colaborador** e o **custo mensal direto para a empresa** conforme o regime tributário, aplicando as tabelas e regras trabalhistas vigentes no Brasil em **2026**.

🔗 **Acesse a aplicação online:** [Clique aqui para testar a calculadora](https://marcelopiinheiro.github.io/calculadora-custo-funcionario/)

---

## 🎯 Objetivo do Projeto
Unir a vivência prática na rotina de **Departamento Pessoal e Folha de Pagamento** com o desenvolvimento de software, transformando regras tributárias complexas em uma ferramenta limpa, precisa e acessível.

---

## ⚙️ Regras de Negócio Implementadas (Base 2026)

### 1. Descontos do Colaborador
* **INSS Progressivo (Tabela 2026):** Cálculo por faixas salariais (7,5%, 9%, 12% e 14%) respeitando o salário mínimo de R$ 1.621,00 e o teto previdenciário de R$ 8.475,55.
* **IRRF (Lei nº 15.270/2025):**
  * **Isenção total** para rendimentos tributáveis até **R$ 5.000,00**.
  * **Regra de transição gradual** para rendimentos entre **R$ 5.000,01 e R$ 7.350,00**, aplicando a fórmula oficial de redução escalonada para evitar degraus tributários.
  * **Comparativo automático:** Avalia a base pela **Dedução Legal** (INSS + R$ 189,59 por dependente) versus o **Desconto Simplificado Mensal** (R$ 607,20), aplicando sempre o cenário mais vantajoso ao trabalhador.

### 2. Encargos Patronais por Regime Tributário
* **Simples Nacional (Anexos I, II, III e V):** Salário Bruto + FGTS (8%). Isento de CPP, RAT e Terceiros na folha.
* **Simples Nacional (Anexo IV):** Salário Bruto + FGTS (8%) + INSS Patronal (20%) + RAT médio (2%).
* **Lucro Presumido / Lucro Real:** Salário Bruto + FGTS (8%) + INSS Patronal (20%) + RAT médio (2%) + Terceiros/Sistema S (5,8%).

---

## 🛠️ Tecnologias Utilizadas
* **HTML5:** Estruturação semântica e acessível do formulário.
* **CSS3:** Estilização responsiva utilizando CSS Variables e Grid Layout.
* **JavaScript (ES6+):** Separação entre tabelas de configuração (`TABELAS_2026`), regras de cálculo puras e manipulação do DOM.
* **Git & GitHub Pages:** Versionamento semântico por etapas e hospedagem estática.

---

## 🚀 Próximas Evoluções (Roadmap)
- [ ] Incluir cálculo de provisões mensais (1/12 de Férias + 1/3 constitucional e 13º salário).
- [ ] Adicionar provisão de multa rescisória do FGTS (40%).
- [ ] Permitir inclusão de proventos variáveis (Horas Extras 50%/100% e reflexo no DSR).
- [ ] Exportação do demonstrativo em PDF / formato de impressão.

---

## 👨‍💻 Autor
Desenvolvido por **Marcelo Pinheiro** — Estudante de Análise e Desenvolvimento de Sistemas (ADS) e profissional de Departamento Pessoal.