const TEMPLATE_PREFFIX = 'jd-modal-template-'
const MODAL_PREFFIX = 'jd-modal-'
let openModalTriggers = []
const modals = /* @__PURE__ */ new Map()
function appendHtmlModalToDom (template) {
  const body = document.querySelector('body')
  const content = template.content.cloneNode(true)
  return body.appendChild(content)
}
function removeHtmlModalFromDom (modalId) {
  const node = document.querySelector('#' + modalId)
  if (node) {
    node.parentElement.removeChild(node)
  }
}
function createModal (modalId) {
  return new Fancybox([{ src: modalId }], {
    id: modalId,
    autoFocus: false,
    defaultType: 'inline',
    placeFocusBack: false,
    trapFocus: false,
    closeButton: false,
    height: 'auto',
    mainClass: 'fancybox__jd-modal-container',
    hideScrollbar: true,
    defaultDisplay: 'flex',
    on: {
      close: () => {
        setTimeout(() => {
          removeHtmlModalFromDom(modalId)
          removeModalInstanceFromGroup(modalId)
        }, 100)
      },
      destroy: () => {
        setTimeout(() => {
          removeHtmlModalFromDom(modalId)
          removeModalInstanceFromGroup(modalId)
        }, 100)
      }
    }
  })
}
function addModalInstanceToGroup (instance) {
  modals.set(instance.id, instance)
}
function removeModalInstanceFromGroup (modalId) {
  if (modals.has(modalId)) {
    modals.delete(modalId)
  }
}
function init (event) {
  const trigger = event.target

  const getModalId = (target, className) => {
    let modalId = target.dataset.jdModalTrigger

    if (modalId) {
      return modalId
    } else {
      const parent = target.parentElement

      if (target.classList.contains(className)) {
        return null
      }

      return getModalId(parent, className)
    }
  }

  let modalId = getModalId(trigger, 'event-card')
  const modalTemplateId = '#' + TEMPLATE_PREFFIX + modalId
  const modalTemplate = document.querySelector(modalTemplateId)
  if (modalTemplate) {
    appendHtmlModalToDom(modalTemplate)
  } else {
    throw new Error('Modal template not found')
  }
  modalId = MODAL_PREFFIX + modalId
  const modal = createModal(modalId)
  const closeButtons = Array.from(
    document
      .querySelector('#' + modalId)
      .querySelectorAll('[data-jd-modal-close]')
  )
  if (closeButtons) {
    closeButtons.forEach(closeButton => {
      closeButton.addEventListener('click', () => {
        modal.close()
      })
    })
  }
  addModalInstanceToGroup(modal)
}
function removeListeners () {
  if (openModalTriggers && openModalTriggers.length > 0) {
    openModalTriggers.forEach(trigger =>
      trigger.removeEventListener('click', init)
    )
  }
}
document.addEventListener('DOMContentLoaded', () => {
  removeListeners()
  openModalTriggers = Array.from(
    document.querySelectorAll('[data-jd-modal-trigger]')
  )
  openModalTriggers.forEach(trigger => {
    trigger.addEventListener('click', init)
  })
})
