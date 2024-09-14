

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

function randomGenerate(inp) {
  let parsed = parseText(inp);
  const original = [...parsed]

  console.log("Press Enter to print a random item. Press Esc to exit.");

  process.stdin.on("keypress", (str, key) => {
    if (key.name === "escape") {
      console.log("\nExiting");
      process.exit();
    } else if (key.name === "return") {
      if (!parsed.length) {
        parsed = [...original];
        console.log("All items have been used - starting over.");
      }
      const randomIndex = Math.floor(Math.random() * parsed.length);
      const randomItem = parsed.splice(randomIndex, 1)[0];
      console.log(randomItem);
    }
  });
}

const output = document.getElementsByClassName("printOutput");

const userInput = document.getElementById("inputData");

randomGenerate(userInput)
