'use strict';

{
  const pairs = 5;
  const types =['S', 'H', 'D', 'C'];
  let cards = [];

  let flipCount = 0;
  let firstCard = null;
  let secondCard = null;

  let startTime;
  let isRunning = false;
  let correctCount = 0;
  let timeoutId;

  function init() {
    let card;
    for (let i = 1; i <= pairs; i++) {
      for (let j = 0; j < types.length; j++) {
        cards.push(createCard(i, types[j]));
      }
    }
    // cards.lengthが0になるまでループ
    while (cards.length) {
      // ランダム番目から1文字を削除して、それをcardに代入
      card = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
      document.getElementById('stage').appendChild(card);
    }
  }

  function createCard(num, type) {
    let container;
    let card;
    let inner;
    inner = '<div class="card-front ' + type + '">' + num + '</div><div class="card-back">CARD</div>';
    card = document.createElement('div');
    card.innerHTML = inner;
    card.classList.add('card');
    card.addEventListener('click', function() {
      flipCard(this);
      if (isRunning === true) {
        return;
      }
      isRunning = true;
      // startTime = Date.now();
      // runTimer();
      document.getElementById('restart').classList.remove('inactive');
    });
    container = document.createElement('div');
    container.classList.add('card-container');
    container.appendChild(card);
    return(container);
  }

  function flipCard(card) {
    if (firstCard !== null && secondCard !== null) {
      return;
    }
    if (card.className.indexOf('open') !== -1) {
      return;
    }
    card.classList.add('open');
    flipCount++;
    if (flipCount % 2 === 1) {
      firstCard = card;
    } else {
      secondCard = card;
      // カードが違っていた場合も一度オープンしてから閉じる
      secondCard.addEventListener('transitionend', check);
    }
  }

  function check() {
    if (
      firstCard.children[0].textContent !==
      secondCard.children[0].textContent
    ) {
      firstCard.classList.remove('open');//openクラスを外す
      secondCard.classList.remove('open');
    } else {
      correctCount++;
      if (correctCount === pairs) {
        clearTimeout(timeoutId);
      }
    }
    // 重複してイベントが設定されないためremove
    secondCard.removeEventListener('transitionend', check);
    firstCard = null;
    secondCard = null;
  }

  // function runTimer() {
  //   document.getElementById('score').textContent = ((Date.now() - startTime) / 1000).toFixed(2);
  //   timeoutId = setTimeout(function () {
  //     runTimer();
  //   });
  // }
  init();

}
