document.addEventListener('DOMContentLoaded', function() {
    const subtaskContainer = document.querySelector('.subtask-container');
    const addSubtaskButton = document.getElementById('addSubtask');
    const removeSubtaskButton = document.getElementById('removeSubtask');

    // Функция для добавления новой подзадачи
    function addSubtask() {
        const subtaskDiv = document.createElement('div');
        subtaskDiv.className = 'subtask';

        const subtaskInput = document.createElement('input');
        subtaskInput.type = 'text';
        subtaskInput.placeholder = 'Подзадача';

        subtaskDiv.appendChild(subtaskInput);
        subtaskContainer.appendChild(subtaskDiv);
    }

    // Функция для удаления последней подзадачи
    function removeSubtask() {
        const subtaskDivs = subtaskContainer.getElementsByClassName('subtask');

        // Удаляем последнюю подзадачу, если она существует
        if (subtaskDivs.length > 1) {
            subtaskContainer.removeChild(subtaskDivs[subtaskDivs.length - 1]);
        }
    }

    // Обработчики событий для кнопок
    addSubtaskButton.addEventListener('click', addSubtask);
    removeSubtaskButton.addEventListener('click', removeSubtask);
});
