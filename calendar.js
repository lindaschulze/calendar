const API_URL = 'https://api.github.com/repos/lindaschulze/calendar/contents';
const FILE_NAME = 'calendarData.json';
const TOKEN = 'your-github-token';  // Replace with your actual GitHub token

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
    return JSON.parse(atob(data.content));
}

async function saveToGitHub(data) {
    const response = await fetch(`${API_URL}/${FILE_NAME}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Update calendar data',
            content: btoa(JSON.stringify(data)),
            sha: await getFileSha(),
        }),
    });

    if (!response.ok) {
        console.error('Error saving data to GitHub:', response.status);
    }
}

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
