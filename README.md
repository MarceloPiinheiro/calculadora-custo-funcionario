# 💼 Calculadora de Custo de Funcionário & Salário Líquido (2026)

Simulador web desenvolvido para oferecer uma estimativa rápida e transparente do **salário líquido do colaborador** e do **custo total mensal para a empresa** (incluindo encargos patronais e provisões), aplicando as tabelas e regras trabalhistas vigentes no Brasil em **2026**.

🔗 **Acesse a aplicação online:** [Clique aqui para testar a calculadora](https://marcelopiinheiro.github.io/calculadora-custo-funcionario/)

---

## 🎯 Objetivo do Projeto
Unir a vivência prática na rotina de **Departamento Pessoal e Folha de Pagamento** com o desenvolvimento de software, transformando regras tributárias complexas em uma ferramenta ágil para atendimento inicial a clientes e simulação de contratações.

---

## ⚙️ Regras de Negócio Implementadas (Base 2026)

### 1. Descontos do Colaborador
* **INSS Progressivo (Tabela 2026):** Cálculo exato por faixas salariais (7,5%, 9%, 12% e 14%) respeitando o salário mínimo de R$ 1.621,00 e o teto previdenciário de R$ 8.475,55.
* **IRRF (Lei nº 15.270/2025):**
  * **Isenção total** para rendimentos tributáveis até **R$ 5.000,00** (redutor máximo de R$ 312,89).
  * **Regra de transição gradual** para rendimentos entre **R$ 5.000,01 e R$ 7.350,00**, aplicando a fórmula oficial de redução escalonada (`978,62 - 0,133145 × rendimento`).
  * **Comparativo automático:** Avalia a base pela **Dedução Legal** (INSS + R$ 189,59 por dependente) versus o **Desconto Simplificado Mensal** (R$ 607,20), aplicando sempre o cenário mais vantajoso ao trabalhador.

### 2. Encargos e Provisões da Empresa
* **Simples Nacional (Anexos I, II, III e V):** Salário Bruto + FGTS (8%) + Provisões e reflexos de FGTS. Isento de CPP, RAT e Terceiros na folha.
* **Simples Nacional (Anexo IV):** Salário Bruto + FGTS (8%) + INSS Patronal (20%) + **RAT configurável** (1% leve, 2% médio ou 3% grave).
* **Lucro Presumido / Lucro Real:** Salário Bruto + FGTS (8%) + INSS Patronal (20%) + **RAT configurável** + **Terceiros / Sistema S** (alíquota editável, padrão 5,8%).
* **Provisões Mensais:** Cálculo automático de **13º Salário** (1/12 = 8,33%), **Férias + 1/3 Constitucional** (11,11%) e **Encargos sobre as provisões** (FGTS + Patronal + RAT + Terceiros conforme o regime).

---

## ✨ Recursos da Interface
* **Cálculo em Tempo Real:** Atualização instantânea dos valores e do impacto percentual (`% do salário`) a cada alteração nos campos.
* **Campos Dinâmicos:** Exibição condicional dos seletores de RAT e Terceiros apenas nos regimes tributários em que há incidência.
* **Tema Claro e Escuro Automático:** Adaptação nativa à preferência do sistema operacional do usuário (`prefers-color-scheme`).

---

## 🛠️ Tecnologias Utilizadas
* **HTML5:** Estruturação semântica e responsiva (`viewport-fit=cover`, `inputmode`).
* **CSS3:** Variáveis CSS, Grid Layout fluido e suporte nativo a Light/Dark Mode.
* **JavaScript (ES6+):** Separação centralizada das tabelas (`const T`), cálculo puro e renderização dinâmica da tabela de resultados.
* **Git & GitHub Pages:** Versionamento semântico e hospedagem estática.

---

## 👨‍💻 Autor
Desenvolvido por **Marcelo Pinheiro** — Estudante de Análise e Desenvolvimento de Sistemas (ADS) e profissional de Departamento Pessoal.