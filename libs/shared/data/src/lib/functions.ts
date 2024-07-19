export function traverseAndRemove(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      traverseAndRemove(obj[key]);
    }
    //recursive for objects
    else if (obj[key] == null || obj[key] === '') delete obj[key]; //remove empty properties
    if (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0) {
      delete obj[key]; //remove empty objects
    }
  });
}

export const removeEmptyOrNull = (obj) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === 'object' && removeEmptyOrNull(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );

  return obj;
};

export function isDataURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}

/**
 * @description
 * @author {{Mohammad Jalili}}
 * @export
 * @param {*} object
 * @param {FormData} [form]
 * @param {string} [namespace]
 * @returns {FormData}
 */
export function createFormData(
  object: any,
  form?: FormData,
  namespace?: string
): FormData {
  const formData = form || new FormData();
  for (const property in object) {
    if (
      object.hasOwnProperty(property) &&
      typeof object[property] !== 'undefined'
    ) {
      const formKey = namespace ? `${namespace}[${property}]` : property;

      if (object[property] instanceof Date) {
        formData.append(formKey, object[property].toISOString());
      } else if (
        typeof object[property] === 'object' &&
        !(object[property] instanceof File)
      ) {
        createFormData(object[property], formData, formKey);
      } else if (
        typeof object[property] === 'object' &&
        object[property] instanceof File
      ) {
        formData.append(formKey, object[property]);
      } else {
        formData.append(formKey, object[property]);
      }
    }
  }
  return formData;
}

export function generateArrayOfYears(): number[] {
  const max: number = new Date().getFullYear();
  const min: number = max - 50;
  const years: number[] = [];

  for (let i = max; i >= min; i--) {
    years.push(i);
  }
  return years;
}
