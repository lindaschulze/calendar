const token = process.env.TOKEN; // GitHub Personal Access Token
const repo = 'calendar';  // Your repository name
const filePath = 'calendarData.json';  // Path to your calendar data file

// Load the calendar data from GitHub
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
    return []; // Return an empty array in case of error
  }
}

// Save the updated calendar data to GitHub
async function saveCalendarData(data) {
  try {
    const sha = await getFileSha();  // Fetch the file's SHA for updating

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
        content: btoa(JSON.stringify(data)),  // Encode data as base64
        sha: sha,
      }),
    });

    const result = await response.json();
    console.log('File updated successfully:', result);
  } catch (error) {
    console.error('Error saving calendar data:', error);
  }
}

// Get the SHA of the calendar data file for updates
async function getFileSha() {
  try {
    const response = await fetch(`https://api.github.com/repos/lindaschulze/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    const data = await response.json();
    return data.sha; // Return the file's SHA
  } catch (error) {
    console.error('Error getting file sha:', error);
  }
}

// Save user input for a specific day
async function saveUserInput(day, text) {
  const calendarData = await loadCalendarData(); // Load current calendar data
  calendarData[day - 1].text = text; // Update the text for the selected day
  await saveCalendarData(calendarData); // Save the updated data
}

// Example of saving user input (e.g., for day 1, Monday)
saveUserInput(1, 'Meeting with team at 10 AM');
