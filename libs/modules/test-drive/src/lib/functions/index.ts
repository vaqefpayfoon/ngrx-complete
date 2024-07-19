export const flattenObject = (ob: object) => {
  const toReturn = {};

  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && i !== 'createdAt') {
      const flatObject = flattenObject(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else if (i === 'createdAt') {
      continue;
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};