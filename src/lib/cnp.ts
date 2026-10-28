/** A Romanian personal numeric code: 13 digits, a valid date, and the official control digit. */
export function isValidCnp(cnp: string): boolean {
  if (!/^[1-9]\d{12}$/.test(cnp)) return false;
  const month = Number(cnp.slice(3, 5));
  const day = Number(cnp.slice(5, 7));
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const weights = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  const sum = weights.reduce((s, w, i) => s + w * Number(cnp[i]), 0);
  const control = sum % 11 === 10 ? 1 : sum % 11;
  return control === Number(cnp[12]);
}
