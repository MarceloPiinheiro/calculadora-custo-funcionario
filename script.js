/**
 * Configurações e Tabelas Tributárias Vigentes - Ano-Calendário 2026
 */
const TABELAS_2026 = {
    inss: [
        { limite: 1621.00, aliquota: 0.075 },
        { limite: 2902.84, aliquota: 0.09 },
        { limite: 4354.27, aliquota: 0.12 },
        { limite: 8475.55, aliquota: 0.14 }
    ],
    irrf: {
        deducaoPorDependente: 189.59,
        descontoSimplificado: 607.20,
        limiteIsencaoTotal: 5000.00,
        limiteTransicao: 7350.00,
        fatorFixoTransicao: 978.62,
        aliquotaReducaoTransicao: 0.133145,
        faixasProgressivas: [
            { limite: 2428.80, aliquota: 0.000, deducao: 0.00 },
            { limite: 2826.65, aliquota: 0.075, deducao: 182.16 },
            { limite: 3751.05, aliquota: 0.150, deducao: 394.16 },
            { limite: 4664.68, aliquota: 0.225, deducao: 675.49 },
            { limite: Infinity, aliquota: 0.275, deducao: 908.73 }
        ]
    },
    encargosEmpresa: {
        fgts: 0.08,
        regimes: {
            simples: {
                aliquotaPatronal: 0.00,
                labelEncargos: "",
                nota: "No Simples Nacional (exceto Anexo IV), o INSS patronal e o RAT já estão incluídos no DAS e não há contribuição a terceiros."
            },
            simples_anexo4: {
                aliquotaPatronal: 0.22, // 20% INSS Patronal + 2% RAT médio
                labelEncargos: "INSS Patronal + RAT (22%)",
                nota: "No Simples Nacional (Anexo IV), a empresa recolhe INSS Patronal (20%) e RAT sobre a folha, mas permanece isenta da contribuição a Terceiros (Sistema S)."
            },
            lucro_presumido: {
                aliquotaPatronal: 0.278, // 20% INSS + 2% RAT + 5.8% Terceiros
                labelEncargos: "Patronal + RAT + Terceiros (27,8%)",
                nota: "No Lucro Presumido / Real, além do FGTS (8%), incidem INSS Patronal (20%), RAT (média de 2%) e Terceiros / Sistema S (5,8%) sobre a folha e provisões."
            }
        }
    }
};

const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

function formatarMoeda(valor, negativo = false) {
    const formatado = formatadorMoeda.format(Math.abs(valor));
    return negativo && valor > 0 ? `-${formatado}` : (negativo ? `-R$ 0,00` : formatado);
}

function formatarPercentual(valor, salarioBruto, negativo = false) {
    if (!salarioBruto || salarioBruto <= 0) return "-";
    const perc = (valor / salarioBruto) * 100;
    const texto = `${perc.toFixed(1).replace(".", ",")}%`;
    return negativo && valor > 0 ? `-${texto}` : texto;
}

function calcularINSS(salarioBruto) {
    const faixas = TABELAS_2026.inss;
    const tetoMaximo = faixas[faixas.length - 1].limite;
    let inssTotal = 0;
    let salarioBase = Math.min(salarioBruto, tetoMaximo);
    let limiteAnterior = 0;

    for (const faixa of faixas) {
        if (salarioBase > limiteAnterior) {
            const parcelaFaixa = Math.min(salarioBase, faixa.limite) - limiteAnterior;
            inssTotal += parcelaFaixa * faixa.aliquota;
            limiteAnterior = faixa.limite;
        } else {
            break;
        }
    }
    return Number(inssTotal.toFixed(2));
}

function calcularImpostoTabelaProgressiva(baseCalculo) {
    if (baseCalculo <= 0) return 0;
    const faixa = TABELAS_2026.irrf.faixasProgressivas.find(f => baseCalculo <= f.limite);
    return Math.max(0, (baseCalculo * faixa.aliquota) - faixa.deducao);
}

function calcularIRRF(salarioBruto, inss, dependentes) {
    const cfg = TABELAS_2026.irrf;
    if (salarioBruto <= cfg.limiteIsencaoTotal) return 0.00;

    const deducaoLegal = inss + (dependentes * cfg.deducaoPorDependente);
    const baseLegal = Math.max(0, salarioBruto - deducaoLegal);
    const baseSimplificada = Math.max(0, salarioBruto - cfg.descontoSimplificado);

    const impostoLegal = calcularImpostoTabelaProgressiva(baseLegal);
    const impostoSimplificado = calcularImpostoTabelaProgressiva(baseSimplificada);
    const impostoApurado = Math.min(impostoLegal, impostoSimplificado);

    if (salarioBruto <= cfg.limiteTransicao) {
        const redutor = Math.max(0, cfg.fatorFixoTransicao - (cfg.aliquotaReducaoTransicao * salarioBruto));
        return Number(Math.max(0, impostoApurado - redutor).toFixed(2));
    }

    return Number(impostoApurado.toFixed(2));
}

function atualizarCalculadora() {
    const salarioBruto = Math.max(0, parseFloat(document.getElementById("salario_bruto").value) || 0);
    const dependentes = Math.max(0, parseInt(document.getElementById("dependentes").value, 10) || 0);
    const regimeKey = document.getElementById("regime_empresa").value;
    const configRegime = TABELAS_2026.encargosEmpresa.regimes[regimeKey];

    // Atualiza nota explicativa do regime
    document.getElementById("nota_regime").textContent = configRegime.nota;

    // 1. Cálculos do Funcionário
    const valorINSS = calcularINSS(salarioBruto);
    const valorIRRF = calcularIRRF(salarioBruto, valorINSS, dependentes);
    const salarioLiquido = Number(Math.max(0, salarioBruto - valorINSS - valorIRRF).toFixed(2));

    // 2. Cálculos da Empresa (Folha + Provisões)
    const aliquotaFGTS = TABELAS_2026.encargosEmpresa.fgts;
    const aliquotaPatronal = configRegime.aliquotaPatronal;

    const fgtsMensal = Number((salarioBruto * aliquotaFGTS).toFixed(2));
    const encargosFolha = Number((salarioBruto * aliquotaPatronal).toFixed(2));

    // Provisões mensais (1/12 de 13º e 1/12 de Férias + 1/3 constitucional)
    const provisao13 = Number((salarioBruto / 12).toFixed(2));
    const provisaoFerias = Number(((salarioBruto / 12) * (4 / 3)).toFixed(2));

    // Encargos incidentes sobre as provisões (FGTS + Patronal do regime)
    const baseProvisoes = provisao13 + provisaoFerias;
    const encargosProvisoes = Number((baseProvisoes * (aliquotaFGTS + aliquotaPatronal)).toFixed(2));

    const custoTotalEmpresa = Number((
        salarioBruto + fgtsMensal + encargosFolha + provisao13 + provisaoFerias + encargosProvisoes
    ).toFixed(2));

    // 3. Atualiza Cards de Destaque
    document.getElementById("res_custo_empresa").textContent = formatarMoeda(custoTotalEmpresa);
    document.getElementById("res_salario_liquido").textContent = formatarMoeda(salarioLiquido);

    // 4. Atualiza Tabela - Funcionário
    document.getElementById("tab_func_bruto").textContent = formatarMoeda(salarioBruto);
    document.getElementById("perc_func_bruto").textContent = formatarPercentual(salarioBruto, salarioBruto);

    document.getElementById("tab_func_inss").textContent = formatarMoeda(valorINSS, true);
    document.getElementById("perc_func_inss").textContent = formatarPercentual(valorINSS, salarioBruto, true);

    document.getElementById("tab_func_irrf").textContent = formatarMoeda(valorIRRF, true);
    document.getElementById("perc_func_irrf").textContent = formatarPercentual(valorIRRF, salarioBruto, true);

    document.getElementById("tab_func_liquido").textContent = formatarMoeda(salarioLiquido);
    document.getElementById("perc_func_liquido").textContent = formatarPercentual(salarioLiquido, salarioBruto);

    // 5. Atualiza Tabela - Empresa
    document.getElementById("tab_emp_bruto").textContent = formatarMoeda(salarioBruto);
    document.getElementById("perc_emp_bruto").textContent = formatarPercentual(salarioBruto, salarioBruto);

    document.getElementById("tab_emp_fgts").textContent = formatarMoeda(fgtsMensal);
    document.getElementById("perc_emp_fgts").textContent = formatarPercentual(fgtsMensal, salarioBruto);

    const linhaEncargosFolha = document.getElementById("linha_encargos_folha");
    if (aliquotaPatronal > 0) {
        linhaEncargosFolha.style.display = "grid";
        document.getElementById("label_encargos_folha").textContent = configRegime.labelEncargos;
        document.getElementById("tab_emp_encargos_folha").textContent = formatarMoeda(encargosFolha);
        document.getElementById("perc_emp_encargos_folha").textContent = formatarPercentual(encargosFolha, salarioBruto);
    } else {
        linhaEncargosFolha.style.display = "none";
    }

    document.getElementById("tab_emp_prov_13").textContent = formatarMoeda(provisao13);
    document.getElementById("perc_emp_prov_13").textContent = formatarPercentual(provisao13, salarioBruto);

    document.getElementById("tab_emp_prov_ferias").textContent = formatarMoeda(provisaoFerias);
    document.getElementById("perc_emp_prov_ferias").textContent = formatarPercentual(provisaoFerias, salarioBruto);

    document.getElementById("tab_emp_encargos_prov").textContent = formatarMoeda(encargosProvisoes);
    document.getElementById("perc_emp_encargos_prov").textContent = formatarPercentual(encargosProvisoes, salarioBruto);

    document.getElementById("tab_emp_total").textContent = formatarMoeda(custoTotalEmpresa);
    document.getElementById("perc_emp_total").textContent = formatarPercentual(custoTotalEmpresa, salarioBruto);
}

document.addEventListener("DOMContentLoaded", () => {
    ["salario_bruto", "regime_empresa", "dependentes"].forEach((id) => {
        const elemento = document.getElementById(id);
        elemento.addEventListener("input", atualizarCalculadora);
        elemento.addEventListener("change", atualizarCalculadora);
    });
    atualizarCalculadora();
});