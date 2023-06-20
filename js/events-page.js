/**

Represents a list of events with filtering functionality.
/
class EventList {
/*
Creates an instance of the EventList class.
@param {NodeList} eventList - The list of events to filter.
*/
class EventList {
  constructor (eventList) {
    this.eventList = eventList
  }

  hideBorderBottom (event) {
    event.setAttribute(
      'style',
      'border-bottom: none; margin-bottom: 0; padding-bottom: 0'
    )
  }

  resetBorderBottom (event) {
    event.removeAttribute('style')
  }

  /**
   * It loops through all the events and if the event type is not the same as the
   * type passed in, it adds the class event--hidden and removes the class
   * event--showed. If the event type is the same as the type passed in, it removes
   * the class event--hidden and adds the class event--showed
   * @param type - the type of event you want to filter
   */
  filter (type) {
    this.eventList.forEach(event => {
      const { eventType } = event.dataset
      if (eventType !== type) {
        event.classList.add('event-card--hidden')
        event.classList.remove('event-card--showed')
      } else {
        event.classList.remove('event-card--hidden')
        event.classList.add('event-card--showed')
      }
    })

    const showedList = Array.from(this.eventList).filter(event => {
      return event.classList.contains('event-card--showed')
    })

    if (showedList && showedList.length > 0) {
      const lastShowedEvent = showedList[showedList.length - 1]

      showedList.forEach(event => {
        this.resetBorderBottom(event)
      })

      if (lastShowedEvent) {
        this.hideBorderBottom(lastShowedEvent)
      }
    }
  }

  /**
   * It removes the class `event--hidden` from each event in the event list
   */
  clearFilter () {
    this.eventList.forEach(event => {
      event.classList.remove('event-card--hidden')
      this.resetBorderBottom(event)
    })
  }
}

/**

Enum for filter types.
@readonly
@enum {string}
@property {string} ALL - Show all events.
@property {string} VIRTUAL - Show virtual events only.
@property {string} IN_PERSON - Show in-person events only.
*/
const filterTypes = {
  ALL: 'all',
  VIRTUAL: 'virtual',
  IN_PERSON: 'in-person'
}

const getParent = function (child, className) {
  const parent = child.parentElement
  const isControlParent = parent.classList.contains(className)

  if (parent === null || isControlParent) {
    return parent
  } else {
    return getParent(parent, className)
  }
}

/**
 * It returns an object with the event's data
 * @param {HTMLElement} event - The event object that was passed to the handler.
 * @returns An object with the event's id, type, date, hour, typeString, title,
 * description, and presenter.
 * @returns {
 *  id: string,
 *  type: string,
 *  date: string,
 *  hour: string,
 *  typeString: string,
 *  title: string,
 *  description: string,
 *  presenter: string
 * }
 */
const eventToJSON = function (event) {
  const { eventId, eventType } = event.dataset
  const extractDate = () => {
    return (
      event
        .querySelector('.event-card__date .event-card__month')
        .innerText.trim() +
      ' ' +
      event.querySelector('.event-card__date .event-card__day').innerText.trim()
    )
  }
  const date = extractDate()
  const hour = event.querySelector('.event-card__hour').innerText.trim()
  const title = event.querySelector('.event-card__title').innerText.trim()
  const speaker = event.querySelector('.event-card__speaker').innerText.trim()
  let description = event.querySelector('.event-card__description')

  if (description) {
    description = description.innerText.trim()
  }

  let address = event.querySelector('.event-card__address')
  if (address) {
    address = address.innerHTML.trim()
  }

  return {
    id: eventId,
    type: eventType,
    date,
    hour,
    address,
    title,
    description,
    speaker
  }
}

/**
 * Updates event form container with data from an event object
 * @param {{id: string, type: string, date: string, hour: string, typeString: string, location: string, title: string, description: string, presenter: string}} eventData
 * @param {HTMLDivElement} form
 */
const addEventDataToForm = (eventData, form) => {
  const eventTitleEl = form.querySelector('.events-form__title')
  const eventDateEl = form.querySelector('.events-form__date')
  const eventHourEl = form.querySelector('.events-form__hour')
  const eventLocationEl = form.querySelector('.events-form__location')
  const eventIdInputEl = form.querySelector('.input-hidden')

  eventTitleEl.innerText = eventData.title
  eventDateEl.innerText = eventData.date
  eventHourEl.innerText = eventData.hour
  eventIdInputEl.value = eventData.id

  if (eventData.location) {
    eventLocationEl.innerHTML = eventData.location
    eventLocationEl.removeAttribute('style')
  }
}

/**
 * The function prepares a form based on the type of event data provided, and modifies the form header
 * and content accordingly.
 * @param eventData - An object containing information about an event, including its type, title, date,
 * hour, and address.
 * @param formContainer - The container element that holds the form for the event.
 */
const prepareFormAccordingEventType = (eventData, formContainer) => {
  const type = eventData.type
  const formHeader = formContainer.querySelector('.form__header')

  const titleElement = formHeader.querySelector('.event-info__title')
  if (eventData.title && titleElement) {
    titleElement.innerText = eventData.title
  }

  const dateElement = formHeader.querySelector('.event-info__date .date')
  if (eventData.date && dateElement) {
    dateElement.innerText = eventData.date
  }

  const hourElement = formHeader.querySelector('.event-info__date .hour')
  if (eventData.hour && hourElement) {
    hourElement.innerText = eventData.hour
  }

  const cityAddressElement = formHeader.querySelector(
    '.event-info__date .address .city'
  )
  if (eventData.address && hourElement) {
    cityAddressElement.innerText = eventData.address
  }

  if (type && type === filterTypes.VIRTUAL) {
    const form = formContainer.querySelector('form')
    const optionalSlide = form.querySelector('.slide--optional')
    const requiredSlide = form.querySelector('.slide--required')
    const controlContainer = requiredSlide.querySelector('.step__form-controls')
    const termsAndConditionsControl = optionalSlide.querySelector(
      '#terms-and-conditions-control'
    )

    const addressElement = formHeader.querySelector(
      '.event-info__date .address'
    )

    if (addressElement) {
      addressElement.innerHTML = '<strong>Virtual</strong>'
      addressElement.setAttribute(
        'style',
        'text-decoration: underline; color: #000000;'
      )
    }

    console.log(controlContainer, termsAndConditionsControl)

    if (requiredSlide) {
      if (controlContainer && termsAndConditionsControl) {
        controlContainer.appendChild(termsAndConditionsControl)
      }

      const actionsContainer = requiredSlide.querySelector(
        '.step__form-actions'
      )

      if (actionsContainer) {
        const nextButton = actionsContainer.querySelector('button')
        if (nextButton) {
          actionsContainer.removeChild(nextButton)
        }

        const submit = document.createElement('input')
        submit.type = 'submit'
        submit.value = 'Register'
        submit.classList.add('button--primary')
        // submit.onclick = event => validateFormOnSubmit(event)

        actionsContainer.appendChild(submit)
      }
    }

    if (optionalSlide) {
      optionalSlide.parentElement.removeChild(optionalSlide)
    }
  }
}

/**

Scrolls to the top of the view by creating an anchor element, adding it to the body, clicking it, and removing it from the body.
*/
const scrollToHref = href => {
  const a = document.createElement('a')
  const body = document.querySelector('body')

  a.href = '#' + href
  a.setAttribute('style', 'display: none;')

  body.appendChild(a)
  a.click()

  body.removeChild(a)
}

/**

Displays a confirmation view with event and registration data.
@param {HTMLDivElement} container - The container where the confirmation view will be appended.
@param {{id: string, type: string, date: string, hour: string, typeString: string, location: string, title: string, description: string, presenter: string}} eventData - The data of the selected event.
@param {{firstName: string, email: string}} formData - The registration data entered by the user.
@returns {void}
*/
const showConfirmationView = (container, eventData, formData) => {
  const confirmationView = document
    .querySelector('#confirmation-view-template')
    .content.cloneNode(true)

  const firstNameEl = confirmationView.querySelector('.confirmation__firstname')
  const eventTypeEl = confirmationView.querySelector('.event__type')
  const eventTitleEl = confirmationView.querySelector(
    '.confirmation__event-title'
  )
  const eventDateEl = confirmationView.querySelector('.event__date')
  const eventHourEl = confirmationView.querySelector('.event__hour')
  const eventLocationEl = confirmationView.querySelector(
    '.confirmation__location'
  )
  const confirmationEmailEl = confirmationView.querySelector(
    '.confirmation__email'
  )

  firstNameEl.innerText = formData.firstName
  eventTypeEl.innerText = eventData.type
  eventTitleEl.innerText = eventData.title
  eventDateEl.innerText = eventData.date
  eventHourEl.innerText = eventData.hour
  confirmationEmailEl.innerText = formData.email

  if (eventData.location) {
    // eventLocationEl.innerHTML = eventData.location
  }

  container.appendChild(confirmationView)

  scrollToHref()
}
/**
 * The function checks if any required control in a given step is invalid or not yet touched.
 * @param step - The "step" parameter is a DOM element representing a step in a multi-step form. The
 * function checks if all the required form controls in the step have been filled out and are valid.
 * @returns a boolean value indicating whether any required control in the current step is invalid or
 * not yet touched. If there is at least one invalid or untouched control, the function returns `true`,
 * otherwise it returns `false`.
 */

function checkStepValidity (step) {
  // Get an array of all required controls in the current step.
  const stepRequiredControls = Array.from(
    step.querySelectorAll('.form__control[data-required="true"]')
  )

  // Check if any required control is invalid or not yet touched.
  const invalid = stepRequiredControls.some(
    control =>
      control.classList.contains('form__control--invalid') ||
      control.dataset.touched === 'false'
  )

  return invalid
}

function markUntouchedStepControlsAsInvalid (step) {
  const stepRequiredControls = Array.from(
    step.querySelectorAll(
      '.form__control[data-required="true"][data-touched="false"]'
    )
  )

  stepRequiredControls.forEach(control => {
    control.dataset.touched = 'true'
    control.classList.add('form__control--invalid')
  })
}

const toggleCards = (currentCard, cards) => {
  if (currentCard && cards) {
    cards.forEach(card => {
      if (card === currentCard) {
        card.classList.toggle('expanded')
      } else {
        card.classList.remove('expanded')
      }
    })
  }
}

const removeExpandedClassInDesktop = () => {
  const isMobile = window.matchMedia('(max-width: 1023px)')

  if (!isMobile.matches) {
    const cards = document.querySelectorAll(
      '.event-card.event-card--expandable'
    )
    cards.forEach(card => {
      card.classList.remove('expanded')
    })
  }
}

const switchSwiperVisibility = () => {
  const isMobile = window.matchMedia('(max-width: 1023px)')
  const swipers = document.querySelectorAll(
    '.event-card.event-card--expandable .event-card__expandable-panel .swiper'
  )

  const desktopContent = document.querySelectorAll(
    '.event-card.event-card--expandable .event-card__expandable-panel .expandable-panel-content'
  )

  swipers.forEach(swiper => {
    if (isMobile.matches) {
      swiper.removeAttribute('style')
    } else {
      swiper.setAttribute('style', 'display: none;')
    }
  })

  desktopContent.forEach(content => {
    if (isMobile.matches) {
      content.setAttribute('style', 'display: none;')
    } else {
      content.removeAttribute('style')
    }
  })
}

window.addEventListener('resize', () => {
  switchSwiperVisibility()
  removeExpandedClassInDesktop()
})

document.addEventListener('DOMContentLoaded', () => {
  new Swiper('.swiper', {
    // Optional parameters
    loop: false,
    autoHeight: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination'
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    centeredSlides: true,
    direction: 'horizontal'
  })

  switchSwiperVisibility()

  // Event card

  const eventExpandButtons = window.Array.from(
    document.querySelectorAll(
      '.event-card.event-card--expandable .event-card__actions .event-card__expand-button'
    )
  )
  eventExpandButtons.forEach(expandButton => {
    expandButton.addEventListener('click', () => {
      const eventCards = eventExpandButtons.map(button =>
        getParent(button, 'event-card')
      )
      const eventCard = getParent(expandButton, 'event-card')

      toggleCards(eventCard, eventCards)
    })
  })

  // Events filter
  const filterButtons = document.querySelectorAll('.event-list__filter')
  const eventsListContainer = document.querySelector('.events')
  const activeFilterClass = 'active'
  /* Adding an event listener to each button in the filterButtons array. */
  filterButtons.forEach(function (button) {
    if (button) {
      button.addEventListener('click', function () {
        const { filter } = button.dataset
        const elements = eventsListContainer.querySelectorAll('.event-card')
        const eventList = new EventList(elements)

        /* Checking if the filter is set to all, if it is, it clears the filter, if it is
                not, it filters the list. */
        if (filter === filterTypes.ALL) {
          eventList.clearFilter()
        } else {
          eventList.filter(filter)
        }

        /* Removing the active class from all the buttons and then adding it to the button
                that was clicked. */
        filterButtons.forEach(button => {
          button.classList.remove(activeFilterClass)
        })
        button.classList.add(activeFilterClass)
      })
    }
  })
  // Events filter

  // ================================== Event form ========================================
  let formSwiper = null
  let formModalObserver = null
  let eventData = null

  /**
   * The function gets event data from an HTML element.
   */
  const getEventData = element => {
    let event

    if (element.classList.contains('event-card')) {
      event = element
    } else {
      event = getParent(element, 'event-card')
    }

    eventData = eventToJSON(event)
  }

  const eventRegisterButtons = document.querySelectorAll(
    '.event-card .event-card__register-button'
  )

  const nextEventCard = document.querySelector('#next-event-card')
  nextEventCard.addEventListener('click', () => {
    getEventData(nextEventCard)
  })

  eventRegisterButtons.forEach(button => {
    button.addEventListener('click', () => {
      getEventData(button)
    })
  })

  /**
   * The function initializes a Swiper instance for a form and adds event listeners for navigation and
   * form submission.
   */
  const initFormSwiper = () => {
    formSwiper = new Swiper('.form-swiper', {
      loop: false,
      centeredSlides: true,
      direction: 'horizontal'
    })

    const form = document.querySelector('form')
    const formContainer = document.querySelector('#event-form-container')

    prepareFormAccordingEventType(eventData, formContainer)

    if (eventData.type !== filterTypes.VIRTUAL) {
      const nextButton = form.querySelector('.button--next')
      const backButton = form.querySelector('.button--back')
      nextButton.addEventListener('click', () => {
        const step = getParent(nextButton, 'step')
        const invalid = checkStepValidity(step)
        if (!invalid) {
          formSwiper.slideNext(200, true)
        } else {
          markUntouchedStepControlsAsInvalid(step)
        }
      })

      backButton.addEventListener('click', () => {
        formSwiper.slidePrev(200, true)
      })
    }

    const submit = form.querySelector('[type="submit"]')

    if (submit) {
      submit.addEventListener('click', event => {
        event.preventDefault()
        const valid = validateFormOnSubmit(event)

        if (valid) {
          const form = event.target.form
          const data = new FormData(form)
          showConfirmationView({
            ...eventData,
            firstName: data.get('first-name'),
            email: data.get('email')
          })
        }
      })
    }
  }

  /**
   * The function shows a confirmation view with data provided and hides the event form container.
   */
  const showConfirmationView = data => {
    console.log(data)
    const template = document.querySelector('#confirmation-view-template')
    const formContainer = document.querySelector('#event-form-container')
    const view = template.content.cloneNode(true)

    const mainContainer = template.parentElement

    const firstNameElement = view.querySelector('.first-name')
    const eventTitleElement = view.querySelector('.event-title')
    const eventDateElement = view.querySelector('.date')
    const eventHourElement = view.querySelector('.hour')
    const eventAddressElement = view.querySelector('.address')
    const emailElement = view.querySelector('.email')

    if (firstNameElement) {
      firstNameElement.innerText = data.firstName
    }

    if (eventTitleElement) {
      eventTitleElement.innerText = data.title
    }

    if (eventDateElement) {
      eventDateElement.innerText = data.date
    }

    if (eventHourElement) {
      eventHourElement.innerText = data.hour
    }

    if (eventAddressElement) {
      eventAddressElement.innerText = data.address
    }

    if (emailElement) {
      emailElement.innerText = data.email
    }

    if (formContainer) {
      formContainer.setAttribute('style', 'display: none;')
    }

    if (mainContainer && view) {
      mainContainer.appendChild(view)

      const closeButton = mainContainer.querySelector(
        '.confirmation-view button[data-jd-modal-close]'
      )
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          Fancybox.close()
        })
      }
    }
  }

  /**
   * This function initializes a MutationObserver that listens for changes to the body element and
   * triggers the initialization or destruction of a form swiper based on the presence or absence of
   * certain nodes.
   */
  const initFormModalObserver = () => {
    const observedElement = document.querySelector('body')
    const observerConfig = { childList: true, subtree: true }
    formModalObserver = new MutationObserver(mutations => {
      const addedNodes = Array.from(mutations[0].addedNodes)
      const removedNodes = Array.from(mutations[0].removedNodes)

      const init = addedNodes.some(node => {
        return (
          node &&
          typeof node === 'object' &&
          node.classList &&
          node.classList.contains('fancybox__viewport')
        )
      })

      const destroy = removedNodes.some(node => {
        return (
          node &&
          typeof node === 'object' &&
          node.classList &&
          node.classList.contains('event-form-modal')
        )
      })

      if (init && !formSwiper) {
        // showConfirmationView()
        initFormSwiper()
      }

      if (destroy && formSwiper) {
        formSwiper.destroy(true, false)
        formSwiper = null
      }
    })

    formModalObserver.observe(observedElement, observerConfig)
  }

  if (!formModalObserver) {
    initFormModalObserver()
  }
  // ================================== Event form ========================================
})
