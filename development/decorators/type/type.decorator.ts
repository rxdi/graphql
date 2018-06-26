import { Container } from '@rxdi/core';

export function Type<T>(type): Function {
    const currentType = new type();
    if (!Container.has(currentType.name)) {
        Container.set(currentType.name, currentType);
    }
    type = { type:  Container.get(currentType.name) };
    return (t: any, propKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        const self = t;
        const originalMethod = descriptor.value;
        const propertyKey = propKey;
        descriptor.value = function (...args: any[]) {
            const returnValue = originalMethod.apply(args);
            Object.assign(returnValue, type);
            return returnValue;
        };
        self.constructor._descriptors = self.constructor._descriptors || new Map();
        self.constructor._descriptors.set(propertyKey, descriptor);

        return descriptor;
    };
}