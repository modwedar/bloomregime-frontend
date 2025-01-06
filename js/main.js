const $ = str => document.querySelector(str);
const $$ = str => document.querySelectorAll(str);

(function () {
    if (!window.app) {
        window.app = {};
    }
    app.carousel = {
        swiper: null,
        removeClass: function (el, classname = '') {
            if (el) {
                if (classname === '') {
                    el.className = '';
                } else {
                    el.classList.remove(classname);
                }
                return el;
            }
            return;
        },
        reorder: function () {
            let childcnt = $("#carousel").children.length;
            let childs = $("#carousel").children;

            for (let j = 0; j < childcnt; j++) {
                childs[j].dataset.pos = j;
            }
        },
        move: function (el) {
            let selected = el;

            if (typeof el === "string") {
                selected = (el == "next") ? $(".selected").nextElementSibling : $(".selected").previousElementSibling;
            }

            let curpos = parseInt(app.selected.dataset.pos);
            let tgtpos = parseInt(selected.dataset.pos);

            let cnt = curpos - tgtpos;
            let dir = (cnt < 0) ? -1 : 1;
            let shift = Math.abs(cnt);

            for (let i = 0; i < shift; i++) {
                let el = (dir == -1) ? $("#carousel").firstElementChild : $("#carousel").lastElementChild;

                if (dir == -1) {
                    el.dataset.pos = $("#carousel").children.length;
                    $('#carousel').append(el);
                } else {
                    el.dataset.pos = 0;
                    $('#carousel').prepend(el);
                }

                app.carousel.reorder();
            }

            app.selected = selected;
            let next = selected.nextElementSibling || selected.parentElement.firstElementChild;
            let prev = selected.previousElementSibling || selected.parentElement.lastElementChild;
            let prevSecond = prev.previousElementSibling || selected.parentElement.lastElementChild;
            let nextSecond = next.nextElementSibling || selected.parentElement.firstElementChild;

            selected.className = '';
            selected.classList.add("selected");

            app.carousel.removeClass(prev).classList.add('prev');
            app.carousel.removeClass(next).classList.add('next');

            app.carousel.removeClass(nextSecond).classList.add("nextRightSecond");
            app.carousel.removeClass(prevSecond).classList.add("prevLeftSecond");

            app.carousel.nextAll(nextSecond).forEach(item => { item.className = ''; item.classList.add('hideRight') });
            app.carousel.prevAll(prevSecond).forEach(item => { item.className = ''; item.classList.add('hideLeft') });
        },
        nextAll: function (el) {
            let els = [];
            if (el) {
                while (el = el.nextElementSibling) { els.push(el); }
            }
            return els;
        },
        prevAll: function (el) {
            let els = [];
            if (el) {
                while (el = el.previousElementSibling) { els.push(el); }
            }
            return els;
        },
        keypress: function (e) {
            switch (e.which) {
                case 37: // left
                    app.carousel.move('prev');
                    break;
                case 39: // right
                    app.carousel.move('next');
                    break;
                default:
                    return;
            }
            e.preventDefault();
            return false;
        },
        select: function (e) {
            let tgt = e.target;
            while (!tgt.parentElement.classList.contains('carousel')) {
                tgt = tgt.parentElement;
            }
            app.carousel.move(tgt);
        },
        previous: function (e) {
            if (window.innerWidth <= 991) {
                if (!this.swiper) {
                    const swiperElement = document.getElementById('mySwiper');
                    this.swiper = new Swiper(swiperElement, {
                        spaceBetween: 32,
                        grabCursor: true,
                    });
                }
                this.swiper.slidePrev();
            } else {
                app.carousel.move('prev');
            }
        },
        next: function (e) {
            if (window.innerWidth <= 991) {
                if (!this.swiper) {
                    const swiperElement = document.getElementById('mySwiper');
                    this.swiper = new Swiper(swiperElement, {
                        spaceBetween: 32,
                        grabCursor: true,
                    });
                }
                this.swiper.slideNext();
            } else {
                app.carousel.move('next');
            }
        },
        init: function () {
            document.addEventListener("keydown", app.carousel.keypress);
            $('#carousel').addEventListener("click", app.carousel.select, true);

            app.carousel.reorder();
            $('#prev').addEventListener("click", app.carousel.previous);
            $('#next').addEventListener("click", app.carousel.next);
            app.selected = $(".selected");
        },
        state: {
            downX: 0,
            startX: 0,
            isSwiping: false
        }
    };
    app.carousel.init();
})();

window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("sticky");
        navbar.classList.add("px-3");
    } else {
        navbar.classList.remove("sticky");
        navbar.classList.remove("px-3");
    }
});