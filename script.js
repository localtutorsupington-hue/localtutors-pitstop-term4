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

  var revealItems = document.querySelectorAll('.included-item');
  if (revealItems.length) {
    revealItems.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 50, 250) + 'ms';
    });
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealItems.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  var whatsappPattern = /^(\+27|0)[6-8][0-9]{8}$/;

  var forms = document.querySelectorAll('.booking-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var isValid = true;
      var firstInvalidField = null;
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
