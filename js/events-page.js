const getParent = function (child, className) {
  const parent = child.parentElement
  const isControlParent = parent.classList.contains(className)

  if (parent === null || isControlParent) {
    return parent
  } else {
    return getParent(parent, className)
  }
}

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

  // Event card

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

  const eventExpandButtons = window.Array.from(
    document.querySelectorAll(
      '.event-card.event-card--expandable .event-card__expand-button'
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
