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
        descontoSimplificado: 607.20, // 25% da faixa inicial (R$ 2.428,80)
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
        simples: 0.00,          // Anexos I, II, III e V (CPP no DAS)
        simples_anexo4: 0.22,   // 20% INSS Patronal + 2% RAT médio
        lucro_presumido: 0.278  // 20% INSS Patronal + 2% RAT médio + 5.8% Terceiros
    }
};

/**
 * Calcula o desconto progressivo do INSS (Tabela 2026)
 */
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

/**
 * Calcula o imposto bruto pela tabela progressiva tradicional
 */
function calcularImpostoTabelaProgressiva(baseCalculo) {
    if (baseCalculo <= 0) return 0;

    const faixa = TABELAS_2026.irrf.faixasProgressivas.find(f => baseCalculo <= f.limite);
    const imposto = (baseCalculo * faixa.aliquota) - faixa.deducao;
    return Math.max(0, imposto);
}

/**
 * Calcula o IRRF considerando as regras de 2026:
 * 1. Isenção total para rendimentos até R$ 5.000,00
 * 2. Redutor gradual para rendimentos entre R$ 5.000,01 e R$ 7.350,00
 * 3. Comparação entre Dedução Legal e Desconto Simplificado
 */
function calcularIRRF(salarioBruto, inss, dependentes) {
    const cfg = TABELAS_2026.irrf;

    // Regra 1: Isenção total até R$ 5.000,00
    if (salarioBruto <= cfg.limiteIsencaoTotal) {
        return 0.00;
    }

    // Cálculo das bases (Legal vs. Simplificada)
    const deducaoLegal = inss + (dependentes * cfg.deducaoPorDependente);
    const baseLegal = Math.max(0, salarioBruto - deducaoLegal);
    const baseSimplificada = Math.max(0, salarioBruto - cfg.descontoSimplificado);

    // Apura o menor imposto pela tabela progressiva tradicional
    const impostoLegal = calcularImpostoTabelaProgressiva(baseLegal);
    const impostoSimplificado = calcularImpostoTabelaProgressiva(baseSimplificada);
    const impostoApurado = Math.min(impostoLegal, impostoSimplificado);

    // Regra 2: Faixa de transição (R$ 5.000,01 até R$ 7.350,00)
    if (salarioBruto <= cfg.limiteTransicao) {
        const redutor = Math.max(
            0,
            cfg.fatorFixoTransicao - (cfg.aliquotaReducaoTransicao * salarioBruto)
        );
        const impostoFinal = Math.max(0, impostoApurado - redutor);
        return Number(impostoFinal.toFixed(2));
    }

    // Regra 3: Acima de R$ 7.350,00 (sem redutor adicional)
    return Number(impostoApurado.toFixed(2));
}

/**
 * Calcula o custo mensal direto da empresa por regime tributário
 */
function calcularCustoEmpresa(salarioBruto, regime) {
    const encargos = TABELAS_2026.encargosEmpresa;
    const valorFGTS = salarioBruto * encargos.fgts;
    const aliquotaPatronal = encargos[regime] ?? 0;
    const valorPatronal = salarioBruto * aliquotaPatronal;

    const custoTotal = salarioBruto + valorFGTS + valorPatronal;
    return Number(custoTotal.toFixed(2));
}

/**
 * Controlador principal da interface (DOM)
 */
function inicializarCalculadora() {
    const formulario = document.getElementById("form-calculadora");
    if (!formulario) return;

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const salarioBruto = parseFloat(document.getElementById("salario_bruto").value) || 0;
        const dependentes = parseInt(document.getElementById("dependentes").value, 10) || 0;
        const regime = document.getElementById("regime_empresa").value;

        if (salarioBruto < 0 || dependentes < 0) {
            alert("Por favor, insira valores positivos para salário e dependentes.");
            return;
        }

        const valorINSS = calcularINSS(salarioBruto);
        const valorIRRF = calcularIRRF(salarioBruto, valorINSS, dependentes);
        const salarioLiquido = Number((salarioBruto - valorINSS - valorIRRF).toFixed(2));
        const custoEmpresa = calcularCustoEmpresa(salarioBruto, regime);

        document.getElementById("inss").value = valorINSS.toFixed(2);
        document.getElementById("irrf").value = valorIRRF.toFixed(2);
        document.getElementById("salario_liquido").value = salarioLiquido.toFixed(2);
        document.getElementById("custo_empresa").value = custoEmpresa.toFixed(2);
    });
}

document.addEventListener("DOMContentLoaded", inicializarCalculadora);