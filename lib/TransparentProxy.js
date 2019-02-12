var Global = typeof(window) == "object" ? window : global;

Global.Proxy = (function() {
  let retval = Global.Proxy;
  if (!retval.isTransparent) {
    let pvt = new WeakMap();
    let OP = retval;
    retval = class Proxy {
      constructor(target, handler) {
        let rval = new OP(target, handler);
        pvt.set(rval, target);
        return rval;
      }

      static get isTransparent() { return true; }
      static canUnwrap(obj) { return pvt.has(obj); }
      static unwrap(obj) {
        console.log("Unwrapping Proxy object...");
        return pvt.get(obj);
      }
      static unhook() { Global.Proxy = OP; }
    }
  }
  return retval;
})();
