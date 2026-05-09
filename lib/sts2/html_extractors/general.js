// all in page
console.log(
  [...document.querySelectorAll("a.image > img")]
    .map((el) => el.src)
    .join("\n"),
)

// relics
console.log(
  [...document.querySelectorAll(".relic-image-wrap img")]
    .map((el) => el.src)
    .join("\n"),
)

// by certain substring in src attribute
console.log(
  [...document.querySelectorAll("a.image > img")]
    .filter((el) => el.src.includes("StS2_CardIcon_"))
    .map((el) => el.src)
    .join("\n"),
)
