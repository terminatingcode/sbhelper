const hintsUrl = "https://www.nytimes.com/";
const hinstPath = "crosswords/spelling-bee-forum.html";
const months = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};
var pangrams = 0;

function getOrCreateBox(totalWords, totalPangrams) {
  var hinterDiv = document.getElementById("hinter");
  if (hinterDiv == null) {
    hinterDiv = document.createElement("li");
    hinterDiv.id = "hinter";
    let summaryBox = document.getElementsByClassName("sb-wordlist-items-pag");
    summaryBox[0].insertBefore(hinterDiv, summaryBox[0].firstChild);
    showElement = document.createElement("li");
    hinterDiv.appendChild(showElement);
    showButton = document.createElement("button");
    showButton.id = "show-hinter-button";
    showButton.textContent = "show hints";
    showElement.appendChild(showButton);
    showButton.addEventListener("click", () => {
      showButton.textContent =
        showButton.textContent == "show hints" ? "hide hints" : "show hints";
      document.querySelectorAll(".hints").forEach((element) => {
        element.style.display =
          element.style.display == "block" ? "none" : "block";
      });
    });

    totalsDiv = document.createElement("li");
    totalsDiv.className = "hints";
    hinterDiv.appendChild(totalsDiv);
    totalWordsLi = document.createElement("li");
    totalWordsLi.id = "total_words";
    totalWordsLi.textContent = "Total words: " + totalWords;
    totalsDiv.appendChild(totalWordsLi);
    totalPangramsLi = document.createElement("li");
    totalPangramsLi.id = "total_pangrams";
    totalPangramsLi.textContent = "Total pangrams: " + totalPangrams;
    totalsDiv.appendChild(totalPangramsLi);
  }
  return hinterDiv;
}

function onNewWord(
  hinterDiv,
  twoLetterMap,
  letterlengthsMap,
  words,
  totalWords,
  totalPangrams
) {
  document
    .getElementsByClassName(
      "hive-action hive-action__submit sb-touch-button"
    )[0]
    .addEventListener("click", async () => {
      await new Promise((r) => setTimeout(r, 250));
      words = generateWordSet();
      let maps = evaluateWords(
        twoLetterMap,
        letterlengthsMap,
        words,
        totalPangrams
      );
      updateHinter(maps, hinterDiv, words, totalWords, totalPangrams);
    });

  document.addEventListener("keydown", async (event) => {
    if (event.key == "Enter") {
      await new Promise((r) => setTimeout(r, 250));
      words = generateWordSet();
      let maps = evaluateWords(twoLetterMap, letterlengthsMap, words);
      updateHinter(maps, hinterDiv, words, totalWords, totalPangrams);
    }
  });
}

function generateWordSet() {
  let wordList = document.querySelectorAll("span.sb-anagram");
  let words = new Set();
  pangrams = 0;
  wordList.forEach((item) => {
    words.add(item.textContent);
    if (item.className.includes("pangram")) {
      pangrams += 1;
    }
  });
  pangrams = pangrams / 2;
  return words;
}

function evaluateWords(ogTwoLetterMap, ogLetterlengthsMap, words) {
  twoLetterHintsMap = new Map(ogTwoLetterMap);
  oneLetterHintsMap = new Map(ogLetterlengthsMap);
  hintsMap = new Map();

  words.forEach((word) => {
    firstLetter = word.substring(0, 1);
    twoLetters = word.substring(0, 2);

    firstLetterTally = oneLetterHintsMap.get(firstLetter + word.length) - 1;
    oneLetterHintsMap.set(firstLetter + word.length, firstLetterTally);

    twoLetterTally = twoLetterHintsMap.get(twoLetters) - 1;
    twoLetterHintsMap.set(twoLetters, twoLetterTally);
  });
  hintsMap.set("oneLetter", oneLetterHintsMap);
  hintsMap.set("twoLetter", twoLetterHintsMap);
  return hintsMap;
}

function updateHinter(hintsMap, hinterdiv, words, totalWords, totalPangrams) {
  totalWordsLi = document.getElementById("total_words");
  wordsLeft = totalWords - words.size;
  if (wordsLeft > 0) {
    totalWordsLi.textContent = "👑🐝 - " + wordsLeft;
  } else {
    totalWordsLi.textContent = "👑🐝";
  }
  totalPangramsLi = document.getElementById("total_pangrams");
  pangramsLeft = totalPangrams - pangrams;
  if (pangramsLeft > 0) {
    totalPangramsLi.textContent = "Pangrams left: " + pangramsLeft;
  } else {
    totalPangramsLi.textContent = " ⭐️  ⭐️  ⭐️";
  }
  oneLetterHintsMap = hintsMap.get("oneLetter");
  twoLetterHintsMap = hintsMap.get("twoLetter");
  oneLetterHintsString = "";
  oneLetterHintsMap.forEach((value, key) => {
    if (value > 0) {
      oneLetterHintsString = oneLetterHintsString + key + ": " + value + " ♕ ";
    }
  });

  twoLetterHintsString = "";
  twoLetterHintsMap.forEach((value, key) => {
    if (value > 0) {
      twoLetterHintsString = twoLetterHintsString + key + ": " + value + " ♛ ";
    }
  });

  let oneLetterHinterDiv = document.getElementById("one-letter-hinter");
  if (oneLetterHinterDiv == null) {
    oneLetterHinterDiv = document.createElement("li");
    oneLetterHinterDiv.id = "one-letter-hinter";
    oneLetterHinterDiv.className = "hints";
    hinterdiv.appendChild(oneLetterHinterDiv);
  }
  oneLetterHinterDiv.textContent = oneLetterHintsString.toUpperCase();

  let twoLetterHinterDiv = document.getElementById("two-letter-hinter");
  if (twoLetterHinterDiv == null) {
    twoLetterHinterDiv = document.createElement("li");
    twoLetterHinterDiv.id = "two-letter-hinter";
    twoLetterHinterDiv.className = "hints";
    hinterdiv.appendChild(twoLetterHinterDiv);
  }
  twoLetterHinterDiv.textContent = twoLetterHintsString.toUpperCase();
}

function createHintsUri() {
  dateArray = document
    .getElementsByClassName("pz-game-date")[0]
    .textContent.split(" ");

  return (
    hintsUrl +
    dateArray[2] +
    "/" +
    months[dateArray[0]] +
    "/" +
    dateArray[1].replace(",", "") +
    "/" +
    hinstPath
  );
}

async function fetchWithRetries(url, options = {}, retries) {
  return fetch(url, options)
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      if (retries > 0) {
        return fetchWithRetries(url, options, retries - 1);
      }
      throw new Error(res.status);
    })
    .catch((error) => console.error(error.message));
}

async function getHintsHtml(hintsURI) {
  let hintsHTML = await fetchWithRetries(hintsURI, {}, 3).then((data) => {
    if (data != undefined) {
      return data;
    } else {
      console.log("failed to retrieve hints from " + hintsURI);
    }
  });
  return hintsHTML;
}

function getTotalWords(hintsHTML) {
  return hintsHTML.match(/WORDS: (\d+)/)[1];
}

function getTotalPangrams(hintsHTML) {
  return hintsHTML.match(/PANGRAMS: (\d+)/)[1];
}

function getHintsTableArray(hintsHTML) {
  return [
    ...hintsHTML.matchAll(
      /<td class="cell"[\w\d\s="\-:;\<\>]*>([\d\w\-\Σ:]+)<[<\/span\>:\<]*\/td>/g
    ),
  ];
}

function getWordLengths(hintsTableArray) {
  let wordLengths = [];
  for (wordMatches of hintsTableArray) {
    if (wordMatches[1] == "Σ") {
      break;
    }
    wordLengths.push(wordMatches[1]);
  }
  return wordLengths;
}

function getWordLengthsPerLetter(hintsTableArray, lengthsArray) {
  let wordLengths = new Map();
  let currentLetter = "";
  let isMatching = false;
  let i = 0;
  for (wordMatches of hintsTableArray) {
    let letter = wordMatches[1].match(/[a-z]/);
    let number = wordMatches[1].match(/\d+/);
    let skip = wordMatches[1].match(/\-/);
    let sigma = wordMatches[1].match(/Σ/);
    if (letter != null) {
      currentLetter = letter[0];
      i = 0;
      isMatching = true;
    }
    if (skip != null) {
      i++;
    }
    if (isMatching && number != null && i < lengthsArray.length) {
      wordLengths.set(currentLetter + lengthsArray[i], Number(number[0]));
      i++;
    }
    if (isMatching && sigma != null) {
      break;
    }
  }
  return wordLengths;
}

function getTwoLetterList(hintsHTML) {
  array = [...hintsHTML.matchAll(/\s+([a-z]{2})-([\d]{1,2})/g)];
  l = array.length / 2;
  array.slice(0, l);
  twoLetterMap = new Map();
  array.forEach((i) => {
    twoLetterMap.set(i[1], Number(i[2]));
  });
  return twoLetterMap;
}

async function main() {
  let hintsURI = createHintsUri();
  let hintsHTML = await getHintsHtml(hintsURI);
  let totalWords = getTotalWords(hintsHTML);
  let totalPangrams = getTotalPangrams(hintsHTML);
  let hintsTableArray = getHintsTableArray(hintsHTML);
  let lengthsArray = getWordLengths(hintsTableArray);
  let letterlengthsMap = getWordLengthsPerLetter(hintsTableArray, lengthsArray);
  let twoLetterMap = getTwoLetterList(hintsHTML);

  hinterDiv = getOrCreateBox(totalWords, totalPangrams);
  let words = generateWordSet();
  let hintsMap = evaluateWords(twoLetterMap, letterlengthsMap, words);
  updateHinter(hintsMap, hinterDiv, words, totalWords, totalPangrams);
  document.querySelectorAll(".hints").forEach((element) => {
    element.style.display = "none";
  });

  onNewWord(
    hinterDiv,
    twoLetterMap,
    letterlengthsMap,
    words,
    totalWords,
    totalPangrams
  );
}

main().catch(console.log);
