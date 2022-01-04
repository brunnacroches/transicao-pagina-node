import { preloadImages } from './utils';
import { gsap } from 'gsap';
import { TypeTransition } from './TypeTransition';
import { Item } from './Item';
import gsap from 'gsap/gsap-core';



// pré-carregar as imagens e depois remover o carregador (classe de carregamento 
preloadImages('.item__img, .article__img').then(() => document.body.classList.remove('loading'));

// transição de texto
const typeT = new TypeTransition(document.querySelector('[data-type-transition]'));

//verdadeiro se houver uma animação em execução
let isAnimating = false;

// quadro de elemento 
const frameEl = document.querySelector('.frame');


/**** Items ****/

// items array
let itemsInstanceArr = [];
// item atual index
let currentItem = -1;
// Items wrap 
const itemsWrap = document.querySelector('.item-wrap');

[...itemsWrap.querySelectorAll('.item')].forEach(itemEl => {
    // create um novo Item
    const item = new Item(itemEl);
    // adicione-o ao array de índices do item
    itemsInstanceArr.push(item);
    
    // na ação do clique
    item.DOM.el.addEventListener('click', () => openItem(item));
});

const openItem = item => {
    if ( isAnimating ) return;
    isAnimating = true;

    // update currentItem index
    currentItem = itemsInstanceArr.indexOf(item);
    
    // gsap timeline
    const openTimeline = gsap.timeline({
        onComplete: () => isAnimating = false
    });
    
    // rótulos
    openTimeline.addLabel('start', 0)
    // a transição do tipo começa um pouco depois da animação dos itens
    .addLabel('typeTransition', 0.3)
    // o artigo vai mostrar um pouco antes de terminar a transição do texto
    .addLabel('articleOpening', typeT.in().totalDuration()*.75 + openTimeline.labels.typeTransition)

    // fade out the items
    .to(itemsInstanceArr.map(item => item.DOM.el), {
        duration: 0.8,
        ease: 'power2.inOut',
        opacity: 0,
        y: (pos) => pos%2 ? '25%' : '-25%'
    }, 'start')
    // esmaecer o quadro da página
    .to(frameEl, {
        duration: 0.8,
        ease: 'power3',
        opacity: 0,
        onComplete: () => gsap.set(frameEl, {pointerEvents: 'none'})
    }, 'start')
    
    // a transição do texto começa aqui
    .add(typeT.in().play(), 'typeTransition')

    // add a classe atual nos item's article e define os ponteiros do evento
    .add(() => {
        gsap.set(backCtrl, {pointerEvents: 'auto'})
        gsap.set(itemsWrap, { pointerEvents: 'none' });
        itemsInstanceArr[currentItem].DOM.article.classList.add('article--current');
    }, 'articleOpening')
    // mostre o botão voltar
    .to(backCtrl, {
        duration: 0.7,
        opacity: 1
    }, 'articleOpening')
    //ocultar inicialmente todos os elementos do artigo para que possamos animá-los em
    .set([item.article.DOM.title, item.article.DOM.number, item.article.DOM.intro, item.article.DOM.description], {
        opacity: 0,
        y: '50%'
    }, 'articleOpening')
    // a image wrap e image elements  terão valores de tradução opostos (efeito de revelar / não revelar
    .set(item.article.DOM.imageWrap, {y: '100%'}, 2)
    .set(item.article.DOM.image, {y: '-100%'}, 2)
    //agora fade in e traduza os elementos do artigo
    .to([item.article.DOM.title, item.article.DOM.number, item.article.DOM.intro, item.article.DOM.description], {
        duration: 1,
        ease: 'expo',
        opacity: 1,
        y: '0%',
        stagger: 0.04
    }, 'articleOpening')
    // e revelar a imagem
    .to([item.article.DOM.imageWrap, item.article.DOM.image], {
        duration: 1,
        ease: 'expo',
        y: '0%'
    }, 'articleOpening');
}


/**** Back action ****/

// back button
const backCtrl = document.querySelector('.back');

const closeItem = () => {
    if ( isAnimating ) return;
    isAnimating = true;

    // item aberto atual
    const item = itemsInstanceArr[currentItem];

    // gsap Linha do tempo
    const closeTimeline = gsap.timeline({
        onComplete: () => isAnimating = false
    });

    // rótulos
    closeTimeline.addLabel('start', 0)
    .addLabel('typeTransition', 0.5)
    .addLabel('showItems', typeT.out().totalDuration()*0.7 + closeTimeline.labels.typeTransition)

    .to(backCtrl, {
        duration: 0.7,
        ease: 'power1',
        opacity: 0
    }, 'start')
    .to([item.article.DOM.title, item.article.DOM.number, item.article.DOM.intro, item.article.DOM.description], {
        duration: 1,
        ease: 'power4.in',
        opacity: 0,
        y: '50%',
        stagger: -0.04
    }, 'start')
    .to(item.article.DOM.imageWrap, {
        duration: 1,
        ease: 'power4.in',
        y: '100%'
    }, 'start')
    .to(item.article.DOM.image, {
        duration: 1,
        ease: 'power4.in',
        y: '-100%'
    }, 'start')

    // remove a classe atual do artigo do item e define os eventos de ponteiro
    .add(() => {
        gsap.set(backCtrl, {pointerEvents: 'none'})
        gsap.set(itemsWrap, { pointerEvents: 'auto' });
        item.DOM.article.classList.remove('article--current');
    })

// a transição do texto começa aqui
.add(typeT.out().play(), 'typeTransition')

    .to(frameEl, {
        duration: 0.8,
        ease: 'power3',
        opacity: 1,
        onStart: () => gsap.set(frameEl, {pointerEvents: 'auto'})
    }, 'showItems')
    .to(itemsInstanceArr.map(item => item.DOM.el), {
        duration: 1,
        ease: 'power3.inOut',
        opacity: 1,
        y: '0%'
    }, 'showItems');
}

backCtrl.addEventListener('click', () => closeItem());

