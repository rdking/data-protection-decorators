import ProxySafe from "../proxy-safe";
import SafeProto from "../safe-proto";
import { PrivateMembers, Private, Protected, Inherited } from "../private-members";


/**
 * Testing SafeProto
 */
@PrototypeProperties
@SafeProto
class



@ProxySafe
@SafeProto
@PrivateMembers()
class Test {
    @Private pvtField = 1;
    @Protected protField = 42;
    pubField = Math.PI;
    
    privateCheck() {
        console.log(`pvtField = ${this.pvtField}`);
        console.log(`protField = ${this.protField}`);
        console.log(`pubField = ${this.pubField}`);
    }
};

@ProxySafe
@SafeProto
@PrivateMembers(Test)
class SubTest extends Test {
    @Private pvtField = 2;
    @Inherited protField;
    pubField2 = Math.E;

    privateCheck() {
        console.log(`pvtField = ${this.pvtField}`);
        console.log(`protField = ${this.protField}`);
        console.log(`pubField = ${this.pubField}`);
        console.log(`pubField2 = ${this.pubField2}`);
    }
}

let test = new SubTest;
test.privateCheck();
