export const removeStartingZero = async(value) => {
  return await value.replace(/^0+/, '') || '0';
}
