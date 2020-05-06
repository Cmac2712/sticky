export default class Sticky {

  constructor(node, options) {
    this.active = false;
    this.viewport = document.body;
    this.viewportInitialPaddingTop = document.body.style.paddingTop;
    this.element = this.getElement(node);
    this.triggerOffset = this.getTopOffset(this.element);
    this.stuck = false;

    this.defaults = {
      minWidth: 0, 
      afterStick: undefined, 
      afterUnstick: undefined
    }

    this.settings = {...this.defaults, ...options}

    if (this.getViewportWidth() > this.settings.minWidth) {
      this.init();
    }
  }

  destroy() {
    this.active = false;
    //window.removeEventListener('scroll', this.onScrollBound, true);
    //window.removeEventListener('resize', this.onResizeThrottleBound, true);
    this.element.classList.remove('stuck');
    document.body.style.paddingTop = this.viewportInitialPaddingTop;
  }

  init () {
    this.active = true;
    this.onScrollBound = this.onScroll.bind(this);
    this.onResizeThrottleBound = this.throttle(this.onResize.bind(this), 1000);

    window.addEventListener('scroll', this.onScrollBound);
    window.addEventListener('resize', this.onResizeThrottleBound);

    this.onScroll();
  }

  throttle (func, limit) {
    let lastFunc
    let lastRan
    return function() {
      const context = this
      const args = arguments
      if (!lastRan) {
        func.apply(context, args)
        lastRan = Date.now()
      } else {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(function() {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args)
            lastRan = Date.now()
          }
        }, limit - (Date.now() - lastRan))
      }
    }
  }

  getElement(el) {
    if (el instanceof HTMLElement) { 
      return el;
    } else if (typeof el === "string") {
      return document.querySelector(el);
    } else {
      throw new Error('Please provide a CSS Selector of HTMLElement to the Sticky constructor.')
    }
  } 

  getViewportWidth() {
    return window.innerWidth;
  }

  getTopOffset(el) {
    return el.getBoundingClientRect().top + document.documentElement.scrollTop;
  }

  getHeight(el) {
    return el.getBoundingClientRect().height;
  }

  onScroll() {

    if (!this.active) return;

    if (pageYOffset >= this.triggerOffset && this.stuck === false) {
      this.stick();
    } else if (pageYOffset < this.triggerOffset && this.stuck === true) {
      this.unstick();
    }
  }

  onResize() {
    this.viewportInitialPaddingTop = document.body.style.paddingTop;
    this.triggerOffset = this.getTopOffset(this.element);

    if (this.getViewportWidth() < this.settings.minWidth) {
      this.destroy();
    } else if (this.getViewportWidth() > this.settings.minWidth) {
      this.init();
    }
  }

  stick() {
    this.stuck = true;
    this.element.classList.add('stuck');
    this.viewport.style.paddingTop = `${this.getHeight(this.element)}px`;

    if (this.settings.afterStick) {
      this.settings.afterStick(this.element);
    }
  }

  unstick() {
    this.stuck = false;
    this.element.classList.remove('stuck');
    this.viewport.style.paddingTop = this.viewportInitialPaddingTop;

    if (this.settings.afterStick) {
      this.settings.afterStick(this.element);
    }

  }
} 