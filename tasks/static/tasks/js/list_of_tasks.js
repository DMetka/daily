import { open } from './open_task_form.js'

function loadTasks() {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 2));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    fetch(`/get_now_week/?start_date=${startDate}`)
        .then(response => response.json())
        .then(data => {
            const tasksList = document.querySelector('.list_of_tasks');
            tasksList.innerHTML = '';

            if (data.tasks.length === 0) {
                tasksList.innerHTML = '<p>Нет задач на эту неделю</p>';
            } else {
                data.tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('list_task');
                    taskElement.innerHTML = `
                        <h3 class="list_of_task">${task.title}</h3>
                        <small class="list_of_task">Дедлайн: ${task.deadline}</small>
                    `;
                    taskElement.addEventListener('click', () => {
                        open(task)
                        // alert(`Вы выбрали задачу: ${task.title}\nДедлайн: ${task.deadline}`);
                    });
                    tasksList.appendChild(taskElement);
                });
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки задач:', error);
        });
}



function changeDays(direction) {
    currentDate.setDate(currentDate.getDate() + direction);
    updateWeekRange();
    loadTasks();
}


document.addEventListener('DOMContentLoaded', () => {
    updateWeekRange();
    loadTasks();
});