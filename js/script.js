
document.addEventListener('DOMContentLoaded', () => {
    // Функция для форматирования цены (рубли, разделители тысяч)
    const formatPrice = value => new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
    }).format(value);

    // Получаем все кнопки выбора веса и элементы для вывода цены и артикула
    const sizeButtons = document.querySelectorAll('.size-btn');
    const priceCurrent = document.getElementById('price-current');
    const priceOld = document.getElementById('price-old');
    const skuEl = document.getElementById('sku');

    // Основная функция выбора кнопки
    function selectBtn(btn) {
        // Снимаем активность со всех кнопок
        sizeButtons.forEach(item => {
            item.classList.remove('active');
            item.setAttribute('aria-pressed', 'false');
        });

        // Активируем выбранную кнопку
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Получаем данные из data-атрибутов
        const price = parseFloat(btn.dataset.price);
        const oldPrice = parseFloat(btn.dataset.old);
        const article = btn.dataset.article;

        // Обновляем текущую цену
        priceCurrent.textContent = formatPrice(price);

        // Логика отображения старой цены и класса скидки
        if (!Number.isNaN(oldPrice) && oldPrice > price) {
            priceOld.textContent = formatPrice(oldPrice);
            priceCurrent.classList.add('discount'); // Показываем красным цветом
        } else {
            priceOld.textContent = '';              // Скрываем старую цену, если скидки нет
            priceCurrent.classList.remove('discount');
        }

        // Обновляем артикул (SKU)
        skuEl.textContent = article || '';
    }

    // Инициализация кнопок: добавляем ARIA-атрибуты и обработчики событий
    sizeButtons.forEach((btn, index) => {
        btn.setAttribute('role', 'tab');            // Семантика для скринридеров
        btn.setAttribute('tabindex', '0');          // Делает кнопки фокусируемыми
        btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');

        // Обработка клика мышью
        btn.addEventListener('click', () => selectBtn(btn));

        // Обработка навигации стрелками (клавиатура)
        btn.addEventListener('keydown', event => {
            const currentIndex = index;
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            const nextIndex = currentIndex < sizeButtons.length - 1 ? currentIndex + 1 : sizeButtons.length - 1;

            if (event.key === 'ArrowRight') {
                event.preventDefault();             // Отменяем стандартное поведение
                sizeButtons[nextIndex].focus();    // Переводим фокус
                selectBtn(sizeButtons[nextIndex]);  // Выбираем следующую кнопку
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                sizeButtons[prevIndex].focus();
                selectBtn(sizeButtons[prevIndex]);
            }
        });
    });

    // Находим изначально активную кнопку или берём первую по умолчанию
    const init = document.querySelector('.size-btn.active') || sizeButtons;
    if (init) {
        selectBtn(init); // Применяем логику выбора для стартового состояния
    }
});
