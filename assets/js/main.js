let selectedDesign = null;
let selectedImageSrc = null;

let designSwiper;
let textSwiper;

const inputs = {
    price: document.getElementById('priceInput'),
    design: document.getElementById('designInput'),
    text: document.getElementById('textCardInput'),
    senderName: document.getElementById('senderName'),
    senderEmail: document.getElementById('senderEmail'),
    senderCity: document.getElementById('senderCity'),
    senderReceivingType: document.querySelector('input[name="senderReceivingType"]:checked'),
    recipientName: document.getElementById('recipientName'),
    recipientPhone: document.getElementById('recipientPhone'),
    recipientCity: document.getElementById('recipientCity'),
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

    // функция для показа любого внутреннего блока
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
            console.log(senderFormData);
        }

        if (block.classList.contains('data-page-two')) {
            initRecipientForm();
            console.log(recipientFormData);
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
            // переходим к следующему шагу
            currentStep++;
            showBlock(contentBlocks[currentStep]);
            sessionStorage.setItem('currentStep', currentStep);
            console.log(currentStep)
        } else {
            // переход к loading-page и затем к final-page
            innerPage.style.display = 'none';
            loadingPage.style.display = 'block';
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
                const savedPrice = sessionStorage.getItem('priceValue');
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

        if (sessionStorage.getItem('priceValue')) {
            const savedPrice = sessionStorage.getItem('priceValue');
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
                priceInput.value = selectedPrice;
                sessionStorage.setItem('priceValue', priceInput.value);
                console.log(selectedPrice)
                updatePrice(selectedPrice);
            });
        });
    }

    function updatePrice(price) {
        const bonusPrice = 2000;

        document.getElementById('certificate-value').textContent = `${price}₽`;
        document.getElementById('bonuses-value').textContent = `+${bonusPrice}₽`;
        document.getElementById('your-certificate-value').textContent = `${+price + +bonusPrice}₽`;
        document.getElementById('total-value').textContent = `${price}₽`;
    }

    let senderFormData = {
        senderName: '',
        senderEmail: '',
        senderCity: '',
        senderReceivingType: '',
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
            senderFormData.senderReceivingType = form.querySelector('input[name="senderReceivingType"]:checked')?.id || '';
    
            // Сохраняем данные в sessionStorage
            sessionStorage.setItem('senderFormData', JSON.stringify(senderFormData));
        }
    
        // Функция для восстановления данных формы
        function restoreFormData() {
            const savedFormData = sessionStorage.getItem('senderFormData');
            if (savedFormData) {
                senderFormData = JSON.parse(savedFormData);
    
                // Заполняем поля формы
                form.querySelector('#senderName').value = senderFormData.senderName;
                form.querySelector('#senderEmail').value = senderFormData.senderEmail;
                form.querySelector('#senderCity').value = senderFormData.senderCity;
    
                // Устанавливаем выбранный тип получения
                if (senderFormData.senderReceivingType) {
                    form.querySelector(`#${senderFormData.senderReceivingType}`).checked = true;
                }
            }
        }
    
        // Настройка обработчиков событий
        form.addEventListener('input', function (event) {
            if (event.target.id === 'senderName' || event.target.id === 'senderEmail') {
                saveFormData();
            }
        });
    
        form.addEventListener('change', function (event) {
            if (event.target.id === 'senderCity' || event.target.name === 'senderReceivingType') {
                saveFormData();
            }
        });
    
        // Восстанавливаем данные при инициализации
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

window.addEventListener('beforeunload', function () {
    sessionStorage.clear();
});
