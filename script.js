const elements = {
  drawButton: document.getElementById("draw-button"),
  toggleButton: document.getElementById("toggle-button"),
  lowerNumberInput: document.getElementById("lower-number"),
  upperNumberInput: document.getElementById("upper-number"),
  numberToDrawInput: document.getElementById("number-to-draw"),
  numberInputs: document.querySelectorAll("input[type='number']"),
  replayButton: document.getElementById("button-again"),
  resultOrderSpan: document.querySelector("#results p span"),
  resultsContainer: document.getElementById("results-numbers"),
  howToUse: document.querySelector(".how-to-use"),
  buttonContainer: document.querySelector(".button-container"),
  drawer: document.querySelector(".drawer"),
  resultsSection: document.getElementById("results"),
}

let drawCount = 1
elements.resultOrderSpan.textContent = drawCount

function moveHowToUse() {
  const shouldMove = window.innerWidth <= 425
  const originalParent = elements.howToUse.parentElement

  if (
    shouldMove &&
    elements.howToUse.parentElement !==
      elements.buttonContainer.nextElementSibling
  ) {
    elements.buttonContainer.insertAdjacentElement(
      "afterend",
      elements.howToUse
    )
  } else if (
    !shouldMove &&
    elements.howToUse.parentElement !== originalParent
  ) {
    originalParent.appendChild(elements.howToUse)
  }
}

window.addEventListener("DOMContentLoaded", () => {
  moveHowToUse()
  window.addEventListener("resize", moveHowToUse)
})

elements.toggleButton.addEventListener("click", () => {
  elements.toggleButton.classList.toggle("active")
})

function isNotRepeatNumber() {
  return elements.toggleButton.classList.contains("active")
}

document.querySelectorAll(".input-border input").forEach((input) => {
  const originalPlaceholder = input.placeholder

  input.addEventListener("focus", () => (input.placeholder = ""))
  input.addEventListener("blur", () => {
    if (!input.value) input.placeholder = originalPlaceholder
  })
})

elements.numberInputs.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (["e", "E", ",", "."].includes(event.key)) event.preventDefault()
  })
})

function generateNumbers(count, lower, upper, isUnique) {
  const results = []

  if (isUnique && count > upper - lower + 1) {
    alert("Não é possível gerar números únicos com essa quantidade.")
    return results
  }

  while (results.length < count) {
    const randomNum = Math.floor(Math.random() * (upper - lower + 1)) + lower
    if (isUnique && results.includes(randomNum)) continue
    results.push(randomNum)
  }

  return results
}

function displayResults(results) {
  const delay = 2000
  elements.resultsContainer.innerHTML = ""
  elements.replayButton.style.display = "none"

  results.forEach((result, index) => {
    setTimeout(() => {
      const numberParagraph = document.createElement("span")
      numberParagraph.classList.add("number")
      numberParagraph.textContent = result

      const resultItem = document.createElement("div")
      resultItem.classList.add("number-container")
      resultItem.appendChild(numberParagraph)

      elements.resultsContainer.appendChild(resultItem)
      setTimeout(() => (numberParagraph.style.opacity = 1), 0)
    }, index * delay)
  })

  setTimeout(
    () => (elements.replayButton.style.display = "flex"),
    results.length * delay
  )
}

function getInputValue(input) {
  return parseInt(input.value || input.placeholder)
}

function handleDraw() {
  const numberToDraw = getInputValue(elements.numberToDrawInput)
  const lowerNumber = getInputValue(elements.lowerNumberInput)
  const upperNumber = getInputValue(elements.upperNumberInput)

  if (
    numberToDraw <= 0 ||
    lowerNumber < 0 ||
    upperNumber <= 0 ||
    lowerNumber >= upperNumber
  ) {
    alert("Por favor, insira valores válidos.")
    return
  }

  const results = generateNumbers(
    numberToDraw,
    lowerNumber,
    upperNumber,
    isNotRepeatNumber()
  )
  if (results.length) displayResults(results)

  elements.drawer.classList.add("hidden")
  elements.resultsSection.classList.remove("hidden")
}

function handleReplay() {
  handleDraw()
  drawCount += 1
  elements.resultOrderSpan.textContent = drawCount
}

elements.drawButton.addEventListener("click", (event) => {
  event.preventDefault()
  handleDraw()
})

elements.replayButton.addEventListener("click", (event) => {
  event.preventDefault()
  handleReplay()
})