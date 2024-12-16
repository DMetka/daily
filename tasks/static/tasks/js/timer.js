let timerInterval;
let seconds = 0;

// Скрываем модальное окно при загрузке страницы
document.getElementById('timerModal').style.display = 'none';

document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('timerModal').style.display = 'block'; // Открываем модальное окно
});

document.getElementById('closeButton').addEventListener('click', function() {
    stopTimer();
    document.getElementById('timerModal').style.display = 'none'; // Закрываем модальное окно
});

document.getElementById('stopButton').addEventListener('click', function() {
    stopTimer();
});

document.getElementById('resetButton').addEventListener('click', function() {
    stopTimer();
    seconds = 0; // Сбрасываем счетчик
    document.getElementById('timer').innerText = formatTime(seconds); // Обновляем отображение
});

document.getElementById('startTimerButton').addEventListener('click', function() {
    startTimer();
});

function startTimer() {
    // Запускаем интервал, если он еще не запущен
    if (!timerInterval) {
        timerInterval = setInterval(function() {
            seconds++;
            document.getElementById('timer').innerText = formatTime(seconds);
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null; // Обнуляем интервал
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
