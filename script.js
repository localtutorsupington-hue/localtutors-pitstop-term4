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

  var revealItems = document.querySelectorAll('.reveal-item');
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

  var flowSections = document.querySelectorAll('.flow-section');
  if (flowSections.length) {
    if ('IntersectionObserver' in window) {
      var flowObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      flowSections.forEach(function (el) { flowObserver.observe(el); });
    } else {
      flowSections.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  var pageSigns = document.querySelectorAll('.page-sign');
  if (pageSigns.length) {
    if ('IntersectionObserver' in window) {
      var signObserver = new IntersectionObserver(function (entries, obs) {
        var batch = 0;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = (batch * 110) + 'ms';
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
            batch++;
          }
        });
      }, { threshold: 0.5, rootMargin: '0px 0px -8% 0px' });
      pageSigns.forEach(function (el) { signObserver.observe(el); });
    } else {
      pageSigns.forEach(function (el) { el.classList.add('is-visible'); });
    }
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
