

function parseText(text) {
  const pattern = /^(\d+)-(\d+)$/;

  if (pattern.test(text)) {
    const match = text.match(pattern);
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);

    return Array.from({length: end - start + 1}, (v,i) => start + i);
  } else {

    return text.split('@@');
  }
}

function generateItem() {
  const output = document.querySelector(".printOutput");

  //handle button clicks
  document.getElementById("generateButton").addEventListener("click", () => {
    const userInput = document.getElementById("inputData").value;
    let parsed = parseText(userInput);
    const original = [...parsed];

    if (parsed.length === 0) {
      output.textContent = "No valid items to select.";
      return;
    }

    handleRandomItem(parsed, original, output);
  });

  //handle enter
  document.getElementById("inputData").addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
      const userInput = document.getElementById("inputData").value;
      let parsed = parseText(userInput);
      const original = [...parsed];

      if (parsed.length === 0) {
        output.textContent = "No valid items to select.";
        return;
      }

      handleRandomItem(parsed, original, output);
    }
  });
}


function handleRandomItem(parsed, original, output) {
  if (parsed.length === 0) {

    if (confirm("All items have been used. Do you want to restart?")) {
      parsed.push(...original);
    } else {
      return;
    }
  }

  const randomIndex = Math.floor(Math.random() * parsed.length);


  output.textContent = parsed.splice(randomIndex, 1)[0];
}

generateItem();

