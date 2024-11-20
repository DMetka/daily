let currentDate = new Date(); // Текущая дата

function updateCalendar() {
    const calendar = document.getElementById('calendar');
    const firstDayOfWeek = getFirstDayOfWeek(currentDate); // Получаем первый день недели
    const days = [];

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(firstDayOfWeek);
        currentDay.setDate(firstDayOfWeek.getDate() + i); // Устанавливаем дату для каждого дня недели
        // Форматируем дату в формате ДД.ММ.ГГГГ
        const dayString = currentDay.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
        days.push(dayString);
    }

    // Обновляем HTML с датами
    const dayElements = calendar.getElementsByClassName('date');
    for (let i = 0; i < dayElements.length; i++) {
        dayElements[i].textContent = days[i];
    }
}

function getFirstDayOfWeek(date) {
    const day = date.getDay(); // Получаем текущий день недели (0 - воскресенье, 1 - понедельник и т.д.)
    const firstDay = new Date(date); // Копируем текущую дату
    firstDay.setDate(date.getDate() - day + 1); // Устанавливаем первый день недели (понедельник)
    return firstDay;
}

function changeWeek(direction) {
    currentDate.setDate(currentDate.getDate() + (direction * 7)); // Изменяем текущую дату на 7 дней
    updateCalendar(); // Обновляем календарь
}

// Вызываем функцию для обновления календаря при загрузке страницы
updateCalendar();
