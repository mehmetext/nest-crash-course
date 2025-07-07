export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
 * 2 sayı arasında rastgele istenilen adet sayı döndürür
 * Tekrar eden sayılar olmaz
 */
export const randomNumbers = (
  min: number,
  max: number,
  count: number,
): number[] => {
  if (count > max - min + 1) {
    count = max - min + 1;
  }

  const numbers: number[] = [];

  while (numbers.length < count) {
    const randomNum = randomNumber(min, max);

    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }

  return numbers;
};
