const API_URL = 'https://api.github.com/repos/lindaschulze/calendar/contents';
const FILE_NAME = 'calendarData.json';
const TOKEN = 'your-github-token';  // Replace with your actual GitHub token

// Fetch data from GitHub (calendarData.json)
async function getFromGitHub() {
    const response = await fetch(`${API_URL}/${FILE_NAME}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${TOKEN}`,
        }
    });

    if (!response.ok) {
        console.error('Error fetching data from GitHub:', response.status);
        return {};
    }

    const data = await response.json();
    const decodedData = JSON.parse(atob(data.content));  // Decode base64 content
    console.log('Fetched Data:', decodedData);  // Log fetched data
    return decodedData;
}

// Save data back to GitHub (after updating the calendar)
async function saveToGitHub(data) {
    const sha = await getFileSha();  // Get the current file's sha for updating
    const response = await fetch(`${API_URL}/${FILE_NAME}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Update calendar data',
            content: btoa(JSON.stringify(data)),
            sha: sha,
        }),
    });

    if (!response.ok) {
        console.error('Error saving data to GitHub:', response.status);
    }
}

// Get the SHA of the calendarData.json file (used for updates)
async function getFileSha() {
    const response = await fetch(`${API_URL}/${FILE_NAME}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${TOKEN}`,
        },
    });

    const data = await response.json();
    return data.sha;
}

// Function to update the data for a specific day and month
async function updateDay(month, day, text) {
    const data = await getFromGitHub();

    if (!data[month]) {
        data[month] = {};
    }
    data[month][day] = text;

    // Save the updated data to GitHub
    await saveToGitHub(data);
}

// Render the calendar on page load
async function renderCalendar() {
    const data = await getFromGitHub();
    const calendarDiv = document.getElementById('calendar');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Clear existing calendar
    calendarDiv.innerHTML = '';

    months.forEach(month => {
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');

        const monthTitle = document.createElement('h3');
        monthTitle.textContent = month;
        monthDiv.appendChild(monthTitle);

        const daysDiv = document.createElement('div');
        daysDiv.classList.add('days');

        // Add days of the month (simplified here for demonstration)
        for (let i = 1; i <= 31; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            const dayContent = data[month] && data[month][i] ? data[month][i] : '';

            dayDiv.innerHTML = `
                <div>${getWeekdayAbbreviation(new Date(`${month} ${i}, 2025`))} - ${i}</div>
                <input type="text" value="${dayContent}" onchange="updateDay('${month}', ${i}, this.value)">
            `;

            if (dayContent) {
                dayDiv.classList.add('selected');
            }

            daysDiv.appendChild(dayDiv);
        }

        monthDiv.appendChild(daysDiv);
        calendarDiv.appendChild(monthDiv);
    });
}

// Function to get the weekday abbreviation (Mon, Tue, etc.)
function getWeekdayAbbreviation(date) {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdays[date.getDay()];
}

// Call renderCalendar on page load
renderCalendar();
