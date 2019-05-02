import ReactPrimitiveBase from "./react_primitive_base";

export default class ReactNumber extends ReactPrimitiveBase {
  asString() {
    return "" + this.asNumber();
  }

  asNumber() {
    return this.nativeNode;
  }
}
