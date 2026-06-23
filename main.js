const botao = document.getElementById("calcular");

botao.addEventListener("click", () => {
    const custo = Number(document.getElementById("custo").value);
    const tempo = document.getElementById("tempo").value;
    const [horas, minutos] = tempo.split(":").map(Number);

    const tempoEmHoras = horas + minutos / 60;

    console.log(tempoEmHoras);

    const valorHora = Number(document.getElementById("valorhora").value);
    const lucro = Number(document.getElementById("lucro").value);
    const maoDeObra = tempoEmHoras * valorHora;
    const valorBase = custo + maoDeObra;
    const valorFinal = valorBase * (1 + lucro / 100);

    document.getElementById("resultado").textContent =
        `Preço sugerido: R$ ${valorFinal.toFixed(2)}`;
    
});
