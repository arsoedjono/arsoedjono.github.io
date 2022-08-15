const menu = document.querySelector(".menu")

menu.addEventListener("click", (element) => {
  const targetMenu = element.target
  const currentActive = document.querySelector("a.active")

  currentActive.classList.remove("active")
  targetMenu.classList.add("active")
})
