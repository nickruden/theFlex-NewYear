let selectedDesign = null;
let selectedImageSrc = null;

let designSwiper;
let textSwiper;

let certificateValue = 0;
let nominalValue = 0;

const inputs = {
    design: document.getElementById('designInput'),
    text: document.getElementById('textCardInput'),
    price: document.getElementById('priceInput'),
    senderName: document.getElementById('senderName'),
    senderEmail: document.getElementById('senderEmail'),
    senderCity: document.getElementById('senderCity'),
    senderReceivingTypeStudio: document.getElementById('receivingStudio'),
    senderReceivingTypeEmail: document.getElementById('receivingEmail'),
    recipientName: document.getElementById('recipientName'),
    recipientPhone: document.getElementById('recipientPhone'),
    recipientCity: document.getElementById('recipientCity'),
};

const initPhoneMask = (phoneInput) => {
    const initialMask = '+7 (';

    // Обработчик фокуса
    phoneInput.addEventListener('focus', () => {
        if (phoneInput.value === initialMask) {
            phoneInput.value = ''; // Очищаем поле, если оно содержит только маску
        }
        if (phoneInput.value === '') {
            phoneInput.value = initialMask; // Устанавливаем маску, если поле пустое
        }
    });

    // Обработчик потери фокуса
    phoneInput.addEventListener('blur', () => {
        if (phoneInput.value.trim() === '' || phoneInput.value === initialMask) {
            phoneInput.value = ''; // Очищаем поле, если оно пустое или содержит только маску
        }
    });

    // Обработчик ввода
    phoneInput.addEventListener('input', (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Убираем все нецифровые символы
        let formattedValue = '';

        // Форматируем значение в соответствии с маской
        if (value.length > 0) {
            formattedValue = '+7 (' + value.substring(1, 4); // Добавляем "+7 ("
        }
        if (value.length > 4) {
            formattedValue += ') ' + value.substring(4, 7); // Добавляем ") "
        }
        if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 9); // Добавляем первый дефис
        }
        if (value.length > 9) {
            formattedValue += '-' + value.substring(9, 11); // Добавляем второй дефис
        }

        event.target.value = formattedValue; // Устанавливаем отформатированное значение
    });
};


const initDesignSwiper = () => {
    console.log("инитсвипер");
    
    if (designSwiper) {
        designSwiper.destroy(true, true);
        console.log("дестрой")
    }

    designSwiper = new Swiper(".design__swiper", {
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 7,
        initialSlide: 1,
        pagination: {
            el: '.design__swiper-paginaton',
        },
        navigation: {
            nextEl: '.design__swiper-button-next',
            prevEl: '.design__swiper-button-prev',
        },
        on: {
            slideChangeTransitionEnd: selectDesign // вызываем функцию при смене слайда
        }
    });

    designSwiper.slideTo(sessionStorage.getItem('activeSlideIndex') - 1 || 0, 0);
    console.log("сохранённый индекс:", sessionStorage.getItem('activeSlideIndex'))

    selectDesign();
};


const selectDesign = () => {
    const activeSlide = document.querySelector('.design__swiper-slide.swiper-slide-active');
    const dataDesign = activeSlide.getAttribute('data-design');

    const designInput = document.getElementById('designInput');
    designInput.value = dataDesign;

    const slideImg = activeSlide.querySelector('.design__slide-img');
    selectedImageSrc = slideImg.src;
    console.log('Сохраненный дизайн:', designInput.value, 'Сохраненная картинка:', selectedImageSrc);

    sessionStorage.setItem('activeSlideIndex', dataDesign);
    console.log("сохранённый индекс:", sessionStorage.getItem('activeSlideIndex'))

    const cardTitle = document.querySelector('.text-page__card-title');
    if (dataDesign == 1) {
        cardTitle.style.color = '#4C4B4B';
    } else {
        cardTitle.style.color = '';
    }
};


const initTextSwiper = () => {
    console.log("инит textSwiper");

    if (textSwiper) {
        textSwiper.destroy(true, true);
        console.log("textSwiper уничтожен");
    }

    textSwiper = new Swiper(".text-page__swiper", {
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.text-page__swiper-pagination',
        },
        navigation: {
            nextEl: '.text-page__swiper-button-next',
            prevEl: '.text-page__swiper-button-prev',
        },
        on: {
            slideChangeTransitionEnd: selectText // Вызываем функцию при смене слайда
        }
    });

    // Устанавливаем активный слайд из sessionStorage
    textSwiper.slideTo(sessionStorage.getItem('activeTextSlideIndex') || 1, 0);
    console.log("сохранённый индекс текста:", sessionStorage.getItem('activeTextSlideIndex'));

    selectText(); // Вызываем функцию для обновления текста
};

const selectText = () => {
    const activeSlide = document.querySelector('.text-page__swiper-slide.swiper-slide-active');
    const dataText = activeSlide.querySelector('.text-page__slide-text').textContent.trim(); // Получаем текст из атрибута data-text

    const textInput = document.getElementById('textCardInput');
    textInput.value = dataText;

    const cardTitle = document.querySelector('.text-page__card-title');
    cardTitle.textContent = dataText; 

    console.log('Сохраненный текст:', dataText);

    sessionStorage.setItem('activeTextSlideIndex', textSwiper.realIndex); // Сохраняем индекс активного слайда
    console.log("сохранённый индекс текста:", sessionStorage.getItem('activeTextSlideIndex'));
};;


document.addEventListener('DOMContentLoaded', function () {
    const mainPage = document.querySelector('.main-page');
    const innerPage = document.querySelector('.inner-page');
    const loadingPage = document.querySelector('.loading-page');
    const finalPage = document.querySelector('.final-page');

    // кнопки
    const mainButton = document.querySelector('.main-page__button');
    const nextButton = innerPage.querySelector('.next-button');
    const backButton = innerPage.querySelector('.back-button');

    // внутренние страницы и заголовок
    const contentBlocks = innerPage.querySelectorAll('.inner-page__content > div');
    const title = document.querySelector('.inner-page__title');

    // объект для хранения заголовков страниц
    const pageTitles = {
        'design-page': 'Выбери оформление',
        'text-page': 'Выбери текст',
        'amount-page': 'Выбери номинал',
        'data-page-one': 'Введите данные',
        'data-page-two': 'Введите данные'
    };

    const background = {
        main: 'linear-gradient(155deg, #181818 17%, #9B68BF)',
        final: 'linear-gradient(180deg, #181818 18%, #9B68BF)',
        default: '#181818'
    };
    
    function setBackground(page) {
        const wrapper = document.querySelector('.wrapper');
        if (wrapper) {
            wrapper.style.background = background[page] || background.default;
        }
    }

    let currentStep = sessionStorage.getItem('currentStep') || 0;
    console.log(currentStep)

    // функция для показа внутреннего блока
    function showBlock(block) {
        contentBlocks.forEach(b => b.style.display = 'none'); // скрываем все внутренние страницы

        block.style.display = 'flex';
        title.textContent = pageTitles[block.classList[0]]; // ставим нужный заголовок

        if (block.classList.contains('main-page')) {
            setBackground('main');
        } else if (block.classList.contains('final-page')) {
            setBackground('final');
        } else {
            setBackground('default');
        }

        if (block.classList.contains('text-page')) {
            console.log(sessionStorage.getItem('activeSlideIndex'))
            const cardImg = block.querySelector('.text-page__card-img');
            if (selectedImageSrc) {
                cardImg.src = selectedImageSrc;
            }

            initTextSwiper();
        }

        if (block.classList.contains('amount-page')) {
            initPriceButtons();
        }

        
        if (block.classList.contains('data-page-one')) {
            initSenderForm();
            for (const key in inputs) {
                const input = inputs[key];
                if (!input) continue;
                input.addEventListener('input', () => {
                    validateField(input);
                });
            }

            inputs.senderReceivingTypeStudio.addEventListener('change', checkCheckboxes);
            inputs.senderReceivingTypeEmail.addEventListener('change', checkCheckboxes);
        }

        if (block.classList.contains('data-page-two')) {
            initRecipientForm();
            console.log(recipientFormData);

            for (const key in inputs) {
                const input = inputs[key];
                if (!input) continue;
                input.addEventListener('input', () => {
                    validateField(input);
                });
            }

            const phoneInput = document.getElementById('recipientPhone');
            if (phoneInput) {
                initPhoneMask(phoneInput);
            }
        }
    }

    // обработчик для кнопки на главной странице
    mainButton.addEventListener('click', function () {
        mainPage.style.display = 'none';
        innerPage.style.display = 'block'; 
        showBlock(contentBlocks[0]);
        initDesignSwiper();
        currentStep = 0;
        sessionStorage.setItem('currentStep', currentStep);
    });

    // обработчик для кнопки "далее"
    nextButton.addEventListener('click', function () {
        if (currentStep < contentBlocks.length - 1) {
            if (currentStep === 3) {
                if (!validateSenderFields()) {
                    return;
                }
            }
            
            // переходим к следующему шагу
            currentStep++;
            showBlock(contentBlocks[currentStep]);
            sessionStorage.setItem('currentStep', currentStep);
            console.log(currentStep);

        } else {
            // переход к loading-page и затем к final-page
            console.log(validateRecipientFields())
            if (!validateRecipientFields()) {
                return;
            }
            innerPage.style.display = 'none';
            loadingPage.style.display = 'block';
            fillFinalForm();
            setTimeout(() => {
                loadingPage.style.display = 'none';
                finalPage.style.display = 'block';
                setBackground('final');
            }, 2000); // задержка для имитации загрузки
        }
    });

    // обработчик для кнопки "назад"
    backButton.addEventListener('click', function () {
        if (currentStep > 0) {
            // переходим к предыдущему шагу
            currentStep--;
            showBlock(contentBlocks[currentStep]);
            console.log(currentStep)

            // если возвращаемся на design-page, восстанавливаем активный слайд
            if (currentStep === 0) {
                designSwiper.slideTo(sessionStorage.getItem('activeSlideIndex') - 1 || 0, 0);
                console.log("переход к слайду(назад):", sessionStorage.getItem('activeSlideIndex'))
            } else if (currentStep === 2) {
                const savedPrice = sessionStorage.getItem('certificateValue');
                console.log(1, savedPrice)
                updatePrice(savedPrice);
                const priceButtons = document.querySelectorAll('.amount-page__price-button');
                priceButtons.forEach(button => {
                    if (button.getAttribute('data-price') === savedPrice) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                });
            }
        } else {
            // возвращаемся на главную страницу
            innerPage.style.display = 'none';
            mainPage.style.display = 'flex';
            sessionStorage.clear();
            setBackground('main');
        }
    });

    // инициализация переключения цен
    function initPriceButtons() {
        const priceButtons = document.querySelectorAll('.amount-page__price-button');
        const priceInput = document.getElementById('priceInput');
        let selectedPrice;

        if (sessionStorage.getItem('certificateValue')) {
            const savedPrice = sessionStorage.getItem('certificateValue');
            updatePrice(savedPrice);
            const priceButtons = document.querySelectorAll('.amount-page__price-button');
            priceButtons.forEach(button => {
                if (button.getAttribute('data-price') === savedPrice) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        } else {
            updatePrice(priceButtons[0].getAttribute('data-price'));
            priceButtons[0].classList.add('active');
        }

        priceButtons.forEach(button => {
            button.addEventListener('click', function () {
                priceButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedPrice = button.getAttribute('data-price');
                console.log(priceInput.value)
                updatePrice(selectedPrice);
            });
        });
    }

    function updatePrice(price) {
        const bonusMap = {
            '5': 2,
            '5000': 2000,
            '7000': 3000,
            '10000': 5000
        };
    
        const bonusPrice = bonusMap[price];

    
        certificateValue = +price;
        nominalValue = +price + bonusPrice;
        priceInput.value = nominalValue;
        sessionStorage.setItem('priceValue', priceInput.value);
    
        document.getElementById('certificate-value').textContent = `${formatNumber(certificateValue)}₽`;
        document.getElementById('bonuses-value').textContent = `+${formatNumber(bonusPrice)}₽`;
        document.getElementById('your-certificate-value').textContent = `${formatNumber(nominalValue)}₽`;
        document.getElementById('total-value').textContent = `${formatNumber(certificateValue)}₽`;
    
        sessionStorage.setItem('certificateValue', certificateValue);
        sessionStorage.setItem('nominalValue', nominalValue);
    }

    let senderFormData = {
        senderName: '',
        senderEmail: '',
        senderCity: '',
        senderReceivingTypeStudio: '',
        senderReceivingTypeEmail: '',
    };
    
    let recipientFormData = {
        recipientName: '',
        recipientPhone: '',
        recipientCity: '',
    };
    
    function initSenderForm() {
        const form = document.querySelector('.data-page-one__form');
    
        // Функция для сохранения данных формы
        function saveFormData() {
            senderFormData.senderName = form.querySelector('#senderName').value;
            senderFormData.senderEmail = form.querySelector('#senderEmail').value;
            senderFormData.senderCity = form.querySelector('#senderCity').value;
            senderFormData.senderReceivingTypeStudio = inputs.senderReceivingTypeStudio.checked;
            senderFormData.senderReceivingTypeEmail = inputs.senderReceivingTypeEmail.checked;
            sessionStorage.setItem('senderFormData', JSON.stringify(senderFormData));
        }
    
        // Функция для восстановления данных формы
        function restoreFormData() {
            const savedFormData = sessionStorage.getItem('senderFormData');
            if (savedFormData) {
                senderFormData = JSON.parse(savedFormData);

                form.querySelector('#senderName').value = senderFormData.senderName;
                form.querySelector('#senderEmail').value = senderFormData.senderEmail;
                form.querySelector('#senderCity').value = senderFormData.senderCity;

                inputs.senderReceivingTypeStudio.checked = senderFormData.senderReceivingTypeStudio || false;
                inputs.senderReceivingTypeEmail.checked = senderFormData.senderReceivingTypeEmail || false;
            }
        }
    
        form.addEventListener('input', function (event) {
            if (event.target.id === 'senderName' || event.target.id === 'senderEmail') {
                saveFormData();
            }
        });
    
        form.addEventListener('change', function (event) {
            if (event.target.id === 'senderCity' || event.target.name === 'senderReceivingTypeStudio' || event.target.name === 'senderReceivingTypeEmail') {
                saveFormData();
            }
        });
    
        restoreFormData();
    }
    
    function initRecipientForm() {
        const form = document.querySelector('.data-page-two__form');
    
        // Функция для сохранения данных формы
        function saveFormData() {
            recipientFormData.recipientName = form.querySelector('#recipientName').value;
            recipientFormData.recipientPhone = form.querySelector('#recipientPhone').value;
            recipientFormData.recipientCity = form.querySelector('#recipientCity').value;
    
            // Сохраняем данные в sessionStorage
            sessionStorage.setItem('recipientFormData', JSON.stringify(recipientFormData));
        }
    
        // Функция для восстановления данных формы
        function restoreFormData() {
            const savedFormData = sessionStorage.getItem('recipientFormData');
            if (savedFormData) {
                recipientFormData = JSON.parse(savedFormData);
    
                // Заполняем поля формы
                form.querySelector('#recipientName').value = recipientFormData.recipientName;
                form.querySelector('#recipientPhone').value = recipientFormData.recipientPhone;
                form.querySelector('#recipientCity').value = recipientFormData.recipientCity;
            }
        }
    
        // Настройка обработчиков событий
        form.addEventListener('input', function (event) {
            if (event.target.id === 'recipientName' || event.target.id === 'recipientPhone') {
                saveFormData();
            }
        });
    
        form.addEventListener('change', function (event) {
            if (event.target.id === 'recipientCity') {
                saveFormData();
            }
        });
    
        // Восстанавливаем данные при инициализации
        restoreFormData();
    }
});

function checkCheckboxes() {
    if (!inputs.senderReceivingTypeStudio.checked && !inputs.senderReceivingTypeEmail.checked) {
        document.querySelector(".data-page-one__checkbox-error").innerHTML = 'Не выбран способ получения сертификата!';
        document.querySelector(".data-page-one__checkbox-error").style.display = 'block';
        inputs.senderReceivingTypeStudio.parentElement.classList.add('invalid');
        inputs.senderReceivingTypeEmail.parentElement.classList.add('invalid');
    } else {
        document.querySelector(".data-page-one__checkbox-error").style.display = 'none';
        inputs.senderReceivingTypeStudio.parentElement.classList.remove('invalid');
        inputs.senderReceivingTypeEmail.parentElement.classList.remove('invalid');
    }
}

// Функция для подстановки значений в финальную форму
const fillFinalForm = () => {
    const finalForm = document.querySelector('.uc-form');

    if (!finalForm) {
        console.error('Финальная форма не найдена');
        return;
    }

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    for (const key in inputs) {
        const finalInput = finalForm.querySelector(`[name="final${capitalize(key)}"]`);
        console.log(finalInput, inputs[key].value)

        if (key === 'senderReceivingTypeStudio' || key === 'senderReceivingTypeEmail') {
            finalInput.checked = inputs[key].checked;
            finalInput.value = inputs[key].checked ? true : false;
            console.log(inputs[key].checked);
        } else if (finalInput) {
            finalInput.value = inputs[key].value;
        }
    }

    // Подставляем выбранную картинку и текст в final-page__card
    const finalCard = document.querySelector('.final-page__card');
    if (finalCard) {
        const cardImg = finalCard.querySelector('.final-page__card-img');
        const cardTitle = finalCard.querySelector('.final-page__card-title');
        const cardPrices = finalCard.querySelectorAll('.final-page__card-price');;


        if (inputs.design.value == '1') {
            cardTitle.style.color = '#4C4B4B';
        }

        if (cardImg) {
            cardImg.src = selectedImageSrc || './assets/images/design-page/slide-img-2.png';
        }

        if (cardTitle) {
            cardTitle.textContent = inputs.text.value || '';
        }

        const nominalValue = sessionStorage.getItem('nominalValue') || 0;
        console.log(nominalValue, sessionStorage.getItem('nominalValue'));
        
        cardPrices.forEach(priceElement => {
            const priceData = priceElement.getAttribute('data-nominal');
            if (nominalValue == priceData) {
                priceElement.style.display = 'block';
            } else {
                priceElement.style.display = 'none';
            }
        });
    }

    const button = document.querySelector('.final-page__button');
    if (button) {
        const certificateValue = sessionStorage.getItem('certificateValue') || 0;
        const nominalValue = sessionStorage.getItem('nominalValue') || 0;

        // Формируем ссылку
        const link = `#order:Сертификат ${nominalValue}=${certificateValue}`;
        button.setAttribute('href', link);

        console.log(button)
    }

    console.log('Значения успешно подставлены в финальную форму');
};

const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Валидация полей отправителя
const validateSenderFields = () => {
    let isValid = true;

    // Проверяем только поля отправителя
    const senderInputs = {
        senderName: inputs.senderName,
        senderEmail: inputs.senderEmail,
        senderCity: inputs.senderCity,
        senderReceivingTypeStudio: inputs.senderReceivingTypeStudio,
        senderReceivingTypeEmail: inputs.senderReceivingTypeEmail,
    };

    for (const key in senderInputs) {
        const input = senderInputs[key];
        if (!input) continue;

        if (!validateField(input)) {
            isValid = false;
        }
    }

    if (!inputs.senderReceivingTypeStudio.checked && !inputs.senderReceivingTypeEmail.checked) {
        document.querySelector(".data-page-one__checkbox-error").innerHTML = 'Не выбран способ получения сертификата!';
        isValid = false;

        document.querySelector(".data-page-one__checkbox-error").style.display = 'block';
        inputs.senderReceivingTypeStudio.parentElement.classList.add('invalid');
        inputs.senderReceivingTypeEmail.parentElement.classList.add('invalid');
    } else {
        document.querySelector(".data-page-one__checkbox-error").style.display = 'none';
        inputs.senderReceivingTypeStudio.parentElement.classList.remove('invalid');
        inputs.senderReceivingTypeEmail.parentElement.classList.remove('invalid');
    }

    return isValid;
};

// Валидация полей получателя
const validateRecipientFields = () => {
    let isValid = true;

    // Проверяем только поля получателя
    const recipientInputs = {
        recipientName: inputs.recipientName,
        recipientPhone: inputs.recipientPhone,
        recipientCity: inputs.recipientCity,
    };

    for (const key in recipientInputs) {
        const input = recipientInputs[key];
        if (!input) continue;

        if (!validateField(input)) {
            isValid = false;
        }
    }

    return isValid;
};

const validateField = (input) => {
    const value = input.value.trim();
    let isValid = true;

    // Убираем класс .invalid перед проверкой
    input.classList.remove('invalid');

    // Проверка на пустое поле
    if (value === '') {
        isValid = false;
    }

    // Проверка для поля name (без цифр)
    if (input.id === 'senderName' || input.id === 'recipientName') {
        if (/\d/.test(value)) {
            isValid = false;
        }
    }

    // Проверка для email (наличие @ и домена)
    if (input.id === 'senderEmail') {
        if (!/@/.test(value) || !value.includes('.') || value.indexOf('@') === 0 || value.indexOf('@') === value.length - 1) {
            isValid = false;
        }
    }

    if (input.id === 'recipientPhone') {
        if (value === '') {
            isValid = false;
        }
    }

    input.dataset.originalPlaceholder = input.placeholder;

    // Если поле невалидно, добавляем класс .invalid и обновляем placeholder
    if (!isValid) {
        input.classList.add('invalid');

        // Если placeholder ещё не содержит текст (обязательно), добавляем его
        if (!input.dataset.placeholderChanged) {
            input.placeholder += ' (обязательно)';
            input.dataset.placeholderChanged = true; // Устанавливаем флаг, что placeholder был изменён
        }
    } else {
        // Если поле стало валидным, сбрасываем флаг и восстанавливаем исходный placeholder
        input.dataset.placeholderChanged = false;
        input.placeholder = input.dataset.originalPlaceholder || input.placeholder; // Восстанавливаем исходный placeholder
    }

    return isValid;
};

window.addEventListener('beforeunload', function () {
    sessionStorage.clear();
});
