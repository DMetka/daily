document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    fetch(`/search/?q=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при поиске задач');
            }
            return response.json();
        })
        .then(data => {
            const resultsDiv = document.getElementById('search-results');
            resultsDiv.innerHTML = ''; // Очищаем предыдущие результаты
            if (data.tasks.length > 0) {
                resultsDiv.style.display = 'block'; // Показываем блок с результатами
                data.tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('search-result'); // Добавляем класс для стилей

                    // Создаем элемент с заголовком задачи
                    const titleElement = document.createElement('div');
                    titleElement.innerText = task.title; // Заголовок задачи
                    titleElement.classList.add('search-result-title'); // Добавляем класс для стилей

                    // Создаем элемент с датой добавления
                    const dateElement = document.createElement('div');
                    dateElement.innerText = `Задача находится в колонке с датой: ${task.data_add}`; // Дата добавления задачи
                    dateElement.classList.add('search-result-date'); // Добавляем класс для стилей

                    // Добавляем заголовок и дату в элемент задачи
                    taskElement.appendChild(titleElement);
                    taskElement.appendChild(dateElement);

                    // Добавляем элемент задачи в блок результатов
                    resultsDiv.appendChild(taskElement);
                });
            } else {
                resultsDiv.style.display = 'none'; // Скрываем блок, если нет результатов
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
});

// Обработчик клика вне блока результатов
document.addEventListener('click', function(event) {
    const resultsDiv = document.getElementById('search-results');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Проверяем, был ли клик вне блока результатов и вне поля ввода и кнопки
    if (!resultsDiv.contains(event.target) && event.target !== searchInput && event.target !== searchButton) {
        resultsDiv.style.display = 'none'; // Скрываем блок с результатами
    }
});
