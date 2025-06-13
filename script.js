// Get references to our HTML elements
const tokenInput = document.getElementById('token');
const sourceRepoInput = document.getElementById('source-repo');
const targetRepoInput = document.getElementById('target-repo');
const deleteCheckbox = document.getElementById('delete-labels');
const copyButton = document.getElementById('copy-button');
const logOutput = document.getElementById('log-output');

// --- Helper Functions ---

// Function to log messages to the screen
function log(message) {
    logOutput.textContent += message + '\n';
    logOutput.scrollTop = logOutput.scrollHeight; // Auto-scroll to the bottom
}

// Function to make authenticated API requests to GitHub
async function githubApiRequest(endpoint, options = {}) {
    const token = tokenInput.value;
    const url = `https://api.github.com/${endpoint}`;

    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error for ${endpoint}: ${response.status} - ${errorData.message}`);
    }

    // DELETE requests might not have a body, so handle that
    if (response.status === 204) {
        return null;
    }
    
    return response.json();
}

// --- Main Logic ---

async function copyLabels() {
    // Clear previous logs and set button state
    logOutput.textContent = '';
    copyButton.disabled = true;
    copyButton.textContent = 'Copying...';

    try {
        // 1. Get user inputs
        const sourceRepo = sourceRepoInput.value.trim();
        const targetRepo = targetRepoInput.value.trim();
        const deleteOldLabels = deleteCheckbox.checked;

        if (!tokenInput.value || !sourceRepo || !targetRepo) {
            throw new Error("Please fill in all required fields.");
        }

        log(`Fetching labels from ${sourceRepo}...`);
        const sourceLabels = await githubApiRequest(`repos/${sourceRepo}/labels?per_page=100`);
        log(`Found ${sourceLabels.length} labels in source repo.`);

        log(`Fetching labels from ${targetRepo}...`);
        const targetLabels = await githubApiRequest(`repos/${targetRepo}/labels?per_page=100`);
        log(`Found ${targetLabels.length} labels in target repo.`);

        // Create a Map for efficient lookups of source labels by name
        const sourceLabelsMap = new Map(sourceLabels.map(label => [label.name, label]));
        const targetLabelsMap = new Map(targetLabels.map(label => [label.name, label]));
        
        const labelsToCreate = [];
        const labelsToUpdate = [];
        const labelsToDelete = [];

        // 2. Determine which labels to update or create
        for (const [name, sourceLabel] of sourceLabelsMap.entries()) {
            if (targetLabelsMap.has(name)) {
                // Label exists in both, check if it needs an update
                const targetLabel = targetLabelsMap.get(name);
                if (sourceLabel.color !== targetLabel.color || sourceLabel.description !== targetLabel.description) {
                    labelsToUpdate.push(sourceLabel);
                }
            } else {
                // Label only exists in source, needs to be created
                labelsToCreate.push(sourceLabel);
            }
        }
        
        // 3. Determine which labels to delete (if requested)
        if (deleteOldLabels) {
            for (const [name, targetLabel] of targetLabelsMap.entries()) {
                if (!sourceLabelsMap.has(name)) {
                    labelsToDelete.push(targetLabel);
                }
            }
        }
        
        // 4. Execute the API calls
        log('\n--- Starting Sync Process ---');

        for (const label of labelsToDelete) {
            log(`Deleting label: ${label.name}`);
            await githubApiRequest(`repos/${targetRepo}/labels/${label.name}`, { method: 'DELETE' });
        }

        for (const label of labelsToUpdate) {
            log(`Updating label: ${label.name}`);
            await githubApiRequest(`repos/${targetRepo}/labels/${label.name}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    color: label.color,
                    description: label.description || '', // Ensure description is not null
                })
            });
        }
        
        for (const label of labelsToCreate) {
            log(`Creating label: ${label.name}`);
            await githubApiRequest(`repos/${targetRepo}/labels`, {
                method: 'POST',
                body: JSON.stringify({
                    name: label.name,
                    color: label.color,
                    description: label.description || '',
                })
            });
        }

        log('\n✅ Done! All labels are synced.');

    } catch (error) {
        log(`\n❌ ERROR: ${error.message}`);
        console.error(error);
    } finally {
        // Re-enable the button
        copyButton.disabled = false;
        copyButton.textContent = 'Copy Labels';
    }
}

// Attach the event listener to the button
copyButton.addEventListener('click', copyLabels);