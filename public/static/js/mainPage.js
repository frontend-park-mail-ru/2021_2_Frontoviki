loginPage();

// добавляет поиск
function loginPage() {

    root.innerHTML = '';
    
    const content = document.createElement('div');
    content.classList.add('content');

    const productClass = document.createElement('div');
    productClass.classList.add('product-path');
    var productClassInfo = productPath('Volchock','Картины');
    productClassInfo.forEach(item => {
        productClass.appendChild(item);
    })

    content.appendChild(createNavigation('Одежда', 'Картины', 'Телефоны'));
    content.appendChild(productClass);
    content.appendChild(createProductGrid());
    root.appendChild(content);
    createFooter();
}

function productPath(category, subCategory) {
    const cat = document.createElement('a');
    cat.innerHTML = category;
    cat.href="#";

    const sign = document.createElement('p');
    sign.innerHTML = '\u2192';

    const subcat = document.createElement('a');
    subcat.innerHTML = subCategory;
    subcat.href="#";

    const res = [cat, sign, subcat];
    return res;
}

// Добавляет любое количество пунктов в выпадющее меню категорий и поиск
function createNavigation(...categories) {
    const navigation = document.createElement('div');
    navigation.classList.add('navigation');

    const nav = document.createElement('nav');
    nav.classList.add('categories');
    const menu = document.createElement('p');
    menu.innerHTML = "III";
    nav.appendChild(menu);

    const input = document.createElement('input');
    input.id = 'categories_toogle';
    input.type = 'checkbox';
    input.checked = true;
    nav.appendChild(input);

    // выпадающее меню с категориями
    const catList = document.createElement('ul');
    categories.forEach(elem => {
        const cat = document.createElement('li');
        const ref = document.createElement('a');
        ref.href = '#';
        ref.innerHTML = elem;
        cat.appendChild(ref);
        catList.appendChild(cat);
    });
    nav.appendChild(catList);


    const srch = document.createElement('div');
    srch.classList.add('search');

    const srchInput = document.createElement('input');
    srchInput.type = 'text';
    srchInput.classList.add('searchTerm');
    srchInput.placeholder = 'Поиск';
    srch.appendChild(srchInput);

    const srchBtn = document.createElement('button');
    srchBtn.type = 'submit';
    srchBtn.classList.add('searchButton');
    srchBtn.innerHTML = "GO";
    srch.appendChild(srchBtn);

    navigation.appendChild(nav);
    navigation.appendChild(srch);
    return navigation;
}