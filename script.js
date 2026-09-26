(function () {
  var chunks = [
    '.bootcamp-card', '.bootcamp h3', '.bootcamp p', '.bootcamp li',
    '.lang-note', '.logistics-item', '.faq-item', '.card', '.pricing',
    '.included-item', '.guarantee-block', '.quick-facts', '.day-extra', '.countdown'
  ].join(', ');
  var skip = '.booking-form, .closed-note, .intro-description, .intro-eyebrow, .chip-row, .site-header, .site-footer';

  var targets = Array.prototype.filter.call(document.querySelectorAll(chunks), function (el) {
    if (el.closest(skip)) {
      return false;
    }
    var parent = el.parentElement && el.parentElement.closest(chunks);
    return !(parent && !parent.closest(skip));
  });
  if (!targets.length || !('IntersectionObserver' in window)) {
    return;
  }

  function settle(el) {
    el.classList.remove('stagger', 'is-in');
    el.style.transitionDelay = '';
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    var step = 0;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }
      var el = entry.target;
      var delay = Math.min(step, 5) * 100;
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('is-in');
      setTimeout(settle, delay + 750, el);
      obs.unobserve(el);
      step++;
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });

  targets.forEach(function (el) {
    el.classList.add('stagger');
    observer.observe(el);
  });
})();

document.addEventListener('DOMContentLoaded', function () {
  var hero = document.querySelector('.hero');
  var bootcamp = document.querySelector('.bootcamp');
  var mobileCta = document.getElementById('mobileCta');
  var mobileCtaLink = document.getElementById('mobileCtaLink');

  if (mobileCtaLink && bootcamp) {
    mobileCtaLink.setAttribute('href', '#' + bootcamp.id + '-form');
  }

  if ('IntersectionObserver' in window && hero && mobileCta) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        mobileCta.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });
    heroObserver.observe(hero);
  } else if (mobileCta && !hero) {
    mobileCta.classList.add('visible');
  }

  function selectPackage(value) {
    document.querySelectorAll('input[type="radio"][name="Pakket"]').forEach(function (radio) {
      if (radio.value === value) {
        radio.checked = true;
        var group = radio.closest('.form-group');
        if (group) {
          group.classList.remove('has-error');
        }
      }
    });
  }

  document.querySelectorAll('[data-pakket]').forEach(function (button) {
    button.addEventListener('click', function () {
      selectPackage(button.getAttribute('data-pakket'));
    });
  });

  document.querySelectorAll('[data-required-group] input[type="radio"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var group = radio.closest('.form-group');
      if (group) {
        group.classList.remove('has-error');
      }
    });
  });

  document.querySelectorAll('.booking-form[data-open-on-cta]').forEach(function (form) {
    var hash = '#' + form.id;
    function openForm() {
      form.classList.add('is-open');
    }
    if (window.location.hash === hash) {
      openForm();
      form.scrollIntoView();
    }
    document.addEventListener('click', function (event) {
      if (event.target.closest('a[href="' + hash + '"]')) {
        openForm();
      }
    });
    window.addEventListener('hashchange', function () {
      if (window.location.hash === hash) {
        openForm();
      }
    });
  });

  var whatsappPattern = /^(\+27|0)[6-8][0-9]{8}$/;

  var forms = document.querySelectorAll('.booking-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var isValid = true;
      var firstInvalidField = null;

      form.querySelectorAll('[data-required-group]').forEach(function (group) {
        if (group.querySelector('input:checked')) {
          group.classList.remove('has-error');
        } else {
          group.classList.add('has-error');
          isValid = false;
          if (!firstInvalidField) {
            firstInvalidField = group.querySelector('input');
          }
        }
      });

      var fields = form.querySelectorAll('[data-required]');

      fields.forEach(function (field) {
        var group = field.closest('.form-group');
        var value = field.value.trim();
        var fieldIsValid = value.length > 0;

        if (fieldIsValid && field.hasAttribute('data-whatsapp')) {
          fieldIsValid = whatsappPattern.test(value.replace(/[\s-]/g, ''));
        }

        if (fieldIsValid) {
          group.classList.remove('has-error');
        } else {
          group.classList.add('has-error');
          isValid = false;
          if (!firstInvalidField) {
            firstInvalidField = field;
          }
        }
      });

      if (!isValid) {
        event.preventDefault();
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      }
    });
  });
});

/* Countdown to the booking deadline. The static sentence in the HTML is the
   no-JS fallback and stays for screen readers; the ticking digits are
   visual only (aria-hidden) so nothing is announced every second. */
(function () {
  var timers = document.querySelectorAll('[data-countdown]');
  if (!timers.length) {
    return;
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function parts(ms) {
    var total = Math.max(0, Math.floor(ms / 1000));
    return {
      d: Math.floor(total / 86400),
      h: Math.floor((total % 86400) / 3600),
      m: Math.floor((total % 3600) / 60),
      s: total % 60
    };
  }

  function render(el, deadline) {
    var left = deadline - Date.now();
    var p = parts(left);
    var mode = el.getAttribute('data-countdown');

    if (left <= 0) {
      closeBookings();
      if (mode === 'full') {
        el.classList.add('is-closed');
        el.querySelector('.countdown-label').textContent = 'Inskrywings het gesluit';
        el.querySelector('.countdown-units').hidden = true;
        el.querySelector('.countdown-note').textContent = 'WhatsApp ons om te hoor of daar nog plek is.';
      } else {
        el.textContent = 'Inskrywings het gesluit. WhatsApp ons om te hoor of daar nog plek is.';
      }
      return false;
    }

    if (mode === 'full') {
      el.classList.toggle('no-days', p.d === 0);
      el.querySelector('[data-unit="d"]').textContent = p.d;
      el.querySelector('[data-label="d"]').textContent = p.d === 1 ? 'dag' : 'dae';
      el.querySelector('[data-unit="h"]').textContent = pad(p.h);
      el.querySelector('[data-unit="m"]').textContent = pad(p.m);
      el.querySelector('[data-unit="s"]').textContent = pad(p.s);
    } else {
      el.innerHTML = 'Sluit oor <strong class="countdown-inline">' +
        (p.d ? p.d + (p.d === 1 ? ' dag ' : ' dae ') : '') +
        pad(p.h) + ':' + pad(p.m) + ':' + pad(p.s) +
        '</strong>, vanaand om middernag.';
    }
    return true;
  }

  /* At the deadline: hide the countdown, the form and every booking
     button, and show the closed note with a WhatsApp link instead. */
  function closeBookings() {
    if (document.body.classList.contains('booking-closed')) {
      return;
    }
    document.body.classList.add('booking-closed');
    var note = document.querySelector('.closed-note');
    if (note) {
      note.hidden = false;
    }
  }

  timers.forEach(function (el) {
    var deadline = Date.parse(el.getAttribute('data-deadline'));
    if (isNaN(deadline)) {
      return;
    }
    var units = el.querySelector('.countdown-units');
    if (units) {
      units.hidden = false;
    }
    if (!render(el, deadline)) {
      return;
    }
    var id = setInterval(function () {
      if (!render(el, deadline)) {
        clearInterval(id);
      }
    }, 1000);
  });
})();
