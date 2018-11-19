const generateColors = n => {
  const totalColors = Math.pow(256, 3)
  const step = Math.floor(totalColors / n)

  const range = Array.from({ length: n }, (v, k) => k + 1)

  return range
    .map(i => i * step)
    .map(packedColor => {
      const unpacked = []

      for (let i = 0; i < 3; i++) {
        unpacked.push(Math.floor(packedColor / Math.pow(256, 2 - i)))
        packedColor %= Math.pow(256, 2 - i)
      }

      return unpacked
    })
}
export default generateColors
