const wrapper = document.querySelector('.wrapper');

function loginPage() {
    const root = document.createElement('div');
    root.id = 'root';
    wrapper.appendChild(root);
    root.innerHTML = '';
    
    const content = document.createElement('div');
    content.classList.add('content');

    const productClass = document.createElement('div');
    productClass.classList.add('product-path');
    var productClassInfo = productPath('Volchock','Картины');
    productClassInfo.forEach(item => {
        productClass.appendChild(item);
    })

    const productGrid = document.createElement('div');
    productGrid.classList.add("product-grid");

    const productList = document.createElement('ul');
    
    for (let i = 0; i < 10; i++) {
        productList.appendChild(createProduct(
            "#",
            "./static/img/2spooky4me.jpg",
            "Картина" + i,
            "100p",
            `Данная картина передавалась из поколения в поколение. 
            Однако наш род угасает, и чтобы продлить его, 
            я вынужден продать это творение.`
        ));
    }

    productGrid.appendChild(productList);
    content.appendChild(createNavigation('Одежда', 'Картины', 'Телефоны'));
    content.appendChild(productClass);
    content.appendChild(productGrid);
    root.appendChild(content);
    createFooter();
}

loginPage();

function createProduct(href, src, name, productPrice, description) {
    const product = document.createElement('li');

    const hyper = document.createElement('a');
    hyper.href = href;
    

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = src;

    const figCap = document.createElement('figcaption');
    const text = document.createElement('h3');
    text.innerHTML = name;
    figCap.appendChild(text);


    const price = document.createElement('p');
    price.classList.add('price');
    price.innerHTML=productPrice;
    const desc = document.createElement('p');
    desc.innerHTML=description;

    figure.appendChild(img);
    figure.appendChild(figCap);
    hyper.appendChild(figure)
    product.appendChild(hyper);
    product.appendChild(price);
    product.appendChild(desc);
    return product;
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

function createFooter() {
    const footer = document.createElement('div');
    footer.classList.add('footer');
    const footerText = document.createElement('p');
    footerText.innerHTML = '\u00A9 2021. Volchock team';
    footer.appendChild(footerText);
    wrapper.appendChild(footer);
}