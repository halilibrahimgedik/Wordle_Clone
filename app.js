const board = document.querySelector(".gameBoard");
const keyBoard = document.querySelector(".keys");
const messageBox = document.querySelector(".message");

let currentRow = 0;
let currentRowIndex = 0;
let isGameover = false;

let wordle;
let wordList;


// günün kelimesi
fetch("/words")
    .then(response => response.json())
    .then(data => {
        wordList = data; // Gelen JSON verisini dizi olarak atayın

        wordList = wordList.map(item => item.toLocaleUpperCase("tr-TR"));

        // Örneğin, rastgele bir kelime seçmek:
        const randomIndex = Math.floor(Math.random() * wordList.length);
        wordle = wordList[randomIndex];

        console.log("wordle:" + wordle);

    })
    .catch(error => {
        console.error("Veri çekme hatası:", error);
    });


//* setting gameBoard
gameBoard = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
]

gameBoard.forEach((eachRow, rowIndex) => {
    const row = document.createElement("div");
    row.setAttribute("id", "row-" + rowIndex);
    row.setAttribute("class", "row")


    eachRow.forEach((box, boxIndex) => {
        const boxElement = document.createElement("div");
        boxElement.setAttribute("id", "row-" + rowIndex + "-box-" + boxIndex);
        boxElement.setAttribute("class", "box");

        row.append(boxElement);
    })

    board.append(row);
});

const handleClick = (letter) => {
    if (letter == "ENTER") {

        checkRow();

        return;
    }
    if (letter == "«" || letter == "BACKSPACE") {

        deleteLetter();
        // console.log("current row index:" + currentRowIndex, "current row:" + currentRow);
        return;
    }

    addLetterToBox(letter);
}

//* setting keyboard
keys.forEach((key, keyIndex) => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.setAttribute("data-key", key);
    btn.setAttribute("id", key);
    btn.addEventListener("click", () => handleClick(key));

    keyBoard.append(btn);
});

// kalvye ile yazma
document.addEventListener("keydown", (e) => {

    const letter = e.key.toLocaleUpperCase("tr-TR");
    const regex = /^[A-ZÇĞİÖŞÜ]$/;

    if (regex.test(letter) || letter == "ENTER" || letter == "BACKSPACE") { // regexden backspace ve enter tuşu false dönüyor çünkü regex sadece büyük türkçe harfleri kabul ediyor bu yüzde or(||) ifadesi ile gelen enter ve backspace tuşu ise if bloğonu girdirmeliyim 

        handleClick(letter);

    }
    return;
})

const addLetterToBox = (letter) => {
    if (currentRowIndex < 5) {
        const rowForLetter = document.querySelector("#row-" + currentRow + "-box-" + currentRowIndex);

        rowForLetter.setAttribute("data-key", letter);  // !renk verirken kullanıcaz
        rowForLetter.textContent = letter;
        // gameBoard matrisimizede harfi ekleyelim çünkü ileride tahmin edilen kelimeyi burdan çekiceğiz;
        gameBoard[currentRow][currentRowIndex] = letter;


        currentRowIndex++;
    }
};

const deleteLetter = () => {
    if (currentRowIndex > 0 && isGameover != true) {
        currentRowIndex--;
        const element = document.querySelector("#row-" + currentRow + "-box-" + currentRowIndex);
        element.textContent = "";
    }
}

const checkRow = () => {
    const guess = gameBoard[currentRow].join("");

    if (guess.length != 5) {

        messageBoxShow("Yetersiz Harf !!");
        return;
    }
    if (wordList.includes(guess)) {

        if (currentRowIndex > 4) {
            // console.log(guess, gameBoard,wordle);
            flipCards();

            if (guess == wordle) {

                messageBoxShow("you are awesome");

                isGameover = true;
                keyBoard.classList.add("disabled");
                return;
            } else {
                if (currentRow >= 5) {
                    if (isGameover == false) {

                        messageBoxShow("Gameover..");

                        setTimeout(() => { showChoosenWord() }, 3000);
                        keyBoard.classList.add("disabled");
                    }
                    isGameover = true;
                    return;
                }
                if (currentRow < 5) {
                    currentRow++;
                    currentRowIndex = 0;
                    return;
                }
            }
        }
    }
    else {
        messageBoxShow("Kelime Listesinde Yok !")
    }
};

// oyunu kaybettikten sonra günü kelimesini gösterme
const showChoosenWord = () => {
    const info = document.createElement("p");
    info.textContent = "Günün kelimesi: " + wordle;
    messageBox.append(info);
    setTimeout(() => messageBox.removeChild(info), 5000);
}
const messageBoxShow = (message) => {
    const p = document.createElement("p");
    p.textContent = message;

    if (messageBox.children.length < 1) {
        messageBox.append(p);
        setTimeout(() => messageBox.removeChild(p), 2000);
    }
    return;
}

const addColorToKeyBoard = (letter, color) => {
    const Key = document.getElementById(letter);

    Key.classList.add(color);
}

const flipCards = () => {

    const rowElements = document.getElementById("row-" + currentRow).childNodes;
    let checkWordle = wordle;
    const guess = [];

    rowElements.forEach(eachBox => {
        guess.push({ "letter": eachBox.getAttribute("data-key"), "color": "grey-overlay" }) //default color grey-overlay
    })

    guess.forEach((word, index) => {
        if (word.letter == wordle[index]) {
            word.color = "green-overlay";
            checkWordle = checkWordle.replace(word.letter, "")
        }
    })

    guess.forEach(word => {
        if (checkWordle.includes(word.letter)) {
            word.color = "yellow-overlay";
            checkWordle = checkWordle.replace(word.letter, "");
        }
    })

    rowElements.forEach((box, index) => {
        setTimeout(() => {
            box.classList.add("flip");
            box.classList.add(guess[index].color);
            // console.log(guess[index].letter, guess[index].color);
            addColorToKeyBoard(guess[index].letter, guess[index].color);

        }, 500 * index)
    })
};








