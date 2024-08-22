const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;

document.addEventListener("DOMContentLoaded", function() {
    displayCalendar(currentMonth, currentYear);

    document.getElementById("prevMonth").addEventListener("click", function() {
        currentMonth = (currentMonth - 1 + 12) % 12;
        currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
        displayCalendar(currentMonth, currentYear);
    });

    document.getElementById("nextMonth").addEventListener("click", function() {
        currentMonth = (currentMonth + 1) % 12;
        currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
        displayCalendar(currentMonth, currentYear);
    });

    document.getElementById("addTaskBtn").addEventListener("click", function() {
        const taskInput = document.getElementById("taskInput");
        if (selectedDate && taskInput.value) {
            saveTask(selectedDate, taskInput.value);
            taskInput.value = '';
        }
    });
});

function displayCalendar(month, year) {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = '';
    document.getElementById("monthYear").textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        calendar.appendChild(createEmptyDay());
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.textContent = day;

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        loadTasks(dateKey, dayElement);

        if (dateKey === selectedDate) {
            dayElement.classList.add("selected");
        }

        dayElement.addEventListener("click", function() {
            selectedDate = dateKey;
            displayCalendar(month, year);  // Met à jour l'affichage pour montrer la sélection
            displayAgenda();
        });

        calendar.appendChild(dayElement);
    }
}

function createEmptyDay() {
    const emptyDay = document.createElement("div");
    emptyDay.className = "empty";
    return emptyDay;
}

function saveTask(date, task) {
    fetch('add_task.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `task_date=${encodeURIComponent(date)}&task_text=${encodeURIComponent(task)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayCalendar(currentMonth, currentYear);  // Met à jour l'affichage du calendrier
            displayAgenda();  // Met à jour l'affichage de l'agenda
        }
    });
}

function loadTasks(date, dayElement) {
    fetch(`get_tasks.php?date=${encodeURIComponent(date)}`)
        .then(response => response.json())
        .then(tasks => {
            if (tasks.length > 0) {
                dayElement.classList.add("has-task");
            }
        });
}

function displayAgenda() {
    const agendaContent = document.getElementById("agendaContent");
    agendaContent.innerHTML = `<h3>Tâches pour ${selectedDate || 'aucune date sélectionnée'} :</h3>`;

    fetch(`get_tasks.php?date=${encodeURIComponent(selectedDate)}`)
        .then(response => response.json())
        .then(tasks => {
            if (tasks.length > 0) {
                tasks.forEach(task => {
                    const taskElement = document.createElement("div");
                    taskElement.textContent = task.task_text;
                    agendaContent.appendChild(taskElement);
                });
            } else {
                agendaContent.innerHTML += "<p>Aucune tâche pour cette date.</p>";
            }
        });
}
