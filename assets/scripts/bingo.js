

function parseText(text) {
  const pattern = /^(\d+)-(\d+)$/;

  if (pattern.test(text)) {
    const match = text.match(pattern);
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);

    const nums = Array.from({length: end - start + 1}, (v,i) => start + i);

    return nums;
  } else {

    const strings = text.split('@@');
    return strings;
  }
}

function generateItem() {
  const userInput = document.getElementById("inputData").value;
  let parsed = parseText(userInput);
  const original = [...parsed];

  const output = document.querySelector(".printOutput");

  if (parsed.length === 0) {
    output.textContent = "No valid items to select.";
    return;
  }

  //for mouse clicks on the button
  document.getElementById("generateButton").addEventListener("click", () => handleRandomItem(parsed, original, output));

  //for enter
  document.getElementById("inputData").addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
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

  const randomItem = randomGenerate(parsed);
  output.textContent = randomItem;
}

generateItem();

