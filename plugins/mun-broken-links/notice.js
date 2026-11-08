// Client script, shipped as source text: the function is serialised into the page's postscript, so it
// must stay self-contained (no imports, no outer variables). Styles: `.unresolved-notice` in
// quartz/styles/custom.scss.
function setupUnresolvedNotice(message) {
  // Registered once per page load: SPA navigation keeps the document, and the listeners with it.
  if (window.munUnresolvedNotice) return
  window.munUnresolvedNotice = true

  let box = null
  let timer = 0

  const close = () => {
    box.removeAttribute("data-open")
    // Empty the live region only after the fade, so no stale message is left for screen readers.
    timer = setTimeout(() => (box.textContent = ""), 250)
  }

  const open = (link) => {
    // Set the text only when it differs, so a second click does not re-announce the same message.
    if (box.textContent !== message) box.textContent = message
    // Bottom edge by default; top edge when the link sits in the bottom band, so it is never covered.
    const { bottom } = link.getBoundingClientRect()
    box.dataset.edge = bottom > window.innerHeight - box.offsetHeight - 32 ? "top" : "bottom"
    box.dataset.open = ""
    timer = setTimeout(close, 3000)
  }

  const show = (link) => {
    clearTimeout(timer)
    if (box) return open(link)
    box = document.createElement("div")
    box.className = "unresolved-notice"
    box.setAttribute("role", "status")
    box.setAttribute("aria-live", "polite")
    box.setAttribute("aria-atomic", "true")
    document.body.appendChild(box)
    // A live region is announced reliably only when it exists before its text changes.
    timer = setTimeout(() => open(link), 100)
  }

  const linkOf = (event) =>
    event.target instanceof Element ? event.target.closest("a[data-unresolved]") : null

  document.addEventListener("click", (event) => {
    const link = linkOf(event)
    if (!link) return
    event.preventDefault()
    show(link)
  })

  // Without an href the browser does not turn Enter into a click.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.isComposing) return
    const link = linkOf(event)
    if (!link) return
    event.preventDefault()
    show(link)
  })

  // Micromorph diffs the body by position: drop the notice (and its timer) around every navigation.
  const reset = () => {
    clearTimeout(timer)
    box?.remove()
    box = null
  }
  document.addEventListener("prenav", reset)
  document.addEventListener("nav", reset)
}

export const noticeScript = (message) => `(${setupUnresolvedNotice})(${JSON.stringify(message)})`
