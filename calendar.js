// Configuration
const calendarContainer = document.getElementById('calendar-container');
const token = process.env.TOKEN; // Use your GitHub token from secrets
const repoName = 'calendar';
const username = 'lindaschulze';
const filePath = 'calendarData.json';

// Set up GitHub API
const octokit = new Octokit({
  auth: token,
});

// Initialize calendar for 2025
function createCalendar(year) {
    for (let month = 0; month < 12; month++) {
        createMonth(year, month);
    }
}

// Create individual month
function createMonth(year, month) {
    const monthElement = document.createElement('div');
    monthElement.className = 'month';
    
    const monthHeader = document.createElement('div');
    monthHeader.className = 'month-header';
    monthHeader.textContent = new Date(year, month).toLocaleString('default', { month: 'long' });

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdaysContainer = document.createElement('div');
    weekdaysContainer.className = 'weekdays';

    weekdays.forEach(day => {
        const weekdayElement = document.createElement('div');
        weekdayElement.textContent = day;
        weekdaysContainer.appendChild(weekdayElement);
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const daysContainer = document.createElement('div');
    daysContainer.className = 'days-container';
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        daysContainer.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        
        const weekday = new Date(year, month, day).toLocaleString('default', { weekday: 'short' });
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = `${weekday} - ${day}`;
        
        const input = document.createElement('input');
        input.className = 'input';
        input.placeholder = 'Add a note...';

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.appendChild(dayNumber);
        inputContainer.appendChild(input);

        dayElement.appendChild(inputContainer);
        daysContainer.appendChild(dayElement);
    }

    monthElement.appendChild(monthHeader);
    monthElement.appendChild(weekdaysContainer);
    monthElement.appendChild(daysContainer);

    calendarContainer.appendChild(monthElement);
}

// Save input to GitHub repository (calendarData.json)
async function saveToGitHub(data) {
    const response = await octokit.rest.repos.getContent({
        owner: username,
        repo: repoName,
        path: filePath,
    });

    const content = Buffer.from(response.data.content, 'base64').toString();
    const updatedContent = JSON.stringify(data);

    await octokit.rest.repos.createOrUpdateFileContents({
        owner: username,
        repo: repoName,
        path: filePath,
        message: 'Update calendar data',
        content: Buffer.from(updatedContent).toString('base64'),
        sha: response.data.sha,
    });
}

// Load data from GitHub
async function loadDataFromGitHub() {
    try {
        const response = await octokit.rest.repos.getContent({
            owner: username,
            repo: repoName,
            path: filePath,
        });
        const content = Buffer.from(response.data.content, 'base64').toString();
        return JSON.parse(content);
    } catch (error) {
        console.log('Error loading data:', error);
        return {};
    }
}

// Initialize calendar
createCalendar(2025);
