exports.validateServiceName = (serviceName) => {
  let isValid = true;
  if (!serviceName) isValid = false;
  if (typeof serviceName !== "string") isValid = false;
  if (String(serviceName).length === 0) isValid = false;
  return isValid;
};
