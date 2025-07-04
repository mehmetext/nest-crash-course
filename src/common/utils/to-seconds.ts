export const toSeconds = (ts: string) => {
  const raw = ts.split(` `);
  const hms = `0h 0m 0s`
    .split(` `)
    .map((v) => raw.find((t) => t.slice(-1) === v.slice(-1)) || v);

  return (
    hms
      .join(``)
      .match(/\d+/g)
      ?.reduce((acc, cur, idx) => {
        return acc + Number(cur) * Math.pow(60, 2 - idx);
      }, 0) ?? 0
  );
};
