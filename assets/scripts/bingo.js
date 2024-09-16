

function parseText(text) {
  const pattern = /^(\d+)-(\d+)$/;

  if (pattern.test(text)) {
    const match = text.match(pattern);
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);

    return Array.from({length: end - start + 1}, (v,i) => start + i);
  } else {

    return text.split('\n').map(item => item.trim()).filter(item => item.length > 0);
  }
}

let parsed = [];
let original = [];

function generateItem() {
  const output = document.querySelector(".printOutput");

  //handle button clicks
  document.getElementById("generateButton").addEventListener("click", () => {
    handleInput(output);
  });


  //handle enter TODO: remove or add handling with multiline input
  document.getElementById("inputData").addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
      handleInput(output)
    }
  });
}

function handleInput(output){
  if (parsed.length === 0 && original.length === 0) {
      const userInput = document.getElementById("inputData").value;
      parsed = parseText(userInput);
      original = [...parsed];

      if (parsed.length === 0) {
        output.textContent = "No valid items to select.";
        return;
      }
    }

    handleRandomItem(output);
}


function handleRandomItem(output) {
  if (parsed.length === 0) {

    if (confirm("All items have been used. Do you want to restart?")) {
      parsed.push(...original);
    } else {
      parsed = [];
      original = [];
    }
  }

  const randomIndex = Math.floor(Math.random() * parsed.length);


  output.textContent = parsed.splice(randomIndex, 1)[0];
}

generateItem();

