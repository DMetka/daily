import { open } from './open_task_form.js'
document.getElementById('filterSelect').addEventListener('change', function () {
    const sortBy = this.value;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    startOfMonth.setHours(0, 0, 0, 0);
    const startDate = `${startOfMonth.getFullYear()}-${(startOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${startOfMonth.getDate().toString().padStart(2, '0')}`;
    const endDate = `${endOfMonth.getFullYear()}-${(endOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${endOfMonth.getDate().toString().padStart(2, '0')}`;
    if (sortBy) {
        fetch(`/filter?start_date=${startDate}&end_date=${endDate}&sort_by=${sortBy}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest', // Указываем, что это AJAX-запрос
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateListOfTasks(data.tasks); // Вызов функции для обновления задач
        })
        .catch(error => console.error('Ошибка при получении задач:', error));
    }
    function updateListOfTasks(tasks) {
        const tasksList = document.querySelector('.list_of_tasks');
        tasksList.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('list_task');
            taskElement.innerHTML = `
                <h2 class="list_of_task">${task.title}</h2>
                <h3>Дедлайн: ${task.deadline}</h3>
            `;
            taskElement.addEventListener('click', () => {
                open(task)
            });
            tasksList.appendChild(taskElement);
        });
    }
});