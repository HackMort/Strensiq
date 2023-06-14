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
})
