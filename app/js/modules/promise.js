Promise.allObject = object => {
  let promisedProperties = [];
  const objectKeys = Object.keys(object);

  objectKeys.forEach((key) => promisedProperties.push(object[key]));

  return Promise.all(promisedProperties)
                .then((resolvedValues) => {
                  return resolvedValues.reduce((resolvedObject, property, index) => {
                    resolvedObject[objectKeys[index]] = property;
                    return resolvedObject;
                  }, object);
                });
};

export default Promise;