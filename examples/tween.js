const setTweenInterval = (cb, intervalMsec, range) => {
  let t = 0

  return setInterval(() => {
    // Returns a value in the range -1 to 1
    const value = Math.cos(++t / 8 / Math.PI)

    // Normalize to the range 0 to 1
    const normalized = (value + 1) / 2

    const tweened = range
      ? range.min + normalized * (range.max - range.min)
      : normalized

    cb(tweened)
  }, intervalMsec)
}
export default setTweenInterval
