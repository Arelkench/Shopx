const
    buttonCart = document.querySelector('.button-cart'),
    modalCart = document.querySelector('.overlay'),
    modalClose = document.querySelector('.modal__header-close');
const openModal =  () => {
    modalCart.classList.add('show');
}
const closeModal =  () => {
    modalCart.classList.remove('show');
}

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

