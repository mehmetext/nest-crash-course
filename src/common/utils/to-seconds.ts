export const toSeconds = (ts: string) => {
  const raw = ts.split(` `);
  // Gün, saat, dakika, saniye formatını destekle
  const dhms = `0d 0h 0m 0s`
    .split(` `)
    .map((v) => raw.find((t) => t.slice(-1) === v.slice(-1)) || v);

  return (
    dhms
      .join(``)
      .match(/\d+/g)
      ?.reduce((acc, cur, idx) => {
        // Gün için 86400 (24*60*60), saat için 3600 (60*60), dakika için 60, saniye için 1
        const multipliers = [86400, 3600, 60, 1];
        return acc + Number(cur) * multipliers[idx];
      }, 0) ?? 0
  );
};
