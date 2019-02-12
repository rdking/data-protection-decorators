require("./TransparentProxy");

const OWM = WeakMap;

export default class ProxySafeWeakMap extends OWM {
  constructor() {
    var retval = new OWM();
    Object.setPrototypeOf(retval, WeakMap.prototype);
    return retval;
  }

  get isProxySafe() { return true; }

  get(obj) {
    if (Proxy.canUnwrap(obj))
      obj = Proxy.unwrap(obj);
    return OWM.prototype.get.call(this, obj);
  }

  set(obj, val) {
    if (Proxy.canUnwrap(obj))
      obj = Proxy.unwrap(obj);
    return OWM.prototype.set.call(this, obj, val);
  }

  has(obj) {
    if (Proxy.canUnwrap(obj))
      obj = Proxy.unwrap(obj);
    return OWM.prototype.has.call(this, obj);
  }

  delete(obj) {
    if (Proxy.canUnwrap(obj))
      obj = Proxy.unwrap(obj);
    return OWM.prototype.delete.call(this, obj);
  }
};
