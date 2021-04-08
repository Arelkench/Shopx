const
    buttonCart = document.querySelector('.button-cart'),
    modal = document.querySelector('.overlay'),
    modalClose = document.querySelector('.modal__header-close'),
    modalCart = document.querySelector('.modal__cart'),
    goodsList = document.querySelector('.products-list__inner'),
    modalCartTotal = document.querySelector(".modal__cart-total"),
    customerName = document.forms["cartForm"]["customerName"].value,
    customerPhone = document.forms["cartForm"]["customerPhone"].value,
    cartBuy = document.querySelector(".cart-buy");

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
    cartGoods: [],
    renderCart(){
        modalCart.textContent = "";
        this.cartGoods.forEach(({id, name, price, count}) => {
            const  item = document.createElement("div");
            item.className = "item";
            item.dataset.id = id;
            item.innerHTML = `
                <div class="item__wrapper">
                    <p class="item__name">${name}</p>
                    <p class="item__price">Price: ${price}</p>
                </div>
                <div class="item__count">
                    <button class="count-minus item-btn">-</button>
                    <p class="text">${count}</p>
                    <button class="count-plus item-btn">+</button>
                </div>
                <p class="item__total">Total: ${price * count}</p>
                <button class="item-delete item-btn">x</button>`
            modalCart.append(item);
        });
        const totalPrice = this.cartGoods.reduce((sum, item) => {
            return sum + item.price * item.count ;
        }, 0)
        modalCartTotal.textContent ='Total:  '+ totalPrice + '$'
    },
    plusGood(id) {
        for (let item of cart.cartGoods) {
            if (item.id === id) {
                item.count++;
                break;
            }
        }
        this.renderCart()
    },
    minusGood(id) {
        for (let item of cart.cartGoods) {
            if (item.id === id) {
                if (item.count <= 1) {
                    this.deleteGood(id);
                } else {
                    item.count--;
                }
                break;
            }
        }
        this.renderCart()
    },
    deleteGood(id) {
        this.cartGoods = this.cartGoods.filter(item => id !== item.id);
        this.renderCart();
    },
    addGood(id) {
       const item = this.cartGoods.find(item => item.id === id);
       if (item) {
           item.count++;
       } else  {
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

document.body.addEventListener('click', e => {
    const target = e.target
    const addToCart = target.closest('.add-to-cart');
    if (addToCart){
        cart.addGood(addToCart.dataset.id);
    }
});

modalCart.addEventListener('click', e => {
    const target = e.target ;
    if (target.tagName.toLowerCase() === 'button') {
        const id = target.closest('.item').dataset.id;

        if (target.classList.contains('item-delete')) {
            cart.deleteGood(id);
        }
        if (target.classList.contains('count-minus')) {
            cart.minusGood(id);
        }
        if (target.classList.contains('count-plus')) {
            cart.plusGood(id);
        }
    }
})

const createCard = function ({ name, img, description, id, price}) {
    const product = document.createElement('div');
    product.className = 'product';
    product.innerHTML = `
         <img  src="db/${img}" alt='${name}' class="product__img"/>
         <div class=product__text-box>
            <h3 class="text-box-title text">${name}</h3>
            <p class="text-box-description text">${description}</p>
            <span class="text-box-price text">$${price}</span>
         </div>
         <button class="product__btn add-to-cart" data-id="${id}" type="submit">
             <img src="img/cart__logo.png" alt="cart">
             <span class="button-text">Add to cart</span>
         </button>                   
    `;
    return product;
};

const renderCards = function (data) {
    goodsList.textContent = '';
    const cards = data.map(createCard)
    goodsList.append(...cards)

};

getGoods().then(renderCards);