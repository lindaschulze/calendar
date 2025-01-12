// Function to create the calendar
function generateCalendar(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get number of days in the month
    const firstDay = new Date(year, month, 1).getDay(); // Get the first day of the month
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = ''; // Clear any existing content

    // Display month and year in the header
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[month];
    const header = document.createElement('h2');
    header.textContent = `${monthName} ${year}`;
    calendarContainer.appendChild(header);

    // Create the calendar grid
    const table = document.createElement('table');
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
    
    const tableBody = document.createElement('tbody');
    let currentDay = 1;
    
    for (let i = 0; i < 6; i++) { // Up to 6 weeks
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                // Empty cells before the first day of the month
                row.appendChild(cell);
            } else if (currentDay <= daysInMonth) {
                const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
                cell.textContent = currentDay;
                
                // Check if there's an event for this date from the calendarData.json
                if (calendarData[date]) {
                    const event = document.createElement('div');
                    event.classList.add('event');
                    event.textContent = calendarData[date];
                    cell.appendChild(event);
                }
                row.appendChild(cell);
                currentDay++;
            }
        }
        tableBody.appendChild(row);
    }
    
    table.appendChild(tableBody);
    calendarContainer.appendChild(table);
}

// Fetch calendar data and generate calendar
fetch('calendarData.json')
    .then(response => response.json())
    .then(data => {
        window.calendarData = data; // Make calendar data globally accessible
        const today = new Date();
        generateCalendar(today.getFullYear(), today.getMonth()); // Generate current month
    })
    .catch(error => {
        console.error('Error fetching calendar data:', error);
    });

// Save functionality (can be extended)
document.getElementById('save').addEventListener('click', () => {
    alert('Changes saved!'); // Add more functionality as needed
});
