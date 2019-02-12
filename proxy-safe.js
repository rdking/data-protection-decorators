/**
 * ProxySafe is a decorator function designed to allow a class instance to be
 * safely wrapped in a Proxy without fear of issues from (Weak)Map/Set usage.
 * @param {Object} desc - the class decorator descriptor. 
 */
export default function ProxySafe(desc) {
    function safeWrap(fn) {
        let retval = function(...args) {
            let prevWeakMap = WeakMap;
            let prevWeakSet = WeakSet;
            let prevMap = Map;
            let prevSet = Set;
            let prevProxy = Proxy;
            let retval;

            try {
                retval = fn.call(this, ...args);
            }
            finally {
                Proxy = prevProxy;
                Set = prevSet;
                Map = prevMap;
                WeakSet = prevWeakSet;
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

    for (let element of desc.elements) {
        
    }
}
