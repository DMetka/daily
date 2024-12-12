document.getElementById('create-folder-button').addEventListener('click', function() {
    const title = document.getElementById('folder-title').value;
    if (!title) {
        alert('Пожалуйста, введите название папки.');
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
            throw new Error('Ошибка при создании папки');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('folder-message').innerText = data.message;
    })
    .catch(error => {
        console.error("Ошибка:", error);
        document.getElementById('folder-message').innerText = error.message;
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


function loadFolderContents(folderId) {
    const folderContents = document.getElementById(`folder-${folderId}-contents`);
    if (folderContents.style.display === 'block') {
        folderContents.style.display = 'none';
        return;
    }
    folderContents.style.display = 'block';
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
                        <h3 class="task-title">${task.title}</h3>
                    `;
                    taskElement.addEventListener('click', () => {
                        alert(`Вы выбрали задачу: ${task.title}${task.deadline ? `\nДедлайн: ${task.deadline}` : ''}`);
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