export function traverseAndRemove(obj) {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') traverseAndRemove(obj[key]);
    //recursive for objects
    else if (obj[key] == null || obj[key] === '') delete obj[key]; //remove empty properties
    if (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)
      delete obj[key]; //remove empty objects
  });
}
