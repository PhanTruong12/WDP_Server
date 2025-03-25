export const getRegexEmail = () => {
  const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
  return regex
}

export const getRegexPassword = () => {
  const regex = /^[A-Z][a-zA-Z0-9]{7,}$/
  return regex
}

export const getRegexObjectID = () => {
  const regex = /^[0-9a-fA-F]{24}$/
  return regex
}

export function getRegexPhoneNumber() {
  const re = /^(\+84|84|0)+(9|3|7|8|5)+([0-9]{8})\b/
  return re
}

export const formatMoney = (money: number) =>
  (Math.round(money * 100) / 100).toLocaleString().replaceAll(",", ".")
