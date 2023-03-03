export {getCapitalizedLowerCase, correctSpaces, getQuantityWords, getStatisticsUniqueWords};

// 1.1
function getCapitalizedLowerCase(str) {
    // преобразование строки к нижнему регистру
    // с заглавной буквой

    if (str.length > 0) {
        str = str.toLowerCase();
        let firstLetter = str[0].toUpperCase();
        str = str.replace(str[0], firstLetter);
    }
    return str;
}


// 1.2
function correctSpaces(str) {
    // удаляет лишние пробелы и
    // ставит пробелы перед знаками препинания

    // находим знаки препинания
    let punctuation = /[,.!?;:]/g;
    let allPunctuation = Array.from(str.matchAll(punctuation));
    // разворачиваем, чтобы искать с конца
    allPunctuation.reverse();
    for (let punctuation of allPunctuation) {
        let space = ' ';

        // добавляем пробел после знака препинания
        let sliceBefore = str.slice(0, punctuation.index + 1);
        let sliceAfter = str.slice(punctuation.index + 1);
        str = `${sliceBefore}${space}${sliceAfter}`;

        sliceBefore = str.slice(0, punctuation.index - 1);
        sliceAfter = str.slice(punctuation.index);
        // удаляем пробел, если он стоит перед знаком препинания
        if (str[punctuation.index - 1] == space) {
            str = `${sliceBefore}${sliceAfter}`;
        }
    }
    // один или более пробелов
    let spaces = /[\s]+/g;
    str = str.replaceAll(spaces, ' ');
    str = str.trim();

    return str;
}


// 1.3
function getQuantityWords(str) {
    // кол-во слов в строке

    let wordCount = 0;
    if (str.length > 0) {
        // один или более пробелов
        let spaces = /[\s]+/g;
        let wordList = str.split(spaces);
        wordCount = wordList.length;
    }
    return wordCount;
}


// 1.4
function getStatisticsUniqueWords(str) {
    // сколько раз каждое слово встречается в строке

    str = str.toLowerCase();
    let punctuation = /[,.!?;:]/g;
    str = str.replaceAll(punctuation, ' ');
    // один или более пробелов
    let spaces = /[\s]+/g;
    let allWords = str.split(spaces);
    let uniqueWords = Array.from(new Set(allWords));

    let statisticOfWords = [];
    for (let word of uniqueWords) {
        let res = allWords.filter(el => el == word);
        let countWord = res.length;
        // окончание слова в зависимости от цифры
        let endWord = determineEnd(countWord);

        statisticOfWords.push(`${word} - ${countWord} раз${endWord}`)
    }
    return statisticOfWords.join(', ');
}


function determineEnd(number) {
    // окончание слова в зависимости от цифры

    let lastDigit = Number((number).toString().slice(-1));
    let lastTwoDigit = Number((number).toString().slice(-2));
    let lst1 = [11, 12, 13, 14];
    let lst3 = [2, 3, 4];
    let endWord;
    if (lst1.includes(lastTwoDigit)) {
        endWord = '';
    }
    else if (lst3.includes(lastDigit)) {
        endWord = 'а';
    }
    else {
        endWord = '';
    }
    return endWord;
}
