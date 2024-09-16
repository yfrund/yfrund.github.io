

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

function randomGenerate(parsed) {
  if (parsed.length === 0) {
    return "No items to select from.";
  }

  const randomIndex = Math.floor(Math.random() * parsed.length);
  const randomItem = parsed.splice(randomIndex, 1)[0];

  return randomItem;
}


document.getElementById("generateButton").addEventListener("click", () => {
  const userInput = document.getElementById("inputData").value;
  let parsed = parseText(userInput); // Parse the input
  const original = [...parsed];

  if (parsed.length === 0) {
    parsed = [...original];
  }

  const output = document.querySelector(".printOutput");


  if (parsed.length > 0) {
    const randomItem = randomGenerate(parsed);
    output.textContent = randomItem;
  } else {
    output.textContent = "No valid items to select.";
  }
});