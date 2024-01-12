"use strict";

const formText = document.querySelector('.from-text'),
    toText = document.querySelector('.to-text'),
    exchangeIcon = document.querySelector('.exchange'),
    selectTag = document.querySelectorAll('select'),
    icons = document.querySelectorAll('.row i'),
    translateBtn = document.querySelector('button');


selectTag.forEach((tag, id) => {
    for(let country_code in countries) {
        let selected;
        if(id == 0 && country_code == 'en-GB') {
            selected = 'selected';
        } else if(id == 1 && country_code == 'hi-IN') {
            selected = 'selected';
        }
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML('beforeend', option);
    }
});


exchangeIcon.addEventListener('click', () => { 
    let tempText = formText.value,
        tempLang = selectTag[0].value;
    formText.value = toText.value;
    toText.value = tempText;

    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});


formText.addEventListener('keyup', () => {
    if(!formText.value) {
        toText.value = "";
    }
});


translateBtn.addEventListener('click', () => {
    let text = formText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;

    if(!text) return;

    toText.setAttribute('placeholder', 'Translating...');
    let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            data.matched.forEach(data => {
                if(data.id == 0) {
                    toText.value = data.translation
                }
            });
            toText.setAttribute("placeholder", "Translation")
    });
});


icons.forEach((icon) => {
    icon.addEventListener("click", ({ target }) => {
        if(!formText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(formText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(formText.value);
                utterance.lang = selectTag[0].value
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value
            }
            speechSynthesis.speak(utterance);
        }
    });
});