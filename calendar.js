// GitHub repository details and personal access token
const repoOwner = 'lindaschulze';          // Your GitHub username
const repoName = 'calendar';              // Your repository name
const filePath = 'calendarData.json';     // Path to the data file in the repo
const accessToken = 'calendar';           // Your GitHub Personal Access Token

// Function to save data to GitHub
async function saveToGitHub(data) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    
    // Fetch the file's current content to get the current SHA (needed for updating)
    const getFileResponse = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `token ${accessToken}` },
    });
    const fileData = await getFileResponse.json();
    const currentSha = fileData.sha;

    // Prepare the data to send (convert to Base64)
    const encodedData = btoa(JSON.stringify(data));
    const body = {
        message: 'Updating calendar data',
        content: encodedData,
        sha: currentSha, // If the file doesn't exist, no sha needed
    };

    // Send the request to update the file
    const updateResponse = await fetch(url, {
        method: 'PUT',
        headers: { 'Authorization': `token ${accessToken}` },
        body: JSON.stringify(body),
    });

    const result = await updateResponse.json();
    console.log('File updated:', result);
}

// Function to get data from GitHub
async function getFromGitHub() {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    const getFileResponse = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `token ${accessToken}` },
    });

    const fileData = await getFileResponse.json();
    const encodedContent = fileData.content;
    const decodedContent = atob(encodedContent); // Decode Base64 content

    return JSON.parse(decodedContent); // Return the parsed JSON data
}

// Example: Save or retrieve data
async function updateCalendar() {
    // Fetch data when loading
    const data = await getFromGitHub();
    console.log('Fetched data:', data);

    // Example: Update data for January 1st (you can modify this part to make your calendar interactive)
    data['January'] = { '1': 'New Year Celebration' };

    // Save the updated data back to GitHub
    await saveToGitHub(data);
}

// Call the updateCalendar function when needed
updateCalendar();
