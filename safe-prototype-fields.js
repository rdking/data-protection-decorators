import SafeProto from "./safe-proto";
import PrototypeFields from "./prototype-fields"

export default function SafePrototypeFields(desc) {
    return SafeProto(PrototypeFields(desc));
}
