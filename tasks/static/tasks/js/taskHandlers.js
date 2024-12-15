import { open } from './open_task_form.js';

document.addEventListener('DOMContentLoaded', () => {
    const taskElements = document.querySelectorAll('.my_task_area'); // Выбор всех задач
    taskElements.forEach(taskElement => {
        taskElement.addEventListener('click', (event) => {
            event.preventDefault(); // Предотвращаем переход по ссылке, если он задан

            // Получаем данные задачи из атрибутов или DOM
            const taskId = taskElement.dataset.taskId;
            const taskTitle = taskElement.querySelector('h2').textContent;
            // Собираем объект задачи для передачи в open()
            const task = {
                id: taskElement.dataset.taskId,
                title: taskElement.querySelector('h2').textContent,
                full_text: taskElement.dataset.taskFullText || '',
                deadline: taskElement.dataset.taskDeadline || '',
                folder: taskElement.dataset.taskFolder || '',
                priority: taskElement.dataset.taskPriority || '',
                is_completed: taskElement.dataset.taskIsCompleted === 'true'
            };

            // Открываем форму с данными задачи
            open(task);
        });
    });
});
