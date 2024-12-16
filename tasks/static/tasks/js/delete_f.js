document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-task-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Предотвращаем стандартное поведение кнопки

            // Получаем ID задачи из родительского элемента
            const taskElement = this.closest('#TaskForm');
            const taskId = taskElement.dataset.taskId;

            if (!taskId) {
                console.error('Task ID is undefined');
                return; // Прекращаем выполнение, если ID отсутствует
            }

            // Отправка запроса на удаление задачи
            fetch(`/delete_task/${taskId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') // Если используется CSRF
                }
            })
            .then(response => {
                console.log('Response status:', response.status); // Логируем статус ответа
                if (response.ok) {
                    taskElement.remove(); // Удаляем текущий элемент задачи
                } else {
                    alert('Ошибка при удалении задачи');
                }
            })
            .catch(error => {
                console.error('Ошибка при выполнении запроса:', error);
            });
        });
    });

    // Функция для получения cookie по имени
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
});