// Load JSON 
const loadJson = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching or parsing JSON:', error);
    }
  };


let table = document.querySelector("#wordListTable");
let tableBody = table.querySelector("tbody");


loadJson("docs/word-list.json").then((data) => {
    if (data.length === 0) {
        table.style.display = "none";
    } else {
        data.forEach((item, index) => {
            let row = document.createElement("tr");

            let indexCell = document.createElement("td");
            indexCell.textContent = index + 1; // Start index from 1

            let englishCell = document.createElement("td");
            englishCell.textContent = item.english;

            let chineseCell = document.createElement("td");
            chineseCell.textContent = item.chinese;

            let danishCell = document.createElement("td");
            danishCell.textContent = item.danish;

            row.appendChild(indexCell);
            row.appendChild(englishCell);
            row.appendChild(chineseCell);
            row.appendChild(danishCell);

            tableBody.appendChild(row);
        });
    }
});