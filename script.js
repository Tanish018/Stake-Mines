const boxes = document.querySelectorAll('.box');
const mines = document.querySelector('.mines');
const buttons = document.querySelector('.buttons');
const normalButton = document.querySelector('.Normal');
const winButton = document.querySelector('.Win');
const loseButton = document.querySelector('.Lose');
const reset = document.querySelector(".Reset");
const start = document.querySelector('.Start');
const stop = document.querySelector('.stop');
const wallet = document.querySelector('.amount');
const submit = document.querySelector('.submit');

let btn = null;
let mine;
let count = 0;
let gc = false;

const audio1 = new Audio('./audio/audio1.mp3')
const audio2 = new Audio('./audio/audio2.mp3')

function update(activeBtn) {
  [normalButton, loseButton, winButton].forEach(btn => {
    btn.classList.remove('black');
    if (btn === activeBtn) {
      btn.classList.add('black');
    }
  });
}

function clearBoxes() {
  boxes.forEach(box => {
    box.classList.remove('green', 'red', 'clicked');
    box.style.border = 'none';
    mines.style.pointerEvents = 'auto';
  });
}

submit.addEventListener('click', () => {
  mine = parseInt(document.getElementById('mine').value);
  if (isNaN(mine) || mine < 1 || mine > 24) {
    alert("Please enter a valid number between 0 and 25.");
    return;
  }
  alert(`You have selected ${mine} mines`);
});

function saveToLS() {
  const amt = wallet.innerHTML
  localStorage.setItem('amount', amt);
}

function random() {
  count = 0;
  let unclicked = Array.from(boxes).filter(box => !box.classList.contains('clicked'));
  unclicked.forEach(box => box.classList.remove('green', 'red'));

  let indexes = [...Array(unclicked.length).keys()];
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  indexes.forEach((ix, i) => {
    if (i < mine-1) {
      unclicked[ix].classList.add('red');
      count++;
    } else {
      unclicked[ix].classList.add('green');
    }
  });
}

boxes.forEach(box => {
  box.addEventListener('click', () => {
    if (btn === 'normal' && !box.classList.contains('clicked')) {
      box.classList.add('clicked')
      let a = Math.random();
      if (a <= 0.50) {
        box.classList.add('green');
        gc = true;
        audio1.play()
      }
      else {
        count++
        box.classList.add('red');
        wallet.innerHTML = wallet.innerHTML - 100;
        saveToLS()
        audio2.play()
        alert("Game Over ! Try Again");
        random();
        mines.style.pointerEvents = 'none';
        stop.style.display = 'none';
        gc = false;
      }
    }
    else if (btn === 'win') {
      box.classList.add('green');
      audio1.play()
      alert("🎉 Congratulations!! 🎉 You Win 🥳")
      wallet.innerHTML = parseInt(wallet.innerHTML) + 100
      saveToLS()
      mines.style.pointerEvents = 'none'
      boxes.forEach(otherBox => {
        if (otherBox !== box) {
          otherBox.classList.remove('green', 'red')
          let a = Math.random()
          if (a < 0.5) {
            otherBox.classList.add('green')
          } else {
            otherBox.classList.add('red')
          }
        }
      });
    } 
    else if (btn === 'lose') {
      box.classList.add('red');
      audio2.play()
      alert("Game Over ! Please Reset and Try Again")
      wallet.innerHTML = parseInt(wallet.innerHTML) - 100;
      saveToLS()
      mines.style.pointerEvents = 'none'
      boxes.forEach(otherBox => {
        if (otherBox !== box) {
          otherBox.classList.remove('green', 'red')
          let a = Math.random()
          if (a < 0.5) {
            otherBox.classList.add('green')
          } 
          else {
            otherBox.classList.add('red')
          }
        }
      });
    }
  });
});


normalButton.addEventListener('click', () => {
  update(normalButton);
  btn = 'normal';
  clearBoxes();
  if (wallet.innerHTML <= 0) {
    alert("Insufficient Coins!");
    wallet.innerHTML = 0;
    start.classList.remove('green');
    btn = null;
    clearBoxes();
    update(null)
    stop.style.display = 'none';
  }
  stop.style.display = 'inline';
});

winButton.addEventListener('click', ()=> {
  update(winButton);
  btn = 'win'; 
  clearBoxes();
  if (wallet.innerHTML <= 0) {
    alert("Insufficient Coins! Please Reload the Page.");
    wallet.innerHTML = 0;
    start.classList.remove('green');
    btn = null;
    clearBoxes();
    update(null)
    stop.style.display = 'none';
  }
});

loseButton.addEventListener('click', ()=> {
  update(loseButton);
  btn = 'lose';
  clearBoxes();
  if (wallet.innerHTML <= 0) {
    alert("Insufficient Coins!");
    wallet.innerHTML = 0;
    start.classList.remove('green');
    btn = null;
    clearBoxes();
    update(null)
    stop.style.display = 'none';
  }
})

reset.addEventListener('click', ()=> {
  start.classList.remove('green');
  btn = null;
  clearBoxes();
  update(null)
  stop.style.display = 'none';
  saveToLS()
});

const para = document.querySelector('.real')
const hide = document.querySelector('.hide')

para.addEventListener('click', ()=> {
  buttons.style.display = 'flex';
  para.style.display = 'none';
  hide.style.display = 'block';
})

hide.addEventListener('click', ()=> {
  buttons.style.display = 'none';
  para.style.display = 'flex';
  hide.style.display = 'none';
})

start.addEventListener('click', ()=> {
  start.classList.add('green');
  update(normalButton);
  btn = 'normal';
  clearBoxes();
  stop.style.display = 'inline';
  if (wallet.innerHTML <= 0) {
    alert("Insufficient Coins!");
    wallet.innerHTML = 0;
    start.classList.remove('green');
    btn = null;
    clearBoxes();
    update(null)
    stop.style.display = 'none';
  }
  buttons.style.display = 'none';
  para.style.display = 'flex';
  hide.style.display = 'none';
})

boxes.forEach(box => {
  box.addEventListener('click', ()=> {
    box.style.border = '1px solid black';
  })
});

stop.addEventListener('click', ()=> {
  if (gc) {
    let count = 0;
    boxes.forEach(box => {
      if (box.classList.contains('green') && box.style.border === '1px solid black') {
        count++;
      }
    });
    let amt = count * 100
    wallet.innerHTML = parseInt(wallet.innerHTML) + amt;
    saveToLS()
    gc = false;
    mines.style.pointerEvents = 'none';
    stop.style.display = 'none';
    alert(`You have won ${amt} coins`);
  }
  clearBoxes();
})

const savedAmt = localStorage.getItem('amount');
if (savedAmt !== null) {
  wallet.innerHTML = savedAmt;
} else {
  wallet.innerHTML = wallet.innerHTML;
  saveToLS();
}