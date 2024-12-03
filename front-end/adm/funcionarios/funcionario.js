let employees = [];

// Função para buscar os dados dos funcionários
async function fetchEmployees() {
    try {
        const response = await fetch("/clinica-estetica/back-end/api/getEmployees.php", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar funcionários: " + response.statusText);
        }

        employees = await response.json();
        console.log(employees);

        if (!Array.isArray(employees) || employees.length === 0) {
            alert("Nenhum funcionário encontrado.");
            return;
        }

        displayEmployees(employees); // Exibe os dados dos funcionários
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        alert("Não foi possível carregar os funcionários. Tente novamente mais tarde.");
    }
}

// Função para exibir os dados dos funcionários na tabela
function displayEmployees(employees) {
    const tabelaFuncs = document.getElementById("tabelaFuncs");
    tabelaFuncs.innerHTML = ""; // Limpa a tabela antes de preencher com novos dados

    employees.forEach((employee) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.cpf}</td>
            <td>${employee.role}</td>
            <td>${employee.schedule}</td>
            <td>
                <button class="editar" onclick="alterEmployee(${employee.id})">
                    <p>Editar</p>
                    <img src="../image/edit.png" alt="">
                </button>
                <button class="deleta" onclick="deleteEmployee(${employee.id})">
                    <p>Deletar</p>
                    <img src="../image/delete.png" alt="">
                </button>
            </td>
        `;
        tabelaFuncs.appendChild(row);
    });
}

// Função para abrir o modal de adicionar funcionário
function openAddEmployeeModal() {
    const modal = document.getElementById("modalForm");
    modal.style.display = "flex";
}

// Função para fechar o modal
function closeModalFunction() {
    const modal = document.getElementById("modalForm");
    modal.style.display = "none";
}

// Função para salvar o novo funcionário
async function saveNewEmployee(data) {
    try {
        const response = await fetch("/clinica-estetica/back-end/api/registerEmployee.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            fetchEmployees(); // Atualiza a lista de funcionários
            closeModalFunction();
        } else {
            throw new Error("Erro ao adicionar funcionário.");
        }
    } catch (error) {
        console.error("Erro ao adicionar funcionário:", error);
        alert("Não foi possível adicionar o funcionário.");
    }
}

// Adiciona o evento de submit ao formulário de adicionar funcionário
document.getElementById("addForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const newEmployee = {
        name: document.getElementById("name").value,
        cpf: document.getElementById("cpf").value,
        role: document.getElementById("role").value,
        schedule: document.getElementById("schedule").value
    };
    
    await saveNewEmployee(newEmployee);
    
    // Fecha o modal após salvar
    document.getElementById("modalForm").style.display = "none";
    
    // Limpa o formulário
    this.reset();
    
    // Atualiza a lista de funcionários
    await fetchEmployees();
});

// Função para alterar os dados de um funcionário
async function alterEmployee(id) {
    // Forçar a comparação do id para string
    const employee = employees.find(emp => String(emp.id) === String(id));
    if (!employee) {
        alert("Funcionário não encontrado.");
        return;
    }

    document.getElementById("editName").value = employee.name;
    document.getElementById("editCpf").value = employee.cpf;
    document.getElementById("editRole").value = employee.role;
    document.getElementById("editSchedule").value = employee.schedule;

    const modal = document.getElementById("modalEditEmployee");
    modal.style.display = "flex";

    // Função para fechar o modal
    function closeModalFunction() {
        modal.style.display = "none"; // Fecha o modal ao definir o display como 'none'
    }

    // Ao clicar no botão de fechar (X), fecha o modal
    document.getElementById("closeModalEditEmployee").onclick = closeModalFunction;

    // Ao clicar fora do modal, fecha o modal
    modal.onclick = (e) => { 
        if (e.target === modal) closeModalFunction();
    };

    const form = document.getElementById("editEmployeeForm");
    form.onsubmit = async (e) => {
        e.preventDefault();

        const updatedEmployee = {
            id,
            name: document.getElementById("editName").value,
            cpf: document.getElementById("editCpf").value,
            role: document.getElementById("editRole").value,
            schedule: document.getElementById("editSchedule").value,
        };

        try {
            const response = await fetch(`/clinica-estetica/back-end/api/updateEmployee.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedEmployee),
            });

            if (response.ok) {
                fetchEmployees(); // Atualiza a lista de funcionários
                closeModalFunction();
            } else {
                throw new Error("Erro ao atualizar funcionário.");
            }
        } catch (error) {
            console.error("Erro ao atualizar funcionário:", error);
            alert("Não foi possível atualizar o funcionário.");
        }
    };
}

// Função para deletar um funcionário
async function deleteEmployee(id) {
    const modal = document.getElementById("modalDeleteEmployee");
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmDeleteButton");

    // Exibe o modal de confirmação
    modal.style.display = "flex";

    // Função para fechar o modal
    function closeModalFunction() {
        modal.style.display = "none"; // Fecha o modal ao definir o display como 'none'
    }

    // Ao clicar no botão de fechar (X), fecha o modal
    document.getElementById("closeModalDeleteEmployee").onclick = closeModalFunction;

    // Ao clicar fora do modal, fecha o modal
    modal.onclick = (e) => { 
        if (e.target === modal) closeModalFunction();
    };

    cancelButton.onclick = closeModalFunction;

    // Se o usuário confirmar, faz a requisição para excluir o funcionário
    confirmButton.onclick = async () => {
        try {
            const response = await fetch(`/clinica-estetica/back-end/api/deleteEmployee.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                fetchEmployees(); // Atualiza a lista de funcionários
                closeModalFunction(); // Fecha o modal
            } else {
                alert("Erro ao deletar funcionário.");
            }
        } catch (error) {
            console.error("Erro ao deletar funcionário:", error);
            alert("Não foi possível deletar o funcionário.");
        }
    };
}

// Adiciona os eventos aos botões de adicionar e fechar
document.getElementById("adicionar").addEventListener("click", openAddEmployeeModal);
document.getElementById("closeModal").addEventListener("click", closeModalFunction);

// Carrega os funcionários ao carregar a página
fetchEmployees();
