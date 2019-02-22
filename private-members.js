
//Class decorator to enable private & protected members
export const PrivateMembers = (function () {
    let pvt = new WeakMap();
    let prot = new WeakMap();

    /**
     * Function to create a new private name
     */
    function PrivateName(fname) {
        function extract({key}) { throw key; }
        try { eval(`class Throwaway { @extract #${fname}; }`); }
        catch (name) { return name; }
    }

    return function PrivateMembers(Base) {
        return function PMDecorator(target) {
            console.log(`Running Decorator: PrivateMembers`);
            let retval = {
                kind: target.kind,
                elements: [],
                finisher: (cls) => {
                    let inCtor = false;
                    let handler = {
                        data: {},
                        deleted: [],
                        get(target, prop, receiver) {
                            let retval = this.data[prop];
                            if (prop in target)
                                retval = Reflect.get(target, prop, receiver);
                            return retval;
                        },
                        has(target, prop) {
                            return Reflect.has(target, prop) || (prop in this.data);
                        },
                        set(target, prop, value, receiver) {
                            let retval = true;
                            if (prop in target)
                                retval = Reflect.set(target, prop, value, receiver);
                            else
                                this.data[prop] = value;
                            return retval;
                        }
                    };

                    return new Proxy(cls, {
                        construct(target, args, newTarget) {
                            let pNewTarget = function() {};
                            Object.defineProperties(pNewTarget, {
                                name: {
                                    configurable: true,
                                    value: newTarget.name
                                },
                                length: {
                                    configurable: true,
                                    value: newTarget.length
                                },
                                prototype: {
                                    value: new Proxy(newTarget.prototype, handler)
                                }
                            });
                            inCtor = true;
                            let oldTHI = target[Symbol.hasInstance];
                            Object.defineProperty(target, Symbol.hasInstance, {
                                configurable: true,
                                value: (inst) => {
                                    let iProto = Object.getPrototypeOf(inst);
                                    return ([target.prototype, newTarget.prototype, pNewTarget.prototype].includes(iProto));
                                }
                            });
                            let retval = Reflect.construct(target, args, pNewTarget);
                            delete target[Symbol.hasInstance]
                            if (oldTHI) {
                                Object.defineProperty(target, Symbol.hasInstance, {
                                    configurable: true,
                                    value: oldTHI
                                });
                            }
                            inCtor = false;
                            //Object.setPrototypeOf(retval, newTarget.prototype);
                            return new Proxy(retval, handler);
                        }
                    });
                }
            };
            
            let topc = {};
            let ptopc = (Base) ? prot.get(Base) : {};
            Object.assign(topc, ptopc);

            target.elements.forEach(e => {
                if (e.descriptor.private) {
                    /**
                     * Currently, as of v7.3.0 of class members and decorators,
                     * there's no support for using decorators with private
                     * fields. So we can work around this by cheating, and 
                     * letting a decorator create the actual private field. In
                     * this way, we can turn a private name into a private
                     * Symbol.
                     */
                    let element = Object.assign({}, e);
                    let pkey = PrivateName(e.key);

                    if (e.descriptor.shared) {
                        topc[e.key] = pkey;
                        element.key = pkey;
                    }
                }
                else {
                    retval.elements.push(e);
                }
            });

            return retval;
        }
    }
})();

export function Private(target) {
    console.log(`Running Decorator: Private`);
    console.log(target);
    if (typeof (target.key) == "symbol")
        throw new TypeError("Symbols cannot use @Private");
    target.descriptor.private = true;
}

export function Protected(target) {
    console.log(`Running Decorator: Protected`);
    console.log(target);
    if (typeof (target.key) == "symbol")
        throw new TypeError("Symbols cannot use @Protected");
    target.descriptor.private = true;
    target.descriptor.shared = true;
}

export function Inherited(target) {
    console.log(`Running Decorator: Inherited`);
    console.log(target);
    if (typeof (target.key) == "symbol")
        throw new TypeError("Symbols cannot use @Inherited");
    target.descriptor.private = true;
    target.descriptor.inherited = true;
}
