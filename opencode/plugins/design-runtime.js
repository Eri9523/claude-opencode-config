/*
 * Design proposal runtime.
 *
 * Runs inside the iframe that renders an HTML/CSS proposal. Two modes:
 *
 *   apply - re-applies the saved overrides so previews and screenshots match
 *           what the user sees in the canvas.
 *   edit  - adds selection, dragging, inline text editing and keyboard nudging
 *           on top of that, reporting every change to the canvas through
 *           postMessage.
 *
 * Edits never rewrite the proposal markup: a move is a CSS translate, a style
 * change is an inline declaration, and every element remembers its pristine
 * state so a single override can be reverted without touching the design.
 */
;(function () {
  var config = window.__design || {}
  var mode = config.mode === "edit" ? "edit" : "apply"
  var overrides = new Map()
  var originals = new Map()
  var selected = null
  var editing = null
  var drag = null
  var overlay = null
  var hover = null
  var badge = null
  var guideLayer = null
  var snapThreshold = 6
  var maxSnapCandidates = 1200

  var allowedProperties = [
    "align-items",
    "aspect-ratio",
    "background",
    "background-color",
    "border-color",
    "border-radius",
    "border-style",
    "border-width",
    "box-shadow",
    "color",
    "column-gap",
    "display",
    "flex-direction",
    "flex-wrap",
    "font-family",
    "font-size",
    "font-style",
    "font-weight",
    "gap",
    "height",
    "justify-content",
    "letter-spacing",
    "line-height",
    "margin",
    "margin-bottom",
    "margin-left",
    "margin-right",
    "margin-top",
    "max-height",
    "max-width",
    "min-height",
    "min-width",
    "mix-blend-mode",
    "object-fit",
    "opacity",
    "order",
    "padding",
    "padding-bottom",
    "padding-left",
    "padding-right",
    "padding-top",
    "row-gap",
    "text-align",
    "text-decoration",
    "text-transform",
    "width",
    "z-index",
  ]

  var inspectedProperties = [
    "color",
    "background-color",
    "font-size",
    "font-weight",
    "letter-spacing",
    "line-height",
    "text-align",
    "padding",
    "margin",
    "gap",
    "border-radius",
    "max-width",
    "width",
    "opacity",
    "display",
  ]

  var voidTags = ["IMG", "SVG", "INPUT", "TEXTAREA", "SELECT", "BR", "HR", "VIDEO", "CANVAS", "IFRAME"]

  function isAllowed(property, value) {
    if (allowedProperties.indexOf(String(property)) === -1) return false
    var text = String(value)
    if (!text.trim() || text.length > 200) return false
    return !/url\(|expression\(|@import|javascript:|[<>{};]/i.test(text)
  }

  function editableChildren(element) {
    var result = []
    var children = element.children
    for (var index = 0; index < children.length; index += 1) {
      var child = children[index]
      if (child.hasAttribute("data-dc-clone") || child.hasAttribute("data-dc-ui")) continue
      result.push(child)
    }
    return result
  }

  function elementAtPath(path) {
    var parts = String(path || "").split(".")
    var current = document.body
    for (var index = 0; index < parts.length; index += 1) {
      if (!/^\d+$/.test(parts[index])) return null
      var list = editableChildren(current)
      var next = list[Number(parts[index])]
      if (!next) return null
      current = next
    }
    return current === document.body ? null : current
  }

  function pathOf(element) {
    var parts = []
    var current = element
    while (current && current !== document.body) {
      var parent = current.parentElement
      if (!parent) return null
      var index = editableChildren(parent).indexOf(current)
      if (index === -1) return null
      parts.unshift(String(index))
      current = parent
    }
    return parts.length ? parts.join(".") : null
  }

  function labelOf(element) {
    var tag = element.tagName.toLowerCase()
    if (element.id) return tag + "#" + element.id
    var className = typeof element.className === "string" ? element.className.trim() : ""
    if (!className) return tag
    return tag + "." + className.split(/\s+/).slice(0, 2).join(".")
  }

  function isTextLeaf(element) {
    if (voidTags.indexOf(element.tagName) !== -1) return false
    if (editableChildren(element).length) return false
    return element.textContent.trim().length > 0
  }

  function remember(element) {
    if (originals.has(element)) return originals.get(element)
    var original = {
      style: element.getAttribute("style"),
      text: isTextLeaf(element) ? element.textContent : undefined,
    }
    originals.set(element, original)
    return original
  }

  function restore(element, original) {
    if (original.style === null) element.removeAttribute("style")
    else element.setAttribute("style", original.style)
    if (original.text !== undefined && element.textContent !== original.text) element.textContent = original.text
  }

  function syncClones(element, entry) {
    var existing = document.querySelectorAll('[data-dc-clone="' + entry.path + '"]')
    for (var index = 0; index < existing.length; index += 1) existing[index].remove()
    var copies = Math.max(0, Math.min(6, Math.round(Number(entry.copies) || 0)))
    var anchor = element
    for (var copy = 0; copy < copies; copy += 1) {
      var clone = element.cloneNode(true)
      clone.setAttribute("data-dc-clone", entry.path)
      clone.removeAttribute("id")
      var identified = clone.querySelectorAll("[id]")
      for (var cleared = 0; cleared < identified.length; cleared += 1) identified[cleared].removeAttribute("id")
      anchor.after(clone)
      anchor = clone
    }
  }

  function applyOverride(entry) {
    var element = elementAtPath(entry.path)
    if (!element) return null
    var original = remember(element)
    restore(element, original)
    if (entry.style) {
      Object.keys(entry.style).forEach(function (property) {
        var value = entry.style[property]
        if (isAllowed(property, value)) element.style.setProperty(property, value)
      })
    }
    var move = entry.move
    if (move && (Number(move.x) || Number(move.y))) {
      element.style.translate = Math.round(Number(move.x) || 0) + "px " + Math.round(Number(move.y) || 0) + "px"
    }
    if (typeof entry.text === "string" && original.text !== undefined) element.textContent = entry.text
    if (entry.hidden) element.style.setProperty("display", "none")
    syncClones(element, entry)
    return element
  }

  function applyAll(list) {
    originals.forEach(function (original, element) {
      restore(element, original)
    })
    var clones = document.querySelectorAll("[data-dc-clone]")
    for (var index = 0; index < clones.length; index += 1) clones[index].remove()
    overrides.clear()
    ;(Array.isArray(list) ? list : []).forEach(function (entry) {
      if (!entry || typeof entry.path !== "string") return
      overrides.set(entry.path, entry)
      applyOverride(entry)
    })
    if (selected) refreshOverlay()
  }

  function overrideFor(path) {
    var entry = overrides.get(path)
    if (!entry) {
      entry = { path: path }
      overrides.set(path, entry)
    }
    return entry
  }

  function post(message) {
    if (mode !== "edit") return
    message.source = "design-canvas"
    parent.postMessage(message, "*")
  }

  function snapshot(element) {
    var computed = getComputedStyle(element)
    var props = {}
    inspectedProperties.forEach(function (property) {
      var value = computed.getPropertyValue(property).trim()
      if (!value && property === "padding") {
        value = [computed.paddingTop, computed.paddingRight, computed.paddingBottom, computed.paddingLeft].join(" ")
      }
      if (!value && property === "margin") {
        value = [computed.marginTop, computed.marginRight, computed.marginBottom, computed.marginLeft].join(" ")
      }
      props[property] = value
    })
    return props
  }

  function ensureOverlay() {
    if (overlay) return
    var style = document.createElement("style")
    style.setAttribute("data-dc-ui", "")
    style.textContent =
      "[data-dc-ui]{box-sizing:border-box;pointer-events:none}" +
      "body{user-select:none !important;-webkit-user-select:none !important}" +
      "[data-dc-editing],[data-dc-editing] *{user-select:text !important;-webkit-user-select:text !important}" +
      ".dc-outline{position:fixed;z-index:2147483000;border:1.5px solid #4d6aee;box-shadow:0 0 0 3px rgba(77,106,238,.18);border-radius:2px;display:none}" +
      ".dc-hover{position:fixed;z-index:2147482000;border:1px dashed rgba(77,106,238,.7);border-radius:2px;display:none}" +
      ".dc-badge{position:fixed;z-index:2147483001;padding:2px 6px;border-radius:4px;background:#4d6aee;color:#fff;font:600 10px/1.4 ui-monospace,monospace;white-space:nowrap;display:none}" +
      "[data-dc-editing]{outline:2px solid #4d6aee;outline-offset:2px;cursor:text}" +
      ".dc-guides{position:fixed;z-index:2147483002;inset:0}" +
      ".dc-guide{position:absolute;background:#ff2d78}" +
      ".dc-guide.v{top:0;width:1px;height:100%}" +
      ".dc-guide.h{left:0;height:1px;width:100%}" +
      ".dc-guide span{position:absolute;padding:1px 4px;border-radius:3px;background:#ff2d78;color:#fff;font:600 9px/1.3 ui-monospace,monospace;white-space:nowrap}" +
      ".dc-guide.v span{top:8px;left:4px}" +
      ".dc-guide.h span{top:4px;left:8px}"
    document.head.appendChild(style)
    overlay = document.createElement("div")
    overlay.className = "dc-outline"
    overlay.setAttribute("data-dc-ui", "")
    hover = document.createElement("div")
    hover.className = "dc-hover"
    hover.setAttribute("data-dc-ui", "")
    badge = document.createElement("div")
    badge.className = "dc-badge"
    badge.setAttribute("data-dc-ui", "")
    guideLayer = document.createElement("div")
    guideLayer.className = "dc-guides"
    guideLayer.setAttribute("data-dc-ui", "")
    document.body.appendChild(guideLayer)
    document.body.appendChild(hover)
    document.body.appendChild(overlay)
    document.body.appendChild(badge)
  }

  function placeBox(box, element) {
    if (!element) {
      box.style.display = "none"
      return
    }
    var rect = element.getBoundingClientRect()
    box.style.display = "block"
    box.style.left = rect.left + "px"
    box.style.top = rect.top + "px"
    box.style.width = rect.width + "px"
    box.style.height = rect.height + "px"
  }

  function refreshOverlay() {
    if (mode !== "edit") return
    ensureOverlay()
    var element = selected ? elementAtPath(selected) : null
    placeBox(overlay, element)
    if (!element) {
      badge.style.display = "none"
      return
    }
    var rect = element.getBoundingClientRect()
    badge.textContent = labelOf(element)
    badge.style.display = "block"
    badge.style.left = Math.max(2, rect.left) + "px"
    badge.style.top = Math.max(2, rect.top - 17) + "px"
  }

  // Alignment guides, collected once per drag: nothing reflows while dragging
  // because a move is a translate, so every candidate rect stays valid.
  function addSnapLine(lines, value, label) {
    if (!Number.isFinite(value)) return
    var key = Math.round(value * 2) / 2
    var existing = lines.get(key)
    if (existing && existing.label.length <= label.length) return
    lines.set(key, { value: key, label: label })
  }

  function collectSnapTargets(element) {
    var vertical = new Map()
    var horizontal = new Map()
    var viewportWidth = document.documentElement.clientWidth
    var viewportHeight = document.documentElement.clientHeight
    addSnapLine(vertical, 0, "borde")
    addSnapLine(vertical, viewportWidth / 2, "centro")
    addSnapLine(vertical, viewportWidth, "borde")
    addSnapLine(horizontal, 0, "borde")
    addSnapLine(horizontal, viewportHeight / 2, "centro")
    var candidates = document.body.querySelectorAll("*")
    var limit = Math.min(candidates.length, maxSnapCandidates)
    for (var index = 0; index < limit; index += 1) {
      var candidate = candidates[index]
      if (candidate === element || element.contains(candidate)) continue
      if (candidate.hasAttribute("data-dc-ui") || candidate.closest("[data-dc-ui]")) continue
      var rect = candidate.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) continue
      addSnapLine(vertical, rect.left, "izquierda")
      addSnapLine(vertical, rect.left + rect.width / 2, "centro")
      addSnapLine(vertical, rect.right, "derecha")
      addSnapLine(horizontal, rect.top, "arriba")
      addSnapLine(horizontal, rect.top + rect.height / 2, "medio")
      addSnapLine(horizontal, rect.bottom, "abajo")
    }
    return { vertical: Array.from(vertical.values()), horizontal: Array.from(horizontal.values()) }
  }

  function bestSnap(lines, edges) {
    var best = null
    for (var lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      var line = lines[lineIndex]
      for (var edgeIndex = 0; edgeIndex < edges.length; edgeIndex += 1) {
        var distance = Math.abs(line.value - edges[edgeIndex])
        if (distance > snapThreshold) continue
        if (best && best.distance <= distance) continue
        best = { distance: distance, offset: line.value - edges[edgeIndex], line: line.value, label: line.label }
      }
    }
    return best
  }

  function renderGuides(matches) {
    if (!guideLayer) return
    guideLayer.textContent = ""
    for (var index = 0; index < matches.length; index += 1) {
      var match = matches[index]
      if (!match) continue
      var guide = document.createElement("div")
      guide.className = "dc-guide " + match.axis
      if (match.axis === "v") guide.style.left = match.line + "px"
      else guide.style.top = match.line + "px"
      var label = document.createElement("span")
      label.textContent = match.label
      guide.appendChild(label)
      guideLayer.appendChild(guide)
    }
  }

  function clearGuides() {
    if (guideLayer) guideLayer.textContent = ""
  }

  function resolveTarget(node) {
    var element = node instanceof Element ? node : node && node.parentElement
    if (!element) return null
    if (element.closest("[data-dc-ui]")) return null
    var clone = element.closest("[data-dc-clone]")
    if (clone) {
      var source = elementAtPath(clone.getAttribute("data-dc-clone"))
      return source ? { element: source, path: clone.getAttribute("data-dc-clone") } : null
    }
    var path = pathOf(element)
    return path ? { element: element, path: path } : null
  }

  function select(path) {
    var element = elementAtPath(path)
    if (!element) return
    selected = path
    refreshOverlay()
    var entry = overrides.get(path) || { path: path }
    post({
      type: "select",
      path: path,
      label: labelOf(element),
      tag: element.tagName.toLowerCase(),
      textEditable: isTextLeaf(element),
      text: isTextLeaf(element) ? element.textContent : "",
      props: snapshot(element),
      override: entry,
    })
  }

  function deselect() {
    selected = null
    clearGuides()
    refreshOverlay()
    post({ type: "deselect" })
  }

  function commitChange(path) {
    var entry = overrides.get(path)
    if (!entry) return
    var element = elementAtPath(path)
    var clean = { path: path }
    if (element) clean.label = labelOf(element)
    if (entry.style && Object.keys(entry.style).length) clean.style = entry.style
    if (entry.move && (entry.move.x || entry.move.y)) clean.move = entry.move
    if (typeof entry.text === "string") clean.text = entry.text
    if (entry.hidden) clean.hidden = true
    if (entry.copies) clean.copies = entry.copies
    overrides.set(path, clean)
    post({ type: "change", override: clean })
  }

  function startTextEdit(target, event) {
    if (!isTextLeaf(target.element)) {
      post({ type: "hint", message: "Ese elemento contiene otros elementos: selecciona el texto interior para editarlo." })
      return
    }
    remember(target.element)
    editing = { path: target.path, element: target.element, before: target.element.textContent }
    target.element.setAttribute("contenteditable", "true")
    target.element.setAttribute("data-dc-editing", "")
    target.element.focus()
    var range = null
    if (event && document.caretRangeFromPoint) range = document.caretRangeFromPoint(event.clientX, event.clientY)
    var selection = window.getSelection()
    selection.removeAllRanges()
    if (range) {
      selection.addRange(range)
    } else {
      var full = document.createRange()
      full.selectNodeContents(target.element)
      selection.addRange(full)
    }
  }

  // Dropping contenteditable blurs the element, which re-enters this function
  // through the focusout handler, so the session is claimed before anything else.
  function commitTextEdit() {
    if (!editing) return
    var session = editing
    editing = null
    var element = session.element
    var text = element.textContent
    element.removeAttribute("contenteditable")
    element.removeAttribute("data-dc-editing")
    if (text === session.before) return
    var entry = overrideFor(session.path)
    entry.text = text
    applyOverride(entry)
    commitChange(session.path)
    refreshOverlay()
  }

  function nudge(deltaX, deltaY) {
    if (!selected) return
    var element = elementAtPath(selected)
    if (!element) return
    remember(element)
    var entry = overrideFor(selected)
    var move = entry.move || { x: 0, y: 0 }
    entry.move = { x: Math.round((Number(move.x) || 0) + deltaX), y: Math.round((Number(move.y) || 0) + deltaY) }
    element.style.translate = entry.move.x + "px " + entry.move.y + "px"
    refreshOverlay()
    commitChange(selected)
  }

  function toggleHidden() {
    if (!selected) return
    var element = elementAtPath(selected)
    if (!element) return
    remember(element)
    var entry = overrideFor(selected)
    entry.hidden = !entry.hidden
    applyOverride(entry)
    refreshOverlay()
    commitChange(selected)
  }

  function onPointerDown(event) {
    if (event.button !== 0) return
    var target = resolveTarget(event.target)
    if (editing) {
      if (target && target.element === editing.element) return
      commitTextEdit()
    }
    if (!target) {
      deselect()
      return
    }
    if (target.path !== selected) select(target.path)
    var entry = overrides.get(target.path)
    var move = (entry && entry.move) || { x: 0, y: 0 }
    var rect = target.element.getBoundingClientRect()
    drag = {
      path: target.path,
      element: target.element,
      startX: event.clientX,
      startY: event.clientY,
      baseX: Number(move.x) || 0,
      baseY: Number(move.y) || 0,
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      targets: collectSnapTargets(target.element),
      moved: false,
    }
  }

  function onPointerMove(event) {
    if (drag && event.buttons === 0) {
      onPointerUp()
      return
    }
    if (!drag) {
      if (editing) return
      var hovered = resolveTarget(event.target)
      placeBox(hover, hovered && hovered.path !== selected ? hovered.element : null)
      return
    }
    var deltaX = event.clientX - drag.startX
    var deltaY = event.clientY - drag.startY
    if (!drag.moved && Math.abs(deltaX) < 3 && Math.abs(deltaY) < 3) return
    drag.moved = true
    if (event.shiftKey) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) deltaY = 0
      else deltaX = 0
    }
    var matches = []
    if (!event.altKey) {
      var left = drag.rect.left + deltaX
      var top = drag.rect.top + deltaY
      var vertical = bestSnap(drag.targets.vertical, [left, left + drag.rect.width / 2, left + drag.rect.width])
      var horizontal = bestSnap(drag.targets.horizontal, [top, top + drag.rect.height / 2, top + drag.rect.height])
      if (vertical) { deltaX += vertical.offset; matches.push({ axis: "v", line: vertical.line, label: vertical.label }) }
      if (horizontal) { deltaY += horizontal.offset; matches.push({ axis: "h", line: horizontal.line, label: horizontal.label }) }
    }
    renderGuides(matches)
    remember(drag.element)
    var entry = overrideFor(drag.path)
    entry.move = { x: Math.round(drag.baseX + deltaX), y: Math.round(drag.baseY + deltaY) }
    drag.element.style.translate = entry.move.x + "px " + entry.move.y + "px"
    hover.style.display = "none"
    refreshOverlay()
    post({ type: "moving", path: drag.path, move: entry.move, snapped: matches.map(function (match) { return match.axis + ":" + match.label }) })
  }

  function onPointerUp() {
    if (!drag) return
    var moved = drag.moved
    var path = drag.path
    drag = null
    clearGuides()
    if (moved) commitChange(path)
  }

  function onDoubleClick(event) {
    var target = resolveTarget(event.target)
    if (!target) return
    if (editing && editing.element === target.element) return
    event.preventDefault()
    commitTextEdit()
    drag = null
    select(target.path)
    startTextEdit(target, event)
  }

  function onKeyDown(event) {
    if (editing) {
      if (event.key === "Escape" || (event.key === "Enter" && !event.shiftKey)) {
        event.preventDefault()
        commitTextEdit()
      }
      return
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
      event.preventDefault()
      post({ type: event.shiftKey ? "redo" : "undo" })
      return
    }
    if (!selected) return
    var step = event.shiftKey ? 10 : 1
    if (event.key === "ArrowLeft") { event.preventDefault(); nudge(-step, 0) }
    else if (event.key === "ArrowRight") { event.preventDefault(); nudge(step, 0) }
    else if (event.key === "ArrowUp") { event.preventDefault(); nudge(0, -step) }
    else if (event.key === "ArrowDown") { event.preventDefault(); nudge(0, step) }
    else if (event.key === "Escape") { event.preventDefault(); deselect() }
    else if (event.key === "Backspace" || event.key === "Delete") { event.preventDefault(); toggleHidden() }
  }

  function onMessage(event) {
    var data = event.data
    if (!data || data.source !== "design-editor") return
    if (data.type === "apply-all") {
      applyAll(data.overrides)
      if (selected && !elementAtPath(selected)) deselect()
      return
    }
    if (data.type === "patch") {
      var element = elementAtPath(data.path)
      if (!element) return
      remember(element)
      var entry = overrideFor(data.path)
      if (data.style) {
        entry.style = Object.assign({}, entry.style)
        Object.keys(data.style).forEach(function (property) {
          var value = data.style[property]
          if (value === null || value === "") delete entry.style[property]
          else if (isAllowed(property, value)) entry.style[property] = value
        })
      }
      if (typeof data.text === "string") entry.text = data.text
      if (typeof data.hidden === "boolean") entry.hidden = data.hidden
      if (typeof data.copies === "number") entry.copies = Math.max(0, Math.min(6, Math.round(data.copies)))
      if (data.move) entry.move = { x: Math.round(Number(data.move.x) || 0), y: Math.round(Number(data.move.y) || 0) }
      applyOverride(entry)
      refreshOverlay()
      commitChange(data.path)
      if (selected === data.path) select(data.path)
      return
    }
    if (data.type === "reset") {
      if (data.path) {
        var resetElement = elementAtPath(data.path)
        var original = resetElement ? originals.get(resetElement) : null
        overrides.delete(data.path)
        if (resetElement) {
          if (original) restore(resetElement, original)
          syncClones(resetElement, { path: data.path, copies: 0 })
        }
        refreshOverlay()
        post({ type: "reset", path: data.path })
        if (selected === data.path) select(data.path)
      } else {
        applyAll([])
        post({ type: "reset" })
        if (selected) select(selected)
      }
      return
    }
    if (data.type === "deselect") {
      deselect()
      return
    }
    if (data.type === "select") {
      select(data.path)
      var target = elementAtPath(data.path)
      if (target) target.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }

  function start() {
    applyAll(config.overrides)
    if (mode !== "edit") return
    ensureOverlay()
    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("pointermove", onPointerMove, true)
    document.addEventListener("pointerup", onPointerUp, true)
    document.addEventListener("pointercancel", onPointerUp, true)
    document.addEventListener("dblclick", onDoubleClick, true)
    document.addEventListener("keydown", onKeyDown, true)
    document.addEventListener(
      "click",
      function (event) {
        if (editing) return
        if (event.target instanceof Element && event.target.closest("a,button,label,summary,input,select")) event.preventDefault()
      },
      true,
    )
    document.addEventListener("submit", function (event) { event.preventDefault() }, true)
    document.addEventListener("dragstart", function (event) { if (!editing) event.preventDefault() }, true)
    document.addEventListener("focusout", function () { if (editing) commitTextEdit() }, true)
    window.addEventListener("scroll", refreshOverlay, true)
    window.addEventListener("resize", refreshOverlay)
    window.addEventListener("message", onMessage)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshOverlay)
    post({ type: "ready" })
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start)
  else start()
})()
