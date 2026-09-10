// Sequential option labels: A, B, … Z, AA, AB, …
export function choiceLabel(index: number): string {
  let n = index + 1
  let out = ''
  while (n > 0) {
    const rem = (n - 1) % 26
    out = String.fromCharCode(65 + rem) + out
    n = Math.floor((n - 1) / 26)
  }
  return out || 'A'
}

export function findChoiceByLabel<T extends { label: string }>(
  choices: T[],
  letter: string,
): T | null {
  const wanted = letter.trim().toUpperCase()
  if (!wanted) return null
  return choices.find((c) => c.label.toUpperCase() === wanted) ?? null
}
