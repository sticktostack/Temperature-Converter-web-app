const input1 = document.getElementById("input1")
const input2 = document.getElementById("input2")
const unit1 = document.getElementById("unit1")
const unit2 = document.getElementById("unit2")
const container = document.querySelector(".container")

let isUpdating = false
function convertTemperature(value, from, to) {
  let celsius
  if (from === "C") celsius = value
  else if (from === "F") celsius = (value - 32) * 5 / 9
  else if (from === "K") celsius = value - 273.15

  if (to === "C") return celsius
  if (to === "F") return (celsius * 9 / 5) + 32
  if (to === "K") return celsius + 273.15
}

// no.  animation 
function animateValue(element, start, end, duration = 200) {
  const startTime = performance.now()

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    const value = start + (end - start) * progress
    element.value = value.toFixed(2)

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

// color logic/
function updateTemperatureColor(celsius) {
  const min = -30
  const max = 50

  const clamped = Math.min(Math.max(celsius, min), max)
  const ratio = (clamped - min) / (max - min)

  const hue = 220 - (220 * ratio) 
  const saturation = 80
  const lightness = 85

  container.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`

  container.style.boxShadow = `
    0 25px 50px hsla(${hue}, 80%, 50%, 0.25),
    inset 0 1px 1px rgba(255,255,255,0.6)
  `
}

input1.addEventListener("input", () => {
  if (isUpdating) return

  const value = parseFloat(input1.value)
  if (isNaN(value)) {
    input2.value = ""
    return
  }

  isUpdating = true

  const result = convertTemperature(value, unit1.value, unit2.value)
  animateValue(input2, parseFloat(input2.value) || 0, result)
  let celsiusForColor
  if (unit1.value === "C") celsiusForColor = value
  else if (unit1.value === "F") celsiusForColor = (value - 32) * 5 / 9
  else if (unit1.value === "K") celsiusForColor = value - 273.15

  updateTemperatureColor(celsiusForColor)

  setTimeout(() => isUpdating = false, 200)
})

input2.addEventListener("input", () => {
  if (isUpdating) return

  const value = parseFloat(input2.value)
  if (isNaN(value)) {
    input1.value = ""
    return
  }

  isUpdating = true

  const result = convertTemperature(value, unit2.value, unit1.value)
  animateValue(input1, parseFloat(input1.value) || 0, result)
  let celsiusForColor
  if (unit2.value === "C") celsiusForColor = value
  else if (unit2.value === "F") celsiusForColor = (value - 32) * 5 / 9
  else if (unit2.value === "K") celsiusForColor = value - 273.15

  updateTemperatureColor(celsiusForColor)

  setTimeout(() => isUpdating = false, 200)
})

unit1.addEventListener("change", () => input1.dispatchEvent(new Event("input")))
unit2.addEventListener("change", () => input2.dispatchEvent(new Event("input")))