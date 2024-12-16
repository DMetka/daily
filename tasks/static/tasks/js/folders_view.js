import { open } from './open_task_form.js'
document.getElementById('create-folder-button').addEventListener('click', function() {
    const title = document.getElementById('folder-title').value;
    if (!title) {
        document.getElementById('response-message').innerText = 'Название папки не может быть пустым.';
        return;
    }

    fetch('add_folder/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ title: title })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message);
            });
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('response-message').innerText = 'Папка успешно создана';
        document.getElementById('folder-title').value = '';
    })
    .catch(error => {
        document.getElementById('response-message').innerText = error.message;
    });
});


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', () => {
    const folderButtons = document.querySelectorAll('.btn-folder');
    folderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const folderId = button.dataset.folderId;
            loadFolderContents(folderId);
        });
    });
});

function loadFolderContents(folderId) {
    const folderContents = document.getElementById(`folder-${folderId}-contents`);
    if (folderContents.style.display === 'flex') {
        folderContents.style.display = 'none';
        return;
    }
    folderContents.style.display = 'flex';
    folderContents.innerHTML = '';
    fetch(`/get_folder_contents/${folderId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке содержимого папки');
            }
            return response.json();
        })
        .then(data => {
            if (data.tasks.length === 0) {
                folderContents.innerHTML = '<p>В этой папке нет задач!</p>';
            } else {
                data.tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task-item');
                    taskElement.innerHTML = `
                        <h2 class="task-title">${task.title}</h2>
                    `;
                    taskElement.addEventListener('click', () => {
                        open(task)
                    });
                    folderContents.appendChild(taskElement);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            folderContents.innerHTML = '<p>Ошибка при загрузке содержимого папки!</p>';
        });
}