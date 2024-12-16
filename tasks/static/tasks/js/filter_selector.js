import { filterTasks } from './filter.js';

const filterSelect = document.getElementById('filterSelect');
let currentFilter = null;

filterSelect.addEventListener('change', function (event) {
    const selectedValue = event.target.value;

    if (selectedValue === 'reset') {
        currentFilter = null;
        filterSelect.innerHTML = `
            <option value="">Выберите фильтрацию</option>
            <option value="status">Статус</option>
            <option value="priority">Приоритет</option>
            <option value="deadline">Дедлайн</option>
        `;
        return;
    }

    if (!currentFilter) {
        currentFilter = selectedValue;

        filterSelect.innerHTML = '<option value="">Выберите критерий</option>';

        if (currentFilter === 'status') {
            filterSelect.innerHTML += `
                <option value="False">Активный</option>
                <option value="True">Завершенный</option>
            `;
        } else if (currentFilter === 'priority') {
            filterSelect.innerHTML += `
                <option value="1">Высокий</option>
                <option value="2">Средний</option>
                <option value="3">Низкий</option>
            `;
        } else if (currentFilter === 'deadline') {
            filterSelect.innerHTML += `
                <option value="today">Сегодня</option>
                <option value="this_week">Эта неделя</option>
                <option value="next_week">Следующая неделя</option>
            `;
        }

        filterSelect.innerHTML += '<option value="reset">Назад к фильтрам</option>';
    } else {
        const filterValue = selectedValue;
        if (filterValue) {
            console.log('Отправка запроса с фильтром:', currentFilter, 'и значением:', filterValue);
            filterTasks(currentFilter, filterValue);
        }
    }
});


