/**
 * SafeProto is a decorator that allows objects to be stored in prototype
 * properties while having the semantics of a primitive, even if a property
 * of the prototype property's object is modified.
 * @param {Object} desc - the class descriptor
 */
export default function SafeProto(desc) {
	desc.finisher = (cls) => {
		function isCustomObject(obj) {
			let retval = false;
			let type = typeof(obj);
			if ((type == "function") ||
				(obj && (type == "object") && 
				 (!obj.constructor || 
				  obj.constructor.toString().includes('[native code]') ))) {
				retval = true;
			}
			return retval;
		}
		function getHandler(root, parent, field, inst) {
			return {
				get(target, prop, receiver) {
                  	if (parent == null)
                      parent = { value: receiver };
					let retval = Reflect.get(target, prop, receiver);
					if (isCustomObject(retval)) {
						let newParent = (target === root) ? parent.value : receiver;
						retval = new Proxy(retval, getHandler(root, { value: newParent }, prop, inst || receiver));
					}
					return retval;
				},
				set(target, prop, value, receiver) {
					/**
					 * We need to propagate this mutation all the way back to
					 * the root of the object tree, because the root node is
					 * going to be copied to the instance.
					 */
					let retval = true;
					let newTarget = Object.assign(Object.create(Object.getPrototypeOf(target)), target);
					newTarget[prop] = value;

					if (root === target) {
                        let proto = Object.getPrototypeOf(receiver);
                        Object.setPrototypeOf(receiver, null);
						receiver[prop] = value;
                        Object.setPrototypeOf(receiver, proto);
					}
					else {
						parent.value[field] = newTarget;
					}

					return retval;
				}
			};
		}

		return new Proxy(cls, {
			construct(target, args, newTarget) {
				let pNewTarget = function() {};
				let proto = newTarget.prototype;
				let proxy = new Proxy(proto, getHandler(proto, null));

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
						value: proxy
					}
				});
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
				return retval;
			}
		});

	};
	return desc;
}
