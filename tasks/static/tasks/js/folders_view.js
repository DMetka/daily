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
        // Здесь вы можете добавить логику для обновления списка папок, если это необходимо
    })
    .catch(error => {
        console.error("Ошибка:", error);
        document.getElementById('folder-message').innerText = error.message;
    });
});

// Функция для получения CSRF-токена
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Проверяем, содержит ли cookie имя, которое мы ищем
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Функция для загрузки содержимого папки
function loadFolderContents(folderId) {
    const folderContents = document.getElementById(`folder-${folderId}-contents`);
    // Проверяем, загружено ли содержимое
    if (folderContents.style.display === "none") {
        fetch(`/get_folder_contents/${folderId}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке содержимого папки');
                }
                return response.json();
            })
            .then(data => {
                folderContents.innerHTML = '';
                data.tasks.forEach(task => {
                    const itemElement = document.createElement('div');
                    itemElement.textContent = task.title;
                    folderContents.appendChild(itemElement);
                });
                folderContents.style.display = "block";
            })
            .catch(error => {
                console.error("Ошибка:", error);
            });
    } else {
        folderContents.style.display = "none";
    }
}