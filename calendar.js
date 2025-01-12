const API_URL = 'https://api.github.com/repos/lindaschulze/calendar/contents';
const FILE_NAME = 'calendarData.json';

// Fetch data from GitHub (calendarData.json)
async function getFromGitHub() {
    const token = process.env.GITHUB_TOKEN;  // Fetch token from environment variable
    const response = await fetch(`${API_URL}/${FILE_NAME}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
        }
    });

    if (!response.ok) {
        console.error('Error fetching data from GitHub:', response.status);
        return {};
    }

    const data = await response.json();
    const decodedData = JSON.parse(atob(data.content));  // Decode base64 content
    console.log('Fetched Data:', decodedData);  // Log fetched data to see if it works
    return decodedData;
}
