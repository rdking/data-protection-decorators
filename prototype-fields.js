export function PrototypeFields(desc) {
	desc.elements.forEach(e => {
		if (!e.descriptor.private && (e.placement != "static")) {
			e.placement = "prototype";
		}
	});

	return desc;
}
