console.log(
  [...document.querySelectorAll("a.image > img")]
    .map((el) => el.src)
    .join("\n"),
)
