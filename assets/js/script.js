const API_KEY = "8eypWAygI2h5hF8taHYJUpQfb98";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", postForm);

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(d) {
    resultsModal.show();
    document.getElementById("resultsModalTitle").innerText = "API Key Status";
    document.getElementById("results-content").innerHTML = "<div>Your key is valid until:</div>" + d.expiry;
}

async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form
    });
    const data = await response.json();
    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(d) {
    let heading = `JSHint Results for ${d.file}`;
    if (d.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${d.total_errors}</span></div><br>`;
        for (let error of d.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div><br>`;
        }
    }
    resultsModal.show();
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
}