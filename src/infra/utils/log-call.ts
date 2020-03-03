export const logCall = () =>
  function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
      console.log(`Call ${target.constructor.name}.${propertyKey}(${args.map(x => JSON.stringify(x)).join(', ')})`);
      return original.apply(this, args);
    };
  };
