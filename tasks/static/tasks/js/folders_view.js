
document.getElementById('create-folder-button').addEventListener('click', function() {
    const title = document.getElementById('folder-title').value;

    // Проверка на пустое значение
    if (!title) {
        document.getElementById('response-message').innerText = 'Название папки не может быть пустым.';
        return;
    }

    // Отправка AJAX-запроса
    fetch('add_folder/', {  // Убедитесь, что URL соответствует вашему маршруту
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Если вы используете CSRF-токены
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
        // Очистить поле ввода
        document.getElementById('folder-title').value = '';
    })
    .catch(error => {
        document.getElementById('response-message').innerText = error.message;
    });
});

// Функция для получения CSRF-токена из cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Проверяем, начинается ли cookie с нужного имени
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

