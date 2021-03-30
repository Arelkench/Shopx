const
    buttonCart = document.querySelector('.button-cart'),
    modal = document.querySelector('.overlay'),
    modalClose = document.querySelector('.modal__header-close'),
    modalCart = document.querySelector('.modal__cart'),
    goodsList = document.querySelector('.products-list__inner'),
    modalCartTotal = document.querySelector(".modal__cart-total");

const openModal =  () => {
    modal.classList.add('show');
    cart.renderCart();
}
const closeModal =  () => {
    modal.classList.remove('show');
}

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);



const getGoods = async () => {
    const res = await fetch('db/db.json');
    if (!res.ok) {
        throw 'error' + res.status
    }
    return await  res.json();
}

const cart = {
    cartGoods: [
        {
            id: "099",
            name: "Dior",
            price: 999,
            count: 2,
        },
        {
            id: "090",
            name: "Dior44",
            price: 993,
            count: 1,
        },
    ],
    renderCart(){
        modalCart.textContent = "";
        this.cartGoods.forEach(({id, name, price, count}) => {
            const  item = document.createElement("div");
            item.className = "item";
            item.dataset.id = id;
            item.innerHTML = `
                <p class="item__name">${name}</p>
                <p class="item__price">${price}</p>
                <div class="item__count">
                    <button class="count-minus item-btn">-</button>
                    <p class="text">${count}</p>
                    <button class="count-plus item-btn">+</button>
                </div>
                <p class="item__total">'Total:' + ${price * count}</p>
                <button class="item-delete item-btn">x</button>`
            modalCart.append(item);
        });
        const totalPrice = this.cartGoods.reduce((sum, item) => {
            return sum + item.price * item.count ;
        }, 0)
        modalCartTotal.textContent = totalPrice + '$'
    },
    deleteGood(id){
        this.cartGoods = this.cartGoods.filter(item => id !== item.id);
        this.renderCart();
    },
    minusGood(id){
        for (const item of this.cartGoods){
            if (item.id === id) {
                if (item.count <= 1){
                    this.deleteGood(id);
                } else  {
                    item.count--;
                }
                break;
            }
        }
        this.renderCart()
    },
    plusGood(id){
        for (const item of this.cartGoods){
            if (item.id === id) {
                item.count++;
            }
            break;
        }
        this.renderCart()
    },
    addCartGoods(id){
        const goodItem = this.cartGoods.find(item => item.id === id)
        console.log(goodItem);
        if (goodItem) {
            this.plusGood(id);
        } else {
            getGoods()
                .then(data => data.find(item => item.id === id))
                .then(({id, name, price}) => {
                    this.cartGoods.push({
                        id,
                        name,
                        price,
                        count: 1,
                    })
                })
        }
    }
};

const createCard = function ({label, name, img, description, id, price}) {
    const product = document.createElement('div');
    product.className = 'product';
    product.innerHTML = `
         <img  src="db/${img}" alt='${name}' class="product__img"/>
         <div class=product__text-box>
            <h3 class="text-box-title text">${name}</h3>
            <p class="text-box-description text">${description}</p>
            <span class="text-box-price text">$${price}</span>
         </div>
         <button class="product__btn add-to-cart" data-id="003" type="submit">
             <img src="img/cart__logo.png" alt="cart">
             <span class="button-text">Add to cart</span>
         </button>                   
    `;
    console.log(product);
    return product;
};

document.body.addEventListener('click', e => {
    const addToCart = e.target.closest('.add-to-cart');
    if (addToCart){
        cart.addCartGoods(addToCart.dataset.id);
    }
})

modalCart.addEventListener('click', e => {
    const target = e.target ;
    if (target.tagName === "BUTTON") {
        const id = target.closest('.item').dataset.id;

        if (target.classList.contains('cart-btn-delete')) {
            cart.deleteGood(id);
        }
        if (target.classList.contains('cart-btn-minus')) {
            cart.minusGood(id);
        }
        if (target.classList.contains('cart-btn-plus')) {
            cart.plusGood(id);
        }
    }
})
const renderCards = function (data) {
    goodsList.textContent = '';
    console.log(data);
    const cards = data.map(createCard)
    goodsList.append(...cards)
};
getGoods().then(renderCards);
const filterCards = function (field, value) {
    getGoods()
        .then(data => data.filter(good => good[field] === value))
        .then(renderCards);
}





