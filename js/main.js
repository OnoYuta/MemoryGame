'use strict';

{
  const pairs = 2;
  const types =['S', 'H', 'D', 'C'];

  let cards = [];
  let flipCount = 0;
  let firstCard = null;
  let secondCard = null;

  let isRunning = false;
  let correctCount = 0;
  let timeoutId;

  let yourTurn;
  let youWins = 0;
  let cpuWins = 0;
  const turn = document.getElementById('turn');
  const youWinsLabel = document.getElementById('youWins');
  const cpuWinsLabel = document.getElementById('cpuWins');
  const btn = document.getElementById('restart');

  function init() {
    let card;
    for (let i = 1; i <= pairs; i++) {
      for (let j = 0; j < types.length; j++) {
        cards.push(createCard(i, types[j]));
      }
    }
    // cards.lengthが0になるまでループ
    while (cards.length) {
      // ランダム番目から1文字を取得しcardに代入
      card = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
      document.getElementById('stage').appendChild(card);
    }
    yourTurn = true;
  }

  function createCard(num, type) {
    let container;
    let card;
    let inner;
    inner = '<div class="card-front ' + type + '">' + num + '</div><div class="card-back">CARD</div>';
    card = document.createElement('div');
    card.innerHTML = inner;
    card.classList.add('card');
    card.classList.add('close');
    card.addEventListener('click', function() {
      if (yourTurn === true) {
        flipCard(this);
        if (isRunning === true) {
          return;
        }
        isRunning = true;
        turn.classList.toggle('yourTurn');
        turn.textContent = "あなたのターン";
        btn.classList.remove('inactive');
      }
    });
    container = document.createElement('div');
    container.classList.add('card-container');
    container.appendChild(card);
    return(container);
  }

  function flipCard(card) {
    // 2枚のカードがopenになっているときはreturn
    if (firstCard !== null && secondCard !== null) {
      return;
    }
    // openしたカードがクリックされたときはreturn
    if (card.className.indexOf('open') !== -1) {
      return;
    }
    card.classList.remove('close');
    card.classList.add('open');
    flipCount++;
    if (flipCount % 2 === 1) {
      firstCard = card;
    } else {
      secondCard = card;
      // カードが違っていた場合も一度openしてから閉じる
      secondCard.addEventListener('transitionend', check);
    }
  }

  function check() {
    if (
      firstCard.children[0].textContent !==
      secondCard.children[0].textContent
    ) {
      failure();
    } else {
      correctCount += 2;
      if (yourTurn === true) {
        youWins += 2;
        youWinsLabel.textContent = "YOU: " + youWins + " 枚";
      } else {
        cpuWins += 2;
        cpuWinsLabel.textContent = "CPU: " + cpuWins + " 枚";
      }
      if (correctCount === pairs * types.length) {
        setTimeout( () => {
          let result;
          if (youWins > cpuWins) {
            result = "YOU WIN!";
          } else if (youWins < cpuWins) {
            result = "YOU LOSE ...";
          } else {
            result = "DRAW GAME";
          }
          alert(result);
        }, 100);
      }
    }
    // 重複してイベントが設定されないためremove
    secondCard.removeEventListener('transitionend', check);
    firstCard = null;
    secondCard = null;
  }

  function failure() {
    firstCard.classList.remove('open');
    secondCard.classList.remove('open');
    firstCard.classList.add('close');
    secondCard.classList.add('close');
    if (yourTurn === true) {
      yourTurn = false;
      turn.textContent = "ＣＰＵのターン";
      cpuTurn();
    } else {
      yourTurn = true;
      turn.textContent = "あなたのターン";
      clearTimeout(timeoutId);
    }
    turn.classList.toggle('yourTurn');
  }

  function cpuTurn() {
    const closed = document.getElementsByClassName('close');
    const rand = Math.floor(Math.random() * closed.length);
    const card = closed[rand];
    flipCard(card);
    if (closed.length !== 0) {
      timeoutId = setTimeout(() => {
        cpuTurn();
      }, 1200);
    }
  }

  btn.addEventListener('mousedown', () => {
    btn.classList.add('pressed');
  })

  btn.addEventListener('mouseup', () => {
    btn.classList.remove('pressed');
  })

  init();

}
