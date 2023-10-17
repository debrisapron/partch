console.log(
  Bun.spawnSync(
    "imgcat /Users/ms/Downloads/a3339124296_10.jpg".split(" ")
  ).stdout.toString()
)
