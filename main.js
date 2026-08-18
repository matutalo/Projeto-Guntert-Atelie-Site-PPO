const botao = document.getElementById("calcular")
const lista = document.getElementById("lista_materiais")
const itensCalculoContainer = document.getElementById("itens_calculo")

const getLocalStorage = () => JSON.parse(localStorage.getItem('materiasPrimas')) ?? []
const setLocalStorage = (array) => localStorage.setItem('materiasPrimas', JSON.stringify(array))

const createLocal = (materiaPrima) => {
    const materiasPrimas = getLocalStorage()
    materiasPrimas.push(materiaPrima)
    setLocalStorage(materiasPrimas)
}

const updateLocal = (index, materiaPrima) => {
    const materiasPrimas = getLocalStorage()
    materiasPrimas[index] = materiaPrima
    setLocalStorage(materiasPrimas)
}

const deleteLocal = (index) => {
    const materiasPrimas = getLocalStorage()
    materiasPrimas.splice(index, 1)
    setLocalStorage(materiasPrimas)
}

const update = () => {
    limpar()
    mostrarItens()
}

const limpar = () => {
    lista.innerHTML = ''
}

const itensCalculo = []

const unidadeLabel = (metodo) => { //deveria ter sabido isso antes
    switch (metodo) {
        case "area": return "cm²"
        case "peso": return "g"
        case "volume": return "L"
        default: return "un"
    }
}

const renderItensCalculo = () => {
    if (itensCalculo.length === 0) {
        itensCalculoContainer.innerHTML = "<p>Nenhum produto selecionado.</p>"
        return
    }

    itensCalculoContainer.innerHTML = ""
    itensCalculo.forEach((item, i) => {
        let camposQuantidade

        if (item.metodo === "area") {
            camposQuantidade = `
        <input 
            type="number" 
            class="altura_calculo" 
            data-i="${i}" 
            min="0"
            placeholder="Altura (cm)"
            value="${item.altura || ''}"
        >
        x
        <input 
            type="number" 
            class="largura_calculo" 
            data-i="${i}" 
            min="0"
            placeholder="Largura (cm)"
            value="${item.largura || ''}"
        >
        <span class="area_resultado">
            = ${(item.quantidade || 0).toFixed(2)} cm²
        </span>
    `
        } else {
            camposQuantidade = `
        <input 
            type="number" 
            class="qtd_calculo" 
            data-i="${i}" 
            min="0"
            placeholder="Qtd usada (${unidadeLabel(item.metodo)})"
            value="${item.quantidade || ''}"
        >
    `
        }

        itensCalculoContainer.innerHTML += `
            <div class="item_calculo">
                <span>${item.nome} — R$ ${item.precoUnitario.toFixed(4)} / ${unidadeLabel(item.metodo)}</span>
                ${camposQuantidade}
                <button type="button" class="remover_calculo" data-i="${i}">Remover</button>
            </div>
        `
    })
}


itensCalculoContainer.addEventListener("input", (e) => {
    const i = Number(e.target.dataset.i)
    if (Number.isNaN(i)) return

    if (e.target.classList.contains("qtd_calculo")) {
        itensCalculo[i].quantidade = Number(e.target.value) || 0
    }

    if (e.target.classList.contains("altura_calculo") || e.target.classList.contains("largura_calculo")) {
        const altura = Number(document.querySelector(`.altura_calculo[data-i="${i}"]`).value) || 0
        const largura = Number(document.querySelector(`.largura_calculo[data-i="${i}"]`).value) || 0

        itensCalculo[i].altura = altura
        itensCalculo[i].largura = largura
        itensCalculo[i].quantidade = altura * largura

        const resultado = itensCalculoContainer.querySelectorAll(".item_calculo")[i].querySelector(".area_resultado")
        resultado.textContent = `= ${itensCalculo[i].quantidade.toFixed(2)} cm²`
    }
})

itensCalculoContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remover_calculo")) {
        const i = Number(e.target.dataset.i)
        itensCalculo.splice(i, 1)
        renderItensCalculo()
    }
})

const calcularCustoMateriaisSelecionados = () => {
    return itensCalculo.reduce((total, item) => total + (item.precoUnitario * (item.quantidade || 0)), 0)
}

// cálculo do preço final
botao.addEventListener("click", () => {
    const custoMateriais = calcularCustoMateriaisSelecionados()
    const custoManual = Number(document.getElementById("custo").value) || 0

    const tempo = document.getElementById("tempo").value
    let tempoEmHoras = 0
    if (tempo) {
        const [horas, minutos] = tempo.split(":").map(Number)
        tempoEmHoras = horas + minutos / 60
    }

    const valorHora = Number(document.getElementById("valorhora").value) || 0
    const lucro = Number(document.getElementById("lucro").value) || 0

    const maoDeObra = tempoEmHoras * valorHora
    const valorBase = custoMateriais + custoManual + maoDeObra
    const valorFinal = valorBase * (1 + lucro / 100)

    document.getElementById("resultado_calculo").textContent =
        `Custo materiais: R$ ${custoMateriais.toFixed(2)} — Preço sugerido: R$ ${valorFinal.toFixed(2)}`
})

// cálculo do armazenamento de matérias-primas

const metodo_custo = document.getElementById("metodo_custo")
const opcoes = document.getElementById("opcoes")

metodo_custo.addEventListener("change", function () {
    if (metodo_custo.value === "area") {
        opcoes.innerHTML = `
        <p>Preço do produto é de 
        <input type="number" id="preco" name="preco" placeholder="R$" required>
        a cada 
        <input type="number" id="area_altura" name="area_altura" placeholder="cm" required>
        x
        <input type="number" id="area_largura" name="area_largura" placeholder="cm" required>
        </p>
        `
    } else if (metodo_custo.value === "peso") {
        opcoes.innerHTML = `
        <p>Preço do produto é de 
        <input type="number" id="preco" name="preco" placeholder="R$" required>
        a cada 
        <input type="number" id="medida" name="medida" placeholder="g" required>
        gramas</p>
        `
    } else if (metodo_custo.value === "volume") {
        opcoes.innerHTML = `
        <p>Preço do produto é de 
        <input type="number" id="preco" name="preco" placeholder="R$" required>
        a cada 
        <input type="number" id="medida" name="medida" placeholder="L" required>
        litros</p>
        `
    } else {
        opcoes.innerHTML = `
        <p>Preço do produto é de 
        <input type="number" id="preco" name="preco" placeholder="R$" required>
        a cada 
        <input type="number" id="medida" name="medida" placeholder="U" required>
        unidades</p>
        `
    }
})

const form = document.getElementById("form_nome_metodo")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    salvar_funcao()
})

const salvar_funcao = () => {
    const nome = document.getElementById("nome_produto").value
    const preco = Number(document.getElementById("preco").value)
    let materiaPrima

    if (metodo_custo.value === "area") {
        const altura = Number(document.getElementById("area_altura").value)
        const largura = Number(document.getElementById("area_largura").value)
        const area = altura * largura
        const precoPorCm2 = preco / area

        materiaPrima = {
            nome: nome,
            metodo: "area",
            preco: preco,
            medida: area,
            precoUnitario: precoPorCm2,
        }
    } else if (metodo_custo.value === "peso") {
        const medida = Number(document.getElementById("medida").value)
        const precoPorGrama = preco / medida

        materiaPrima = {
            nome: nome,
            metodo: "peso",
            preco: preco,
            medida: medida,
            precoUnitario: precoPorGrama,
        }

    } else if (metodo_custo.value === "volume") {
        const medida = Number(document.getElementById("medida").value)
        const precoPorLitro = preco / medida

        materiaPrima = {
            nome: nome,
            metodo: "volume",
            preco: preco,
            medida: medida,
            precoUnitario: precoPorLitro,
        }
    } else {
        const medida = Number(document.getElementById("medida").value)
        const precoPorUnidade = preco / medida

        materiaPrima = {
            nome: nome,
            metodo: "unidade",
            preco: preco,
            medida: medida,
            precoUnitario: precoPorUnidade,
        }
    }

    createLocal(materiaPrima)
    mostrarItens()
}

function mostrarItens() {
    const materiasPrimas = getLocalStorage()
    lista.innerHTML = ""
    materiasPrimas.forEach((materiaPrima, index) => {
        lista.innerHTML += `
            <div class="materia">
                <h3>${materiaPrima.nome}</h3>
                <p>R$ ${materiaPrima.preco.toFixed(2)} a cada ${materiaPrima.medida} ${unidadeLabel(materiaPrima.metodo)}</p>
                <button type="button" class="adicionar_calculo" data-index="${index}">Adicionar ao cálculo</button>
                <button type="button" class="delete_armazenamento" data-index="${index}">Deletar</button>
            </div>
        `
    })
}

lista.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete_armazenamento")) {
        const index = Number(e.target.dataset.index)
        deleteLocal(index)
        mostrarItens()
    }

    if (e.target.classList.contains("adicionar_calculo")) {
        const index = Number(e.target.dataset.index)
        const materiasPrimas = getLocalStorage()
        const materiaPrima = materiasPrimas[index]
        itensCalculo.push({
            nome: materiaPrima.nome,
            metodo: materiaPrima.metodo,
            precoUnitario: materiaPrima.precoUnitario,
            quantidade: 0
        })
        renderItensCalculo()
    }
})

mostrarItens()
renderItensCalculo()
