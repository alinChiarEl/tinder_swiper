# Description

A tinder-like swiper using javascript, html and css. No libraries and frameworks.

---

### Notes

- The swipe movement is triggered when 2 conditions are met. The swipeSpeed and the offsetX reach a
  certain limit
- The limits are configurable and you can play around with it to see what you need.
- I took inspiration from tinder for the design but from bumble for the swipe functionality. I assume they are similar.
- I initially used separate listeners for mouse and touch events but then i read that pointer events are better
- If somebody wants to implement this be careful to always have this in your css on the swipeable element.
  touch-action: none !important;
- Without this the browser will randomly cancel your pointer event but only on mobile. More details in the code.

# Tech Stack

- **Frontend:** Javascript, CSS, HTML.
