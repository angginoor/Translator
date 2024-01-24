const selectTag = document.querySelectorAll('select');
const textInput = document.querySelector('.text-input');
const textResult = document.querySelector('.text-result');
const swapIcon = document.querySelector('#swap-icon');
const btn = document.querySelector('.button-translate');
const iconControl = document.querySelectorAll('.icon-control img')

selectTag.forEach((tag, id) => {
    for (let countryCode in countriesList) {
        let selected
        
        if(id === 0 && countryCode === 'en-GB') {
            selected = "Selected"
        } else if (id === 1 && countryCode === 'ja-JP') {
            selected = 'Selected'
        }

        let option = `<option ${selected} value=${countryCode}>${countriesList[countryCode]}</option>`
        tag.insertAdjacentHTML('beforeend', option)
    }
})

textInput.addEventListener("keyup", () => {
    if(!textInput.value) {
        textResult.value = "";
    }
});

const handleSwapLang = async () => {
    try {
        if (!textInput || !textResult || !selectTag[0] || !selectTag[1]) {
            console.error('One or more elements are undefined.');
            return;
        }

        [textInput.value, textResult.value] = [textResult.value, textInput.value];
        [selectTag[0].value, selectTag[1].value] = [selectTag[1].value, selectTag[0].value];

    } catch (error) {
        console.error('Error during swap:', error);
    }
};

const handleBtnCLick = async (e) => {
    try {
        e.preventDefault()

    let text = textInput.value.trim()
    fromLanguage = selectTag[0].value
    toLanguage = selectTag[1].value

    let response = await fetch(`https://api.mymemory.translated.net/get?q=${text}!&langpair=${fromLanguage}|${toLanguage}`, {
        method: "GET"
    })

    if(!response.ok) throw new Error('Please try again!')

    const data = await response.json()
    textResult.value = data.responseData.translatedText
    data.matches.forEach(data => {
        if(data.id === 0) {
            textResult.value = data.translation
        }
    })
  
    } catch (error) {
        alert(error.message)
    }
}

btn.addEventListener('click', handleBtnCLick)
swapIcon.addEventListener('click', handleSwapLang)

iconControl.forEach(icon => {
    icon.addEventListener('click', (event) => {
        const target = event.target

        console.log('clicked target', target)

        if(!textInput.value || !textResult.value) {
            console.log('Text input or result is empty.')
            return
        }

        console.log('Text input:', textInput.value)
        console.log('Text result:', textResult.value)

        if(target.classList.contains('copy')) {
            if(target.id === 'fromCopy') {
                navigator.clipboard.writeText(textInput.value)
                console.log('copy from')
            } else {
                navigator.clipboard.writeText(textResult.value)
                console.log('copy to')
            }
        } else if (target.classList.contains('sound')) {
            let sound = ""

            if(target.id === 'fromSound') {
                sound = new SpeechSynthesisUtterance(textInput.value)
                sound.lang = selectTag[0].value
                console.log('speech from input')
            } else {
                sound = new SpeechSynthesisUtterance(textResult.value)
                sound.lang = selectTag[1].value
                console.log('speech from result')
            }

            speechSynthesis.speak(sound);
        }
    })
})