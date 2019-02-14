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
					let retval = Reflect.get(target, prop, receiver);
					if (isCustomObject(retval)) {
						let newParent = (target === root) ? parent : receiver;
						retval = new Proxy(retval, getHandler(root, newParent, prop, inst || receiver));
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
						retval = Reflect.set(receiver, field, newTarget, receiver);
					}
					else {
						parent[field] = newTarget;
					}

					return retval;
				}
			};
		}

		return new Proxy(cls, {
			construct(target, args, newTarget) {
				let pNewTarget = function() {};
				let proto = newTarget.prototype;
				let pseudoHandler = {};
				let proxy = new Proxy(proto, pseudoHandler);
				Object.assign(pseudoHandler, getHandler(proto, proxy));

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
				return Reflect.construct(target, args, pNewTarget);
			}
		});

	};
	return desc;
}
