
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
                    /**
                     * This handler is only used during the construction of the
                     * class instance. It's purpose is to cache all data changes
                     * that occur within the instance during the constructor. These
                     * changes are then played back on the instance after Proxy
                     * wrapping so as to make it as though the instance was always
                     * proxied. This, of course, fails for (Weak)Map/Set usage.
                     */
                    let handler = {
                        ctorRun: {
                            defs: {},
                            data: {},
                            deleted: []
                        },
                        defineProperty(target, prop, desc) {
                            let retval = true;
                            if (inCtor) {
                                ctorRun.defs[prop] = desc;
                                data[prop] = desc.value;
                            }
                            else {
                                retval = Reflect.defineProperty(target, prop, desc);
                            }
                            return retval;
                        },
                        deleteProperty(target, prop) {

                        },
                        get(target, prop, receiver) {

                        },
                        getOwnPropertyDescriptor(target, prop) {

                        },
                        has(target, prop) {

                        },
                        ownKeys(target) {

                        },
                        set(target, prop, value, receiver) {

                        }
                    };

                    return new Proxy(cls, {
                        construct(target, args, newTarget) {
                            let pNewTarget = function() {};
                            Object.defineProperties(retval, {
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
                            let retval = Reflect.construct(target, args, pNewTarget);
                            inCtor = false;
                            Object.setPrototypeOf(rval, newTarget.prototype);
                            return new Proxy(retval, handler);
                        }
                    });
                }
            };
            let topc = {};
            let ptopc = (Base) ? prot.get(Base) : {};
            target.elements.forEach(e => {
                if (e.descriptor.private) {
                    let element = Object.assign({}, e);
                    let pkey = PrivateName(e.key);

                    if (e.descriptor.shared) {
                        topc[e.key] = pkey;
                        element.key = pkey;
                    }
                    pvtData[v = e.initializer;
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
