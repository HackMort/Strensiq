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
