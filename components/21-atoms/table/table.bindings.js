// Global bindings for ResponsiveTable, Swiper, equalizeTableSwiperHeights.
'use strict';

(function () {
  
  /**
   * Sets equal heights for cells in each row across fixed and swiper columns.
   */
  function equalizeTableSwiperHeights() {
    document.querySelectorAll('.table-swiper-wrapper').forEach(function (wrapper) {
      const rowMap = {};

      // Gather cells per data-row-index.
      wrapper.querySelectorAll('.cell-row[data-row-index]').forEach(function (el) {
        const index = el.getAttribute('data-row-index');
        if (!rowMap[index]) {
          rowMap[index] = [];
        }
        rowMap[index].push(el);
      });

      // Reset existing heights.
      Object.keys(rowMap).forEach(function (key) {
        rowMap[key].forEach(function (cell) {
          cell.style.height = '';
        });
      });

      // Set max height per row.
      Object.keys(rowMap).forEach(function (key) {
        const maxHeight = Math.max.apply(null, rowMap[key].map(function (el) {
          return el.offsetHeight;
        }));
        rowMap[key].forEach(function (cell) {
          cell.style.height = maxHeight + 'px';
        });
      });

      // Set equal heights of .column-header elements.
      const headers = wrapper.querySelectorAll('.column-header');
      if (headers.length > 0) {
        // Reset hoogtes
        headers.forEach(function (el) {
          el.style.height = '';
        });
        const maxHeaderHeight = Math.max.apply(null, Array.from(headers).map(el => el.offsetHeight));
        headers.forEach(function (el) {
          el.style.height = maxHeaderHeight + 'px';
        });
      }
    });
  }

  // Initialise each Swiper separately.
  document.querySelectorAll('.table-swiper-wrapper .swiper').forEach(function (swiperElement) {
    const swiperWrapper = swiperElement.closest('.table-swiper-wrapper');
    const paginationEl = swiperWrapper.querySelector('.swiper-pagination');
    const nextEl = swiperWrapper.querySelector('.swiper-button-next');
    const prevEl = swiperWrapper.querySelector('.swiper-button-prev');
    const slideCount = swiperElement.querySelectorAll('.swiper-slide').length;

    new Swiper(swiperElement, { // eslint-disable-line no-undef
      slidesPerView: 'auto',
      spaceBetween: 0,
      loop: slideCount > 1,
      pagination: {
        el: paginationEl,
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: nextEl,
        prevEl: prevEl
      },
      on: {
        init: function () {
          equalizeTableSwiperHeights();
          setTimeout(() => this.update(), 100);
        },
        resize: function () {
          equalizeTableSwiperHeights();
        }
      }
    });
  });

  // Extra security with (re)loading or resize.
  window.addEventListener('load', equalizeTableSwiperHeights);
  window.addEventListener('resize', equalizeTableSwiperHeights);
})();
