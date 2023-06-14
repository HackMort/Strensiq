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
  const date = event.querySelector('.event__date').innerText.trim()
  const hour = event.querySelector('.event__hour').innerText.trim()
  const title = event.querySelector('.event__title').innerText.trim()
  const presenter = event.querySelector('.event__presenter').innerText.trim()
  const description = event
    .querySelector('.event__description')
    .innerText.trim()

  let type = event.querySelector('.event__type')
  if (type) {
    type = type.innerText.trim()
  }

  let location = event.querySelector('.event__location')
  if (location) {
    location = location.innerHTML.trim()
  }

  return {
    id: eventId,
    type: eventType,
    date,
    hour,
    typeString: type,
    location,
    title,
    description,
    presenter
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
 * This function filters form controls based on the event type and removes those that are not
 * applicable.
 * @param {string} eventType - a string representing the type of event for which the form needs to be prepared.
 * @param {HTMLFormElement} form - The `form` parameter is a reference to an HTML form element that will be modified
 * based on the `eventType` parameter.
 */
const prepareFormAccordingEventType = (eventType, form) => {
  const filterableControls = Array.from(
    form.querySelectorAll('.form__control[data-only-for-types]')
  )

  filterableControls.forEach(control => {
    const onlyForTypes = [].concat(control.dataset.onlyForTypes.split(','))

    const deleteControl = !onlyForTypes.includes(eventType)

    if (deleteControl) {
      control.parentElement.removeChild(control)
    }
  })
}

/**

Scrolls to the top of the view by creating an anchor element, adding it to the body, clicking it, and removing it from the body.
*/
const scrollToViewTop = () => {
  const a = document.createElement('a')
  const body = document.querySelector('body')

  a.href = '#upcoming-events'
  a.setAttribute('style', 'display: none;')

  body.appendChild(a)
  a.click()

  body.removeChild(a)
}

/**

Removes the event registration form from the DOM and returns its parent element.
@returns {HTMLElement} The parent element of the removed form.
*/
const destroyForm = () => {
  const form = document.querySelector('.events-form__container')
  const parent = form.parentElement
  parent.removeChild(form)
  return parent
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

  scrollToViewTop()
}

/**
 * Returns an array of HTML elements representing the form steps.
 * @returns An array of HTML elements representing the form steps.
 * @returns {HTMLElement[]}
 */
const getSteps = function () {
  const steps = Array.from(document.querySelectorAll('.form__steps .step'))
  return steps
}

/**

Marks a given step as visible by setting the data-visible attribute to 'true'
and adding the class step__visible, while removing the class step__hidden.
@param {HTMLElement} step - The step to mark as visible.
*/
const markStepAsVisible = function (step) {
  step.dataset.visible = 'true'
  step.classList.add('step__visible')
  step.classList.remove('step__hidden')
}

/**
  
  Marks a given step as hidden by setting the data-visible attribute to 'false'
  and adding the class step__hidden, while removing the class step__visible.
  @param {HTMLElement} step - The step to mark as hidden.
  */
const markStepAsHidden = function (step) {
  step.dataset.visible = 'false'
  step.classList.remove('step__visible')
  step.classList.add('step__hidden')
}

/**

Navigates to the first step of a two-step process by marking the first step as visible
and the second step as hidden.
*/
function goToFirstStep () {
  const [step1, step2] = getSteps()

  markStepAsVisible(step1)
  markStepAsHidden(step2)

  scrollToViewTop()
}

/**
  
  Navigates to the last step of a two-step process by marking the first step as hidden
  and the second step as visible.
  */
function goToLastStep () {
  const [step1, step2] = getSteps()

  markStepAsHidden(step1)
  markStepAsVisible(step2)

  scrollToViewTop()
}

/**

Checks the validity of the current step in a multi-step form and enables/disables the "Next" button accordingly.
@param {Event} event - The event object for the input event that triggered this function.
@returns {void}
*/
function checkStepValidity (event) {
  const step = getParent(event.target, 'step')

  // Get an array of all required controls in the current step.
  const stepRequiredControls = Array.from(
    step.querySelectorAll('.form__control[data-required="true"]')
  )

  // Check if any required control is invalid or not yet touched.
  const isInvalid = stepRequiredControls.some(
    control =>
      control.classList.contains('form__control--invalid') ||
      control.dataset.touched === 'false'
  )

  // Get the "Next" button for the current step.
  const nextButton = step.querySelector('.button--next')

  // If any required control is invalid or not yet touched, disable the "Next" button.
  if (isInvalid) {
    nextButton.setAttribute('disabled', 'true')
  } else {
    if (nextButton) {
      nextButton.removeAttribute('disabled')
    }
  }
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
  const swiper = new Swiper('.swiper', {
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
})
