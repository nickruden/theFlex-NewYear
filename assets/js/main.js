const designSwiper = new Swiper(".design__swiper", {
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
})

const textPageSwiper = new Swiper(".text-page__swiper", {
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 20,
    initialSlide: 1,
    pagination: {
        el: '.text-page__swiper-paginaton',
    },
    navigation: {
        nextEl: '.text-page__swiper-button-next',
        prevEl: '.text-page__swiper-button-prev',
    },
})

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

    let currentStep = 0;

    // функция для показа любого внутреннего блока
    function showBlock(block) {
        contentBlocks.forEach(b => b.style.display = 'none'); // скрываем все внутренние страницы
        block.style.display = 'flex';
        title.textContent = pageTitles[block.classList[0]]; // ставим нужный заголовок
    }

    // обработчик для кнопки на главной странице
    mainButton.addEventListener('click', function () {
        mainPage.style.display = 'none';
        innerPage.style.display = 'block'; 
        showBlock(contentBlocks[0]);
    });

    // обработчик для кнопки "далее"
    nextButton.addEventListener('click', function () {
        if (currentStep < contentBlocks.length - 1) {
            // переходим к следующему шагу
            currentStep++;
            showBlock(contentBlocks[currentStep]);
        } else {
            // переход к loading-page и затем к final-page
            innerPage.style.display = 'none';
            loadingPage.style.display = 'block';
            setTimeout(() => {
                loadingPage.style.display = 'none';
                finalPage.style.display = 'block';
            }, 2000); // задержка для имитации загрузки
        }
    });

    // обработчик для кнопки "назад"
    backButton.addEventListener('click', function () {
        if (currentStep > 0) {
            // переходим к предыдущему шагу
            currentStep--;
            showBlock(contentBlocks[currentStep]);
        } else {
            // возвращаемся на главную страницу
            innerPage.style.display = 'none';
            mainPage.style.display = 'block';
        }
    });

    showBlock(contentBlocks[0]);
});