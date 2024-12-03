let products = [];

// Função para buscar os dados dos produtos
async function fetchProducts() {
    try {
        const response = await fetch("/clinica-estetica/back-end/api/getProducts.php", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar produtos: " + response.statusText);
        }

        products = await response.json();
        console.log(products);

        if (!Array.isArray(products) || products.length === 0) {
            alert("Nenhum produto encontrado.");
            return;
        }

        displayProducts(products); // Exibe os dados dos produtos
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        alert("Não foi possível carregar os produtos. Tente novamente mais tarde.");
    }
}

// Função para exibir os dados dos produtos na tabela
function displayProducts(products) {
    const tabelaProdutos = document.getElementById("tabelaProdutos");
    tabelaProdutos.innerHTML = ""; // Limpa a tabela antes de preencher com novos dados

    products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name_product}</td>
            <td>${product.price_product}</td>
            <td>${product.description_product}</td>
            <td>
                <button class="editar" onclick="alterProduct(${product.id_product})">
                    <p>Editar</p>
                    <img src="../image/edit.png" alt="">
                </button>
                <button class="deleta" onclick="deleteProduct(${product.id_product})">
                    <p>Deletar</p>
                    <img src="../image/delete.png" alt="">
                </button>
            </td>
        `;
        tabelaProdutos.appendChild(row);
    });
}

// Função para abrir o modal de adicionar produto
function openAddProductModal() {
    const modal = document.getElementById("modalForm");
    modal.style.display = "flex";
}

// Função para fechar o modal
function closeModalFunction() {
    const modal = document.getElementById("modalForm");
    modal.style.display = "none";
}

// Função para salvar o novo produto
async function saveNewProduct(data) {
    try {
        const response = await fetch("/clinica-estetica/back-end/api/registerProduct.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            fetchProducts(); // Atualiza a lista de produtos
            closeModalFunction();
        } else {
            throw new Error("Erro ao adicionar produto.");
        }
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert("Não foi possível adicionar o produto.");
    }
}

// Adiciona o evento de submit ao formulário de adicionar produto
document.getElementById("addForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const newProduct = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        description: document.getElementById("description").value,
    };
    
    await saveNewProduct(newProduct);
    
    // Fecha o modal após salvar
    document.getElementById("modalForm").style.display = "none";
    
    // Limpa o formulário
    this.reset();
    
    // Atualiza a lista de produtos
    await fetchProducts();
});

// Função para alterar os dados de um produto
async function alterProduct(id) {
    // Encontrar o produto pelo id
    const product = products.find(prod => String(prod.id_product) === String(id)); // Usando id_product
    if (!product) {
        alert("Produto não encontrado.");
        return;
    }

    // Preenche os campos do formulário com os dados do produto
    document.getElementById("editName").value = product.name_product; // Usando name_product
    document.getElementById("editPrice").value = product.price_product; // Usando price_product
    document.getElementById("editDescription").value = product.description_product; // Usando description_product

    const modal = document.getElementById("modalEditProduct");
    modal.style.display = "flex";

    // Função para fechar o modal
    function closeModalFunction() {
        modal.style.display = "none"; // Fecha o modal ao definir o display como 'none'
    }

    // Ao clicar no botão de fechar (X), fecha o modal
    document.getElementById("closeModalEditProduct").onclick = closeModalFunction;

    // Ao clicar fora do modal, fecha o modal
    modal.onclick = (e) => { 
        if (e.target === modal) closeModalFunction();
    };

    const form = document.getElementById("editProductForm");
    form.onsubmit = async (e) => {
        e.preventDefault();

        const updatedProduct = {
            id: id, // Passa o id correto
            name_product: document.getElementById("editName").value, // Usando name_product
            price_product: document.getElementById("editPrice").value, // Usando price_product
            description_product: document.getElementById("editDescription").value, // Usando description_product
        };

        try {
            const response = await fetch(`/clinica-estetica/back-end/api/updateProduct.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct),
            });

            if (response.ok) {
                fetchProducts(); // Atualiza a lista de produtos
                closeModalFunction();
            } else {
                throw new Error("Erro ao atualizar produto.");
            }
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            alert("Não foi possível atualizar o produto.");
        }
    };
}

// Função para deletar um produto
async function deleteProduct(id) {
    const modal = document.getElementById("modalDeleteProduct");
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmDeleteButton");

    // Exibe o modal de confirmação
    modal.style.display = "flex";

    // Função para fechar o modal
    function closeModalFunction() {
        modal.style.display = "none"; // Fecha o modal ao definir o display como 'none'
    }

    // Ao clicar no botão de fechar (X), fecha o modal
    document.getElementById("closeModalDeleteProduct").onclick = closeModalFunction;

    // Ao clicar fora do modal, fecha o modal
    modal.onclick = (e) => { 
        if (e.target === modal) closeModalFunction();
    };

    cancelButton.onclick = closeModalFunction;

    // Se o usuário confirmar, faz a requisição para excluir o produto
    confirmButton.onclick = async () => {
        try {
            const response = await fetch(`/clinica-estetica/back-end/api/deleteProduct.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                fetchProducts(); // Atualiza a lista de produtos
                closeModalFunction(); // Fecha o modal
            } else {
                alert("Erro ao deletar produto.");
            }
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            alert("Não foi possível deletar o produto.");
        }
    };
}

// Adiciona os eventos aos botões de adicionar e fechar
document.getElementById("adicionar").addEventListener("click", openAddProductModal);
document.getElementById("closeModal").addEventListener("click", closeModalFunction);

// Carrega os produtos ao carregar a página
fetchProducts();
