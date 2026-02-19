let slides = [];
let last = 0; //the last slide
let html = "";
let startX = 0;
let offsetX = 0; //this is how much we move the picture, left(-) or right(+)
let isDragging = false;
let currentElement = {};
let currentIndex = 0; //this is used for X/Heart buttons
let animationID = 0;
let swipeOffsetLimit = 0; //how much of the vw we must swipe to be considered a valid swipe

//transition speed
let dragAnimationTransition = "0.05s";
let reverseAnimationTransition = "0.2s";
let releaseAnimationTransition = "0.4s";
let buttonsAnimationTransition = "0.7s";

//vars needed for calculating swipeSpeed, cause this is how
//bumble determines when to trigger a swipe
let swipeSpeed = 0;
let startTime = 0;
let endTime = 0;

halfWrapper = document.querySelector(".wrapper").offsetWidth / 2 - 15;

// console.log(halfWrapper);
let sign = "";

const wrapper = document.querySelector(".wrapper");
const message = document.getElementById("message");

let timeoutId = 0;

function love(e) {
  clearTimeout(timeoutId);
  key = e.currentTarget;

  key.classList.add("keypress");

  timeoutId = setTimeout(() => {
    key.classList.remove("keypress");
  }, 200);

  currentElement = slides[currentIndex];
  currentElement.style.transform = `translateX(500px) rotate(10deg)`;
  currentElement.style.transition = `transform ${buttonsAnimationTransition} linear`;

  currentIndex--;
}

function nope(e) {
  clearTimeout(timeoutId);
  key = e.currentTarget;

  key.classList.add("keypress");

  timeoutId = setTimeout(() => {
    key.classList.remove("keypress");
  }, 200);

  currentElement = slides[currentIndex];
  currentElement.style.transform = `translateX(-500px) rotate(-10deg)`;
  currentElement.style.transition = `transform ${buttonsAnimationTransition} linear`;
  currentIndex--;
}

function init() {
  wrapper.innerHTML = "";
  html = `<div  class="card unremovable">
       
        <h2>Ooops! You ran out of people</h2>
        <p>This is a demo for Tinder like swipe cards</p>
      </div>`;

  let pic = 0;
  for (let i = 1; i < 100; i++) {
    pic = (i % 6) + 1;
    html += `<div data-index="${i}" id="${pic}" class="card">
        <img src="assets/${pic}.jpg" alt="" />
        <div class = 'textOnPic'>
        <h2>Kate, 4${pic}</h2>
        
        </div>
      </div>`;

    currentIndex = i;
  }

  html += `<div class="buttons">
        <div class="btn dislike">✕</div>
        <div class="btn like">❤</div>
      </div>`;

  wrapper.innerHTML = html;
  const likeBtn = document.querySelector(".like");
  const dislikeBtn = document.querySelector(".dislike");
  likeBtn.addEventListener("click", love);
  dislikeBtn.addEventListener("click", nope);
  slides = Array.from(document.querySelectorAll(".card"));

  slides.forEach((slide, index) => {
    slide.addEventListener("dragstart", (e) => e.preventDefault());

    // slide.addEventListener("click", (e) => mouseMoveHandler(e));

    //these should work for both mouse and touch events
    slide.addEventListener("pointerdown", (e) => mouseDownHandler(e, index));
    slide.addEventListener("pointerup", mouseUpHandler);
    slide.addEventListener("pointermove", mouseMoveHandler);

    //the browser was cancelling my pointer event. To prevent doing this i added touch-action: none !important; to .card from the css
    slide.addEventListener("pointercancel", (e) => {
      // console.log("Pointer cancelled"); //use this for debugging
    });
  });
}

function mouseDownHandler(e, index) {
  e.currentTarget.classList.add("grabbing");
  //console.log(getComputedStyle(e.currentTarget).touchAction); //this is for debugging. Should return none if the css was added

  isDragging = true;
  startTime = Date.now();
  startX = getPositionX(e); //get the position of the mouse click
  currentElement = e.currentTarget;

  // console.log(`OffsetX ${offsetX} StartX ${startX}`);
  animationID = requestAnimationFrame(animation); //start the animation
}

function getPositionX(event) {
  return Math.floor(event.clientX);

  //this line works if we split the events using mouse and touch
  // return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

//all i do here is update the position
function mouseMoveHandler(e) {
  if (isDragging) {
    offsetX = getPositionX(e) - startX;
  }
}

function animation(timestamp) {
  sign = Math.sign(offsetX);

  currentElement.style.transform = `translateX(${offsetX}px) rotate(${sign}0deg)`;
  currentElement.style.transition = `transform ${dragAnimationTransition} linear`;
  animationID = requestAnimationFrame(animation);
}

function reverseAnimation() {
  offsetX = 0;
  currentElement.style.transform = `translateX(${offsetX}px) rotate(0deg)`;
  currentElement.style.transition = `transform ${reverseAnimationTransition} linear`;
}

function mouseUpHandler(e) {
  isDragging = false;
  endTime = Date.now();

  swipeSpeed = Math.abs(offsetX / (endTime - startTime));

  // the condition for swiping is: if we moved the mouse for
  // at least X% of the width and the speed > swipeSpeed than it is
  // considered a valid swipe. Play around with it

  if (
    (offsetX > halfWrapper / 2 && swipeSpeed > 0.4) ||
    (offsetX < -halfWrapper / 2 && swipeSpeed > 0.4)
  ) {
    // console.warn(
    //   `OffsetX: ${offsetX} swipeOffsetLimit ${
    //     halfWrapper / 2
    //   } Speed: ${swipeSpeed}`
    // );

    currentIndex--;

    if (offsetX > 0) {
      offsetX = offsetX + 500;
    } else {
      offsetX = offsetX - 500;
    }
    // console.log(offsetX + " - " + swipeSpeed);

    currentElement.style.transform = `translateX(${offsetX}px) rotate(${sign}0deg)`;
    currentElement.style.transition = `transform ${releaseAnimationTransition} linear`;
    offsetX = 0;
    cancelAnimationFrame(animationID);
  } else {
    reverseAnimation(); //move the slide back into position
    cancelAnimationFrame(animationID);

    sign = -1 * sign;
  }
}

init();
// message.innerHTML = halfWrapper;
