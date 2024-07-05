document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';

    const usersTable = document.getElementById('users-table');
    const formContainer = document.getElementById('form-container');
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const createBtn = document.getElementById('create-btn');
    let users = [];
    let editingUser = null;

    function fetchUsers() {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                users = data;
                renderUsers();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function renderUsers() {
        usersTable.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <button class="edit-btn" data-id="${user.id}">Edit</button>
            <button class="delete-btn" data-id="${user.id}">Delete</button>
          </td>
        `;
            usersTable.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editUser);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteUser);
        });
    }

    function createUser() {
        formContainer.style.display = 'block';
        editingUser = null;
    }

    function saveUser() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        if (!name || !email) {
            alert('Both fields are required.');
            return;
        }
        const data = { name, email };

        if (editingUser) {
            fetch(`${apiUrl}/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(res => res.json())
                .then(updatedUser => {
                    const index = users.findIndex(u => u.id === updatedUser.id);
                    users[index] = updatedUser;
                    renderUsers();
                    cancelForm();
                })
                .catch(error => console.error('Error updating data:', error));
        } else {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(res => res.json())
                .then(newUser => {
                    users.push(newUser);
                    renderUsers();
                    cancelForm();
                })
                .catch(error => console.error('Error adding data:', error));
        }
    }

    function editUser(e) {
        const id = e.target.dataset.id;
        editingUser = users.find(u => u.id == id);
        nameInput.value = editingUser.name;
        emailInput.value = editingUser.email;
        formContainer.style.display = 'block';
    }

    function deleteUser(e) {
        const id = e.target.dataset.id;
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    users = users.filter(u => u.id != id);
                    renderUsers();
                } else {
                    console.error('Failed to delete data');
                }
            })
            .catch(error => console.error('Error deleting data:', error));
    }

    function cancelForm() {
        nameInput.value = '';
        emailInput.value = '';
        formContainer.style.display = 'none';
        editingUser = null;
    }

    createBtn.addEventListener('click', createUser);
    saveBtn.addEventListener('click', saveUser);
    cancelBtn.addEventListener('click', cancelForm);

    fetchUsers();
});