document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search");
    const dataDisplay = document.getElementById("dataDisplay");

    searchButton.addEventListener("click", function () {
        const input = document.getElementById("searchInput").value.trim();

        dataDisplay.innerHTML = "";

        if (input) {
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response error');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.length > 0) {
                        const wordData = data[0];

                        const container = document.createElement("div");
                        container.className = "container mt-4";

                        const table = document.createElement("table");
                        table.className = "table table-striped";

                        const thead = document.createElement("thead");
                        thead.innerHTML = `
                            <tr>
                                <th scope="col">Part of Speech</th>
                                <th scope="col">Definition</th>
                                <th scope="col">Example</th>
                                <th scope="col">Phonetic</th>
                                <th scope="col">Audio</th>
                            </tr>
                        `;
                        table.appendChild(thead);

                        const tbody = document.createElement("tbody");

                        wordData.meanings.forEach(meaning => {
                            meaning.definitions.forEach(definition => {
                                const tr = document.createElement("tr");

                                const partOfSpeechTd = document.createElement("td");
                                partOfSpeechTd.textContent = meaning.partOfSpeech || 'N/A';
                                tr.appendChild(partOfSpeechTd);

                                const definitionTd = document.createElement("td");
                                definitionTd.textContent = definition.definition || 'N/A';
                                tr.appendChild(definitionTd);

                                const exampleTd = document.createElement("td");
                                exampleTd.textContent = definition.example || 'N/A';
                                tr.appendChild(exampleTd);

                                const phoneticTd = document.createElement("td");
                                phoneticTd.textContent = wordData.phonetics[0]?.text || 'N/A';
                                tr.appendChild(phoneticTd);

                                const audioTd = document.createElement("td");
                                if (wordData.phonetics[0]?.audio) {
                                    const audioElement = document.createElement("audio");
                                    audioElement.controls = true;
                                    audioElement.src = wordData.phonetics[0].audio;
                                    audioTd.appendChild(audioElement);
                                } else {
                                    audioTd.textContent = 'N/A';
                                }
                                tr.appendChild(audioTd);

                                tbody.appendChild(tr);
                            });
                        });

                        table.appendChild(tbody);
                        container.appendChild(table);
                        dataDisplay.appendChild(container);

                        const sourceElement = document.createElement("a");
                        sourceElement.href = wordData.sourceUrls[0];
                        sourceElement.textContent = "Source";
                        dataDisplay.appendChild(sourceElement);
                        
                        const licenseElement = document.createElement("p");
                        licenseElement.textContent = `License: ${wordData.license.name}`;
                        const licenseLink = document.createElement("a");
                        licenseLink.href = wordData.license.url;
                        licenseLink.textContent = " View License";
                        licenseElement.appendChild(licenseLink);
                        dataDisplay.appendChild(licenseElement);
                    } else {
                        dataDisplay.textContent = "No results found.";
                    }
                })
                .catch(error => {
                    const errorElement = document.createElement("h4");
                    errorElement.textContent = "Error while fetching data!";
                    errorElement.className = "text-danger mt-2";
                    dataDisplay.appendChild(errorElement);
                });
        } else {
            const errorElement = document.createElement("h4");
            errorElement.textContent = "Please enter a word!";
            errorElement.className = "text-danger mt-2";
            dataDisplay.appendChild(errorElement);
        }
    });
});
