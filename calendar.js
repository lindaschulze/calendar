// calendar.js

const token = process.env.TOKEN;
const repo = 'calendar';  // Your repository name
const filePath = 'calendarData.json';  // The file to store calendar data in the repo

async function loadCalendarData() {
  try {
    const response = await fetch(`https://api.github.com/repos/lindaschulze/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    const data = await response.json();
    const fileContent = atob(data.content);  // Decode base64 content
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error loading calendar data:', error);
    return [];
  }
}

async function saveCalendarData(data) {
  try {
    const response = await fetch(`https://api.github.com/repos/lindaschulze/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update calendar data',
        committer: {
          name: 'GitHub Actions',
          email: 'github-actions@github.com',
        },
        content: btoa(JSON.stringify(data)),  // Encode to base64
        sha: await getFileSha(),  // Fetch the existing sha to update
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving calendar data:', error);
  }
}

// Fetch the sha of the file for updating it
async function getFileSha() {
  try {
    const response = await fetch(`https://api.github.com/repos/lindaschulze/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    const data = await response.json();
    return data.sha;
  } catch (error) {
    console.error('Error getting file sha:', error);
  }
}

// Save user input (example)
async function saveUserInput(day, text) {
  const calendarData = await loadCalendarData();
  calendarData[day - 1].text = text;  // Store text for the given day
  await saveCalendarData(calendarData);
}
