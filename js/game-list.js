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

loadJson('docs/toefl_d1.json').then((data) => {
    if (data.length === 0) {
        table.style.display = "none";
    } else {
        data.forEach((item, index) => {
            let row = document.createElement("tr");

            let indexCell = document.createElement("td");
            indexCell.textContent = index + 1; // Start index from 1

            let wordCell = document.createElement("td");
            wordCell.textContent = item.english;
      
            let meaningCell = document.createElement("td");
            meaningCell.textContent = item.chinese;
      
            row.appendChild(indexCell);
            row.appendChild(wordCell);
            row.appendChild(meaningCell);
    
            tableBody.appendChild(row);
        });
    }
});