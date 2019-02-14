import TransparentProxy from "./lib/TransparentProxy.js";
import ProxySafeWeakMap from "./lib/ProxySafeWeakMap";
import ProxySafeMap from "./lib/ProxySafeMap";

/**
 * ProxySafe is a decorator function designed to allow a class instance to be
 * safely wrapped in a Proxy without fear of issues from (Weak)Map/Set usage.
 * @param {Object} desc - the class decorator descriptor. 
 */
export default function ProxySafe(desc) {
    let retval = Object.assign({}, desc);

    function safeWrap(fn) {
        let retval = function(...args) {
            let prevWeakMap = WeakMap;
            let prevMap = Map;
            let prevProxy = Proxy;
            let retval;

            WeakMap = ProxySafeWeakMap;
            Map = ProxySafeMap;
            Proxy = TransparentProxy;

            try {
                retval = fn.call(this, ...args);
            }
            finally {
                Proxy = prevProxy;
                Map = prevMap;
                WeakMap = prevWeakMap;
            }

            return retval;
        }

        Object.defineProperties(retval, {
            name: Object.getOwnPropertyDescriptor(fn, "name"),
            length: Object.getOwnPropertyDescriptor(fn, "length")
        });

        if (fn.hasOwnProperty("prototype")) {
            Object.defineProperty(retval, "prototype", 
                Object.getOwnPropertyDescriptor(fn, "prototype"));
        }

        return retval;
    }

    for (let element of retval.elements) {
        if ("method" in element)
            element.initializer = safeWrap(value);
    }

    return retval;
};
