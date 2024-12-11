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
            data.tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.innerText = task.title; // Выводим заголовок задачи
                resultsDiv.appendChild(taskElement);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
});
