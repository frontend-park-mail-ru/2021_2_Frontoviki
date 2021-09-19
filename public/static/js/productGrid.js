// создание сетки товаров
function createProductGrid() {
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
    return productGrid;
}

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