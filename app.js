let slides = [];
let last = 0; //the last slide
let html = "";
let startX = 0;
let offsetX = 0; //this is how much we move the picture, left(-) or right(+)
let isDragging = false;
let currentElement = {};
let animationID = 0;
let swipeOffsetLimit = 0; //how much of the vw we must swipe to be considered a valid swipe

//vars needed for calculating swipeSpeed, cause this is how
//bumble determines when to trigger a swipe
let swipeSpeed = 0;
let startTime = 0;
let endTime = 0;

halfWrapper = document.querySelector(".wrapper").offsetWidth / 2 - 15;

// console.log(halfWrapper);
let sign = "";

//we show this while isDragging is true and the offsetX exceeds a certain value
//we remove it when:
// *cancel swipe
// *finish swipe(removeCard function)
let heartOverlay = document.querySelector(".heart-overlay");
let nopeOverlay = document.querySelector(".nope-overlay");

const wrapper = document.querySelector(".wrapper");
const message = document.getElementById("message");

function love() {
  //get first slide
  if (slides.length > 2) {
    currentElement = slides[slides.length - 1];

    offsetX = 500;
    animationID = requestAnimationFrame(animation);
    // cancelAnimationFrame(animationID);
    removeCard();

    slides = Array.from(document.querySelectorAll(".card:not(.remove)"));
    currentElement = slides[slides.length - 1];
    console.log(currentElement);
  } else {
    console.log("we finished the slides");
  }
}

function nope() {
  if (slides.length > 2) {
    currentElement = slides[slides.length - 1];

    offsetX = -500;
    animationID = requestAnimationFrame(animation);
    // cancelAnimationFrame(animationID);
    removeCard();

    slides = Array.from(document.querySelectorAll(".card:not(.remove)"));
    currentElement = slides[slides.length - 1];
    // console.log(currentElement);
  } else {
    console.log("we finished the slides");
  }
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
    html += `<div id="${pic}" class="card">
        <img src="assets/${pic}.jpg" alt="" />
        <div class = 'textOnPic'>
        <h2>Kate, 4${pic}</h2>
        
        </div>
      </div>`;
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

    //mouse events(replaced with pointer events)
    // slide.addEventListener("mousedown", (e) => mouseDownHandler(e, index));
    // slide.addEventListener("mouseup", (e) => mouseUpHandler(e, index));
    // slide.addEventListener("mousemove", (e) => mouseMoveHandler(e, index));
    slide.addEventListener("click", (e) => mouseMoveHandler(e));

    //touch events(replaced with pointer events)

    // slide.addEventListener("touchstart", (e) => mouseDownHandler(e, index));
    // slide.addEventListener("touchend", mouseUpHandler);
    // slide.addEventListener("touchmove", mouseMoveHandler);

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
  animationID = requestAnimationFrame(animation); //start the animation
}

function getPositionX(event) {
  return event.clientX;

  //this line works if we split the events using mouse and touch
  // return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

//all i do here is update the position
function mouseMoveHandler(e) {
  if (isDragging) {
    offsetX = getPositionX(e) - startX;
    // console.log("MouseMove " + offsetX);

    //When you hold a card and swipe it displays a heart(if you go right) or an X(if you go left)
    //on the center of the screen. (suggesting to the user what he is about to do)
    //if you release it it goes away. I set it to be displayed after you swiped past 25%(aprox) of the vw

    if (offsetX > halfWrapper / 2) {
      heartOverlay.classList.add("show");
    } else {
      heartOverlay.classList.remove("show");
    }
    if (offsetX < -halfWrapper / 2) {
      nopeOverlay.classList.add("show");
    } else {
      nopeOverlay.classList.remove("show");
    }
  }
}

function animation(timestamp) {
  sign = Math.sign(offsetX);

  currentElement.style.transform = `translateX(${offsetX}px) rotate(${sign}0deg)`;
  animationID = requestAnimationFrame(animation);
}

function reverseAnimation() {
  offsetX = 0;
  currentElement.style.transform = `translateX(${offsetX}px) rotate(0deg)`;
}

function mouseUpHandler(e) {
  isDragging = false;
  endTime = Date.now();

  swipeSpeed = Math.abs(offsetX / (endTime - startTime));
  // console.log(`${offsetX} ${swipeSpeed}`);
  //the condition for swiping is: if we moved the mouse for at least 25% of the width and the speed > swipeSpeed than it is
  //considered a valid swipe
  swipeOffsetLimit = halfWrapper - 20;
  if (
    (offsetX > swipeOffsetLimit && swipeSpeed > 1) ||
    (offsetX < -swipeOffsetLimit && swipeSpeed > 1)
  ) {
    console.log(
      `OffsetX: ${offsetX} swipeOffsetLimit ${swipeOffsetLimit} Speed: ${swipeSpeed}`
    );

    if (offsetX > 0) {
      offsetX = offsetX + 500;
    } else {
      offsetX = offsetX - 500;
    }
    // console.log(offsetX + " - " + swipeSpeed);

    currentElement.style.transform = `translateX(${offsetX}px) rotate(${sign}0deg)`;

    cancelAnimationFrame(animationID);

    removeCard();
  } else {
    console.log(
      `OffsetX: ${offsetX} swipeOffsetLimit ${swipeOffsetLimit} Speed: ${swipeSpeed}`
    );
    // console.log("cancel swipe, speed too low " + swipeSpeed);
    reverseAnimation(); //move the slide back into position
    cancelAnimationFrame(animationID);
    heartOverlay.classList.remove("show");
    nopeOverlay.classList.remove("show");
    sign = -1 * sign;
  }
}

function removeCard() {
  setTimeout(() => {
    currentElement.classList.add("remove");
  }, 500);
  heartOverlay.classList.remove("show");
  nopeOverlay.classList.remove("show");
}

init();
// message.innerHTML = halfWrapper;
