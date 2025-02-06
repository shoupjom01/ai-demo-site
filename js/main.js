import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

export async function uploadAndAnalyze() {
    const imageInput = document.getElementById("imageInput");
    const file = imageInput.files[0];
    
    if (!file) {
        alert("Please select an image file.");
        return;
    }

    // Create a FormData object and append the image
    const formData = new FormData();
    formData.append("img", file);

    // Fetch the image as a blob
    const exampleImage = await fetch(URL.createObjectURL(file)).then(response => response.blob());

    // Connect to the Gradio client
    const client = await Client.connect("shoupjom01/vehicle");

    // Make the API call
    const result = await client.predict("/predict", { img: exampleImage });

    // Format the result and display it
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = '';

    // Parse the JSON response and display it in a table format
    const resultData = result.data[0]; // Assuming the response is an array with the result

    // Displaying the main label
    resultDiv.innerHTML += `
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <div class="text-xl font-semibold">Prediction: <span class="font-medium">${resultData.label}</span></div>
        </div>
    `;

    // Displaying the confidences in a table format
    const confidenceTable = resultData.confidences.map(confidence => {
        return `
            <tr>
                <td class="px-4 py-2 border-b">${confidence.label}</td>
                <td class="px-4 py-2 border-b">${(confidence.confidence * 100).toFixed(2)}%</td>
            </tr>
        `;
    }).join("");

    resultDiv.innerHTML += `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-xl font-semibold mb-4">Confidence Scores</div>
            <table class="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th class="px-4 py-2 border-b text-left">Label</th>
                        <th class="px-4 py-2 border-b text-left">Confidence</th>
                    </tr>
                </thead>
                <tbody>
                    ${confidenceTable}
                </tbody>
            </table>
        </div>
    `;
}
