'use strict';

const userID = 'user_wqwZFZas1YVQuAcYMFSuD';

let popupSource;

////////////////////////////////////////////////////////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// YANDEX МЕТРИКА

function sendGoal({isFromPopup = false, goalName = undefined}) {
  if (isFromPopup) {
    switch(popupSource) {
      case 'header':
        ym(84850789,'reachGoal','header');
        break;
      case 'laws':
        ym(84850789,'reachGoal','laws');
        break;
      case 'possibilities':
        ym(84850789,'reachGoal','possibilities');
        break;
      case 'steps':
        ym(84850789,'reachGoal','steps');
        break;
    }
    return;
  }

  console.log(goalName);
  switch(goalName) {
    case 'hero':
      ym(84850789,'reachGoal','hero');
      break;
    case 'consult-small':
      ym(84850789,'reachGoal','consult-small');
      break;
    case 'quiz':
      ym(84850789,'reachGoal','quiz');
      break;
    case 'ending':
      ym(84850789,'reachGoal','ending');
      break;
  }
}

////////////////////////////////////////////////////////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// SEQUENCE

function observerCallback() {
  animate();
  observer.disconnect();
}

function animate() {
  let allSequencePeriod = document.querySelectorAll('.sequence__period');
  let allPeriodCaption = document.querySelectorAll('.period__caption');
  allPeriodCaption.forEach(el => {
    el.addEventListener('transitionend', (ev) => {
      ev.stopPropagation();
    })
  });

  function showItem(i) {
    allSequencePeriod[i].classList.add('sequence__period--is-shown')
    if (allPeriodCaption[i]) {
      allPeriodCaption[i].classList.add('period__caption--is-shown');
    }
  }

  showItem(0);
  allSequencePeriod[0].addEventListener('transitionend', () => {showItem(1)});
  allSequencePeriod[1].addEventListener('transitionend', () => {showItem(2)});
  allSequencePeriod[2].addEventListener('transitionend', () => {showItem(3)});
}

let observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) observerCallback();
  });
}, {});

observer.observe(document.querySelector('.sequence__wrapper-inner'));

////////////////////////////////////////////////////////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// MENU

function clickHandlerActionOpenMenu () {
  if (menu.classList.contains('menu--opened')) {
    menu.classList.remove('menu--opened')
  } else {
    menu.classList.add('menu--opened')
    let consultPopup = document.querySelector('.consult-popup');
    consultPopup.style.opacity = 0;
    consultPopup.style.pointerEvents = 'none';
  }
}

let actionOpenMenu = document.querySelector('.action-open-menu');
let menu = document.querySelector('.menu');

actionOpenMenu.addEventListener('click', clickHandlerActionOpenMenu);

////////////////////////////////////////////////////////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// POPUP

function clickHandlerOpenConsultPopup(ev) {
  let target = ev.target;
  let consultPopup = document.querySelector('.consult-popup');
  consultPopup.style.opacity = 1;
  consultPopup.style.pointerEvents = 'all';
  menu.classList.remove('menu--opened');
  popupSource = target.getAttribute('data-source');
}

function clickHandlerCloseConsultPopup() {
  let consultPopup = document.querySelector('.consult-popup');
  consultPopup.style.opacity = 0;
  consultPopup.style.pointerEvents = 'none';
}

let allActionOpenConsultPopup = document.querySelectorAll('.action-open-consult-popup');
let actionOpenConsultPopup = document.querySelector('.action-close-consult-popup');

allActionOpenConsultPopup.forEach(el => {
  el.addEventListener('click', clickHandlerOpenConsultPopup);
});

actionOpenConsultPopup.addEventListener('click', clickHandlerCloseConsultPopup);

////////////////////////////////////////////////////////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// EMAILJS - POPUP

function clickHandlerConsultPopupSend() {
  let name = document.getElementById('consult-popup-name').value;
  let phone = document.getElementById('consult-popup-phone').value;

  if (name === "" || phone.length < 7) {
    consultPopupMessage.style.display = 'initial';
    consultPopupMessage.textContent = 'Пожалуйста, заполните все поля!';
    return
  }

  actionConsultPopupSend.classList.add('button--deactivated');
  consultPopupMessage.style.display = 'initial';
  consultPopupMessage.textContent = 'Отправка…';

  let templateParams = {
    fromName: name,
    fromPhone: phone,
  }

  emailjs.send('service_yandex', 'template_consult', templateParams, userID)
    .then(function(response) {
      actionConsultPopupSend.style.display = 'none';
      consultPopupMessage.innerHTML = 'Спасибо за Вашу заявку! <br>Мы свяжемся с вами в ближайшее время';
      allConsultPopupLabel.forEach(el => {
        el.style.display = 'none';
      });
      allConsultPopupInputText.forEach(el => {
        el.style.display = 'none';
      });
      console.log('EmailJS — письмо отправлено', response.status, response.text);
      sendGoal({isFromPopup: true});
    }, function(error) {
      actionConsultPopupSend.classList.remove('button--deactivated');
      consultPopupMessage.textContent = 'Ошибка отправки, пожалуйста, попробуйте ещё раз';
      console.log('Ошибка EmailJS!', error);
    });
}

let actionConsultPopupSend = document.querySelector('.action-consult-popup-send');
let allConsultPopupLabel = document.querySelectorAll('.consult-popup__label');
let allConsultPopupInputText = document.querySelectorAll('.consult-popup__input-text');
let consultPopupMessage = document.querySelector('.consult-popup__message');

actionConsultPopupSend.addEventListener('click', clickHandlerConsultPopupSend)

////////////////////////////////////////////////////////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// EMAILJS - БЛОК "БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ" + СВЯЗКА ВСЕХ INPUTов

let consultSource = '';

function inputHandlerConsultName(event) {
  let target = event.target;
  allConsultName.forEach(el => {
    el.value = target.value;
  });
}

function inputHandlerConsultPhone(event) {
  let target = event.target;
  allConsultPhone.forEach(el => {
    setTimeout(() => {el.value = target.value;}, 1)
  });
}

function clickHandlerConsultButton(ev) {
  let target = ev.target;
  let name = allConsultName[0].value;
  let phone = allConsultPhone[0].value;

  consultSource = target.getAttribute('data-source');

  if (name === "" || phone.length < 7) {
    allConsultH1.forEach(el => {
      el.textContent = 'Пожалуйста, заполните все поля!';
    });
    return
  }

  allActionConsultSend.forEach(el => {
    el.classList.add('button--deactivated');
  });
  allConsultH1.forEach(el => {
    el.textContent = 'Отправка…';
  });

  let templateParams = {
    fromName: name,
    fromPhone: phone,
  }

  emailjs.send('service_yandex', 'template_consult', templateParams, userID)
    .then(function(response) {
      allActionConsultSend.forEach(el => {
        el.classList.remove('button--deactivated');
      });
      allConsultH1.forEach(el => {
        el.innerHTML = 'Спасибо за Вашу заявку! <br>Мы свяжемся с вами в ближайшее время';
      });
      allConsultForm.forEach(el => {
        el.style.display = 'none';
      });
      console.log('EmailJS — письмо отправлено', response.status, response.text);
      sendGoal({goalName: consultSource});
    }, function(error) {
      allActionConsultSend.forEach(el => {
        el.classList.remove('button--deactivated');
      });
      allConsultH1.forEach(el => {
        el.textContent = 'Ошибка отправки, пожалуйста, попробуйте ещё раз';
      });
      console.log('Ошибка EmailJS!', error);
    });
}

let allActionConsultSend = document.querySelectorAll('.action-consult-send');
let allConsultName  = document.querySelectorAll('[name="consult-name"]');
let allConsultPhone = document.querySelectorAll('[name="consult-phone"]');
let allConsultH1 = document.querySelectorAll('.consult__h1');
let allConsultForm = document.querySelectorAll('.consult__form');

allConsultName.forEach(el => {
  el.addEventListener('input', inputHandlerConsultName);
});

allConsultPhone.forEach(el => {
  el.addEventListener('input', inputHandlerConsultPhone);
});

allActionConsultSend.forEach(el => {
  el.addEventListener('click', clickHandlerConsultButton);
});

////////////////////////////////////////////////////////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// EMAILJS - БЛОК CONSULT SMALL

function clickHandlerConsultSmallSend() {
  let consultSmallH1 = document.querySelector('.consult-small__h1');
  let consultSmallP = document.querySelector('.consult-small__p');
  if (consultSmallInputText.value.length < 7 ) {
    consultSmallH1.textContent = "Пожалуйста, заполните поле для контактных данных"
    return
  }

  consultSmallH1.textContent = "Отправка…"
  consultSmallP.textContent = "Пожалуйста, не закрывайте страницу"
  consultSmallButton.classList.add('button--deactivated');

  document.querySelector('.consult-small__wrapper').style.gap = '9rem';

  let templateParams = {
    fromName: 'Имя не указано',
    fromPhone: consultSmallInputText.value
  }

  emailjs.send('service_yandex', 'template_consult', templateParams, userID)
    .then(function(response) {
      consultSmallInputText.style.display = 'none';
      consultSmallButton.style.display = 'none';
      consultSmallH1.textContent = 'Спасибо за Вашу заявку!'
      consultSmallP.textContent = 'Мы свяжемся с вами в ближайшее время'
      console.log('EmailJS — письмо отправлено', response.status, response.text);
      consultSmallP.style.color = '#000000';
      document.querySelector('.consult-small__wrapper').style.gap = '2rem';
      document.querySelector('.consult-small__decoration').style.display = 'none';
      document.querySelector('.consult-small__form').style.display = 'none';
      document.querySelector('.consult-small__label').style.display = 'none';
      sendGoal({goalName: 'consult-small'});
    }, function(error) {
      consultSmallButton.classList.remove('button--deactivated');
      consultSmallH1.textContent = 'Ошибка отправки'
      consultSmallP.textContent = 'Пожалуйста, попробуйте ещё раз'
      console.log('Ошибка EmailJS!', error);
    });
}

let actionConsultSmallSend = document.querySelector('.action-consult-small-send');
let consultSmallInputText = document.querySelector('.consult-small__input-text');
let consultSmallButton = document.querySelector('.consult-small__button');

consultSmallButton.addEventListener('click', clickHandlerConsultSmallSend)

////////////////////////////////////////////////////////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// ОПРОС + EMAILJS

const headers = ['Общая сумма всех кредитов, долгов?',
                 'Официальный ежемесячный доход?',
                 'Подавали ли на Вас кредиторы в суд?',
                 'Есть ли у Вас залоговые кредиты?',
                 'Какое имущество, кроме единственного места жительства, на Вас зарегистрировано?',
                 'Спасибо за заполнение формы!',
                 'Спасибо за Вашу заявку!'];

function displayQuestion(q) {
  let current = state.currentQuestion - 1 >= 0 ? state.currentQuestion - 1 : 0;
  allQuestionsQuestion[current].style.display = 'none';
  allQuestionsQuestion[q - 1].style.display = 'initial';

  state.currentQuestion = q;
  
  if (q <= 5) {
    let ans = allQuestionsQuestion[q - 1].children[0].elements['question' + state.currentQuestion].value

    if (ans !== '') {
      actionQuizNext.classList.remove('button--deactivated');
    } else {
      actionQuizNext.classList.add('button--deactivated');
    }
  }

  quizH1.textContent = headers[q - 1];

  switch (q) {
    case 1:
      actionQuizPrev.classList.add('button--deactivated');
      break;
    case 6:
      actionQuizNext.style.display = 'none';
      actionQuizSend.style.display = 'initial';
      break;
    case 7:
      actionQuizPrev.style.display = 'none';
      actionQuizSend.style.display = 'none';
      quizP.style.display = 'initial';
      quizP.textContent = 'Мы свяжемся с вами в ближайшее время';
    default:
      actionQuizPrev.style.display = 'initial'; 
      actionQuizPrev.classList.remove('button--deactivated');
      actionQuizNext.style.display = 'initial';
      actionQuizSend.style.display = 'none';
      break;
  }
}

function clickHandlerQuestionInputRadio(event) {
  actionQuizNext.classList.remove('button--deactivated');
  state.answers[state.currentQuestion - 1] = event.target.defaultValue;
}

function clickHandlerActionQuizStart() {
  quizH1.style.maxWidth = '39ch';
  quizP.style.display = 'none';
  actionQuizStart.style.display = 'none';
  actionQuizPrev.style.display = 'initial';
  actionQuizPrev.classList.add('button--deactivated');
  actionQuizNext.style.display = 'initial';
  document.querySelector('.quiz__wrapper').style.minHeight = '42.9rem';
  displayQuestion(1);
}

function clickHandlerActionQuizPrev() {
  displayQuestion(state.currentQuestion - 1);
}

function clickHandlerActionQuizNext() {
  displayQuestion(state.currentQuestion + 1);
}

function clickHandlerActionQuizSend() {
  function getAnswer(question) {
    return document.querySelector(`[for="question-${question}-${state.answers[question - 1]}"]`).innerText;
  }

  let name = document.getElementById('quiz-name').value
  let phone = document.getElementById('quiz-phone').value
  if (name === "" || phone.length < 7) {
    quizH1.textContent = 'Пожалуйста, заполните все поля!'
    return
  }

  quizH1.textContent = 'Отправка…'
  actionQuizPrev.classList.add('button--deactivated');
  actionQuizSend.classList.add('button--deactivated');
  
  let templateParams = {
    fromName: name,
    fromPhone: phone,
    answer1: getAnswer(1),
    answer2: getAnswer(2),
    answer3: getAnswer(3),
    answer4: getAnswer(4),
    answer5: getAnswer(5),
  }

  emailjs.send('service_yandex', 'template_quiz', templateParams, userID)
    .then(function(response) {
      displayQuestion(7);
      document.querySelector('.quiz__wrapper').style.minHeight = 'unset';
      document.querySelector('.quiz__container').style.display = 'none';
      console.log('EmailJS — письмо отправлено', response.status, response.text);
      sendGoal({goalName: 'quiz'});
    }, function(error) {
      actionQuizPrev.classList.remove('button--deactivated');
      actionQuizSend.classList.remove('button--deactivated');
      quizH1.textContent = 'Ошибка отправки, пожалуйста попробуйте ещё раз'
      console.log('Ошибка EmailJS!', error);
    });
}

let state = {currentQuestion: 0,
             answers: [null, null, null, null, null]}

let allQuestionsQuestion = document.querySelectorAll('.questions__question');
let allQuestionInputRadio = document.querySelectorAll('.question__input-radio');
let quizH1 = document.querySelector('.quiz__h1');
let quizP = document.querySelector('.quiz__p');
let actionQuizStart = document.querySelector('.action-quiz-start');
let actionQuizPrev = document.querySelector('.action-quiz-prev');
let actionQuizNext = document.querySelector('.action-quiz-next');
let actionQuizSend = document.querySelector('.action-quiz-send');

allQuestionInputRadio.forEach(el => {
  el.addEventListener('click', clickHandlerQuestionInputRadio);
});

actionQuizStart.addEventListener('click', clickHandlerActionQuizStart);
actionQuizPrev.addEventListener('click', clickHandlerActionQuizPrev);
actionQuizNext.addEventListener('click', clickHandlerActionQuizNext);
actionQuizSend.addEventListener('click', clickHandlerActionQuizSend);

clickHandlerActionQuizStart() // ТЕСТ! (Пропуск первого экрана опроса для увеличения конверсии)

////////////////////////////////////////////////////////////////
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// MASKING

let maskPhoneOptions = {
  mask: '+{7} (000) 000-00-00'
};

var maskPhone;
allConsultPhone.forEach(el => {
  maskPhone = IMask(el, maskPhoneOptions);
});
