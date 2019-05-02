import ReactPrimitiveBase from "./react_primitive_base";

export default class ReactText extends ReactPrimitiveBase {
  asString() {
    return this.nativeNode;
  }

  asNumber() {
    return +this.asString();
  }
}
