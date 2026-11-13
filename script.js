(function () {
  // ---------- 滚动时高亮当前区块对应的导航（首页 + 菜单页分类条通用） ----------
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));
  var ids = links
    .map(function (a) { return a.getAttribute('data-section'); })
    .filter(function (id, i, arr) { return arr.indexOf(id) === i && document.getElementById(id); })
    // 按页面中出现的先后排序，保证往下滚时后面的区块覆盖前面的
    .sort(function (a, b) {
      var pos = document.getElementById(a).compareDocumentPosition(document.getElementById(b));
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

  function setCurrent(id) {
    links.forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('data-section') === id);
    });
    // 菜单页：让当前分类按钮滚到可见位置
    var chip = document.querySelector('.chip-nav a.is-current');
    if (chip && chip.scrollIntoView) {
      var nav = chip.parentNode;
      var left = chip.offsetLeft - (nav.clientWidth - chip.clientWidth) / 2;
      nav.scrollTo ? nav.scrollTo({ left: left, behavior: 'smooth' }) : (nav.scrollLeft = left);
    }
  }

  if (ids.length) {
    var current = null;
    var onScroll = function () {
      // 以屏幕上方 35% 处为判断线
      var line = window.innerHeight * 0.35;
      var found = ids[0];
      ids.forEach(function (id) {
        if (document.getElementById(id).getBoundingClientRect().top <= line) found = id;
      });
      if (found !== current) { current = found; setCurrent(found); }
    };
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  // ---------- 店庆倒计时（本地时间 2026-11-18，仅首页） ----------
  var box = document.getElementById('countdown');
  if (!box) return;

  var start = new Date(2026, 10, 18, 0, 0, 0);
  var end = new Date(2026, 10, 19, 0, 0, 0);
  var label = document.getElementById('countdown-label');
  var nums = {
    d: box.querySelector('[data-unit="d"]'),
    h: box.querySelector('[data-unit="h"]'),
    m: box.querySelector('[data-unit="m"]'),
    s: box.querySelector('[data-unit="s"]')
  };
  var timer;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var now = new Date();
    if (now >= end) {
      box.className = 'countdown is-over';
      label.textContent = '两周年店庆已圆满结束，谢谢每一位来捧场的你！';
      clearInterval(timer);
      return;
    }
    if (now >= start) {
      box.className = 'countdown is-today';
      label.textContent = '🎉 就是今天！两家门店第二杯半价进行中';
      return;
    }
    var diff = Math.floor((start - now) / 1000);
    nums.d.textContent = Math.floor(diff / 86400);
    nums.h.textContent = pad(Math.floor((diff % 86400) / 3600));
    nums.m.textContent = pad(Math.floor((diff % 3600) / 60));
    nums.s.textContent = pad(diff % 60);
  }

  tick();
  timer = setInterval(tick, 1000);
})();
