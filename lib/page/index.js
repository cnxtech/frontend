export function getElement(tagName) {
  if (!document) {
    return
  }
  return document.getElementsByTagName(tagName)[0]
}

export function showFooter() {
  const el = getElement('footer')
  if (el && el.style) {
    el.style.display = 'block'
  }
}

export function hideFooter() {
  const el = getElement('footer')
  if (el && el.style) {
    el.style.display = 'none'
  }
}

export function showHeader() {
  const el = getElement('header')
  if (el && el.style) {
    el.style.display = 'flex'
  }
}

export function hideHeader() {
  const el = getElement('header')
  if (el && el.style) {
    el.style.display = 'none'
  }
}
