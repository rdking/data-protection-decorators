require("./TransparentProxy");

//The Original Map
const OM = Map;

//Its necessary to interfere everywhere that requires the caller to give a key.
export default class ProxySafeMap extends OM {
  get isProxySafe() { return true; }

  get(obj) {
    if (Proxy.canUnwrap(obj))
      obj = Proxy.unwrap(obj);
    return OM.prototype.get.call(this, obj);
  }

  set(obj, val) {
    if (Proxy.canUnwrap(obj))
      obj = Proxy.unwrap(obj);
    return OM.prototype.set.call(this, obj, val);
  }

  has(obj) {
    if (Proxy.canUnwrap(obj))
      obj = Proxy.unwrap(obj);
    return OM.prototype.has.call(this, obj);
  }

  delete(obj) {
    if (Proxy.canUnwrap(obj))
      obj = Proxy.unwrap(obj);
    return OM.prototype.delete.call(this, obj);
  }
};
