
function mainPage() {
    root.innerHTML = '';
    root.appendChild(createNavigation('Одежда', 'Картины', 'Телефоны'));

    const productClass = document.createElement('div');
    productClass.classList.add('product-path');
    productClass.appendChild(productPath('Главная', 'Картины'));
    root.appendChild(productClass);
    root.appendChild(createProductGrid());
}

function productPath(category, subCategory) {
    const list = document.createElement('ul');

    const cat = document.createElement('li');
    const ref = document.createElement('a');
    ref.href = '/';
    ref.innerHTML = category;
    cat.appendChild(ref);
    list.appendChild(cat);

    const subcat = document.createElement('li');
    const subref = document.createElement('a');
    subref.href = '/';
    subref.innerHTML = subCategory;
    subcat.appendChild(subref);
    list.appendChild(subcat);

    return list;
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
    srchInput.classList.add('search_term');
    srchInput.placeholder = 'Поиск';
    srch.appendChild(srchInput);

    const srchBtn = document.createElement('button');
    srchBtn.type = 'submit';
    srchBtn.classList.add('search_button');
    srchBtn.innerHTML = "<i> GO </i>";
    srch.appendChild(srchBtn);

    navigation.appendChild(nav);
    navigation.appendChild(srch);
    return navigation;
}

function createProductGrid() {
    const productGrid = document.createElement('div');
    productGrid.classList.add("product-grid");

    const productList = document.createElement('section');
    productList.classList.add('cards');

    for (let i = 0; i < 10; i++) {
        productList.appendChild(createProduct(
            "#",
            "./static/img/2spooky4me.jpg",
            "Картина" + i,
            "100p",
            "Москва"
        ));
    }

    productGrid.appendChild(productList);
    return productGrid;
}

function createProduct(href, src, name, productPrice, location) {
    const product = document.createElement('div');
    product.classList.add('card');

    const hyper = document.createElement('a');
    hyper.href = href;


    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = src;
    const figCap = document.createElement('figcaption');
    const text = document.createElement('h3');
    text.innerHTML = name;
    figCap.appendChild(text);
    figure.appendChild(img);
    figure.appendChild(figCap);

    imageContainer.appendChild(figure);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');

    const loc = document.createElement('p');
    loc.innerHTML = location;

    const price = document.createElement('p');
    price.classList.add('card_price');
    price.innerHTML = productPrice;

    cardInfo.appendChild(loc);
    cardInfo.appendChild(price);

    hyper.appendChild(imageContainer);
    hyper.appendChild(cardInfo);
    product.appendChild(hyper);
    return product;
}
