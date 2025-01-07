const fileListContainer = document.getElementById('file-list');
const totalPagesContainer = document.getElementById('total-pages');
const fileDetailsSection = document.getElementById('file-details');
const quantidadeInput = document.getElementById('quantidade');
const totalPriceContainer = document.getElementById('total-price');

let totalPages = 0; // Variável global para armazenar o total de páginas

document.getElementById('upload').addEventListener('change', async (event) => {
    const files = event.target.files;
    fileListContainer.innerHTML = '';
    totalPages = 0;

    for (const file of files) {
        const pages = await getPdfPageCount(file);
        totalPages += pages;

        const fileInfo = document.createElement('p');
        fileInfo.className = 'file-info';
        fileInfo.textContent = `${file.name}: ${pages} págs`;
        fileListContainer.appendChild(fileInfo);
    }

    totalPagesContainer.textContent = totalPages;
    fileDetailsSection.style.display = 'block';
    calcular(); // Atualiza o valor automaticamente após o upload dos arquivos
});

function getPdfPageCount(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const typedArray = new Uint8Array(this.result);
            pdfjsLib.getDocument(typedArray).promise.then(pdf => {
                resolve(pdf.numPages);
            }).catch(err => {
                console.error(err);
                reject(0);
            });
        };
        fileReader.readAsArrayBuffer(file);
    });
}

// Função para calcular o orçamento
function calcular() {
    const cor = parseFloat(document.querySelector('input[name="cor"]:checked').value);
    const tamanho = parseFloat(document.querySelector('input[name="tamanho"]:checked').value);
    const estilo = parseFloat(document.querySelector('input[name="estilo"]:checked').value);
    const encadernacao = parseFloat(document.querySelector('input[name="encadernacao"]:checked').value);
    const papel = parseFloat(document.querySelector('input[name="papel"]:checked').value);
    const quantidade = parseInt(quantidadeInput.value);

    const custoPorPagina = cor + tamanho + estilo + encadernacao + papel;
    const valorTotal = custoPorPagina * totalPages * quantidade;

    totalPriceContainer.textContent = `R$ ${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}

// Atualiza o cálculo sempre que o valor da quantidade mudar
quantidadeInput.addEventListener('input', calcular);

// Opcional: atualiza o cálculo também quando o usuário muda outras opções
document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', calcular);
});

function limpar() {
    location.reload();
}
