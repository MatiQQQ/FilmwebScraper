exports.validateServiceName = (serviceName) => {
  let isValid = true;
  if (!serviceName) isValid = false;
  if (typeof serviceName !== "string") isValid = false;
  if (String(serviceName).length === 0) isValid = false;
  return isValid;
};

console.log(this.validateServiceName());
console.log(this.validateServiceName(null));
console.log(this.validateServiceName(50));
console.log(this.validateServiceName(""));
console.log(this.validateServiceName("hbo"));
