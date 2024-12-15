document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-task-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-task-id');

            // Отправка запроса на удаление задачи
            fetch(`/delete_task/${taskId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') // Если используется CSRF
                }
            })
            .then(response => {
                if (response.ok) {
                    // Удаляем элемент из DOM
                    const taskElement = document.querySelector(`.my_task_area[data-task-id="${taskId}"]`);
                    if (taskElement) {
                        taskElement.remove();
                    }
                } else {
                    alert('Ошибка при удалении задачи');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        });
    });
});

// Функция для получения CSRF токена (если необходимо)
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
