import { IReactElementAdapter } from "./react_element_adapter";

function parseIntBase10 (number: string) {
  return parseInt(number, 10);
}

export default function (a: IReactElementAdapter, b: IReactElementAdapter): 1 | 0 | -1 {
  if (a.isEqual(b)) {
    return 0;
  }

  const aId = a.getId().split(".").map(parseIntBase10);
  const bId = b.getId().split(".").map(parseIntBase10);

  for (let i = 0; i < aId.length; i++) {
    if (i === bId.length) {
      return 1;
    }

    if (aId[i] < bId[i]) {
      return -1;
    }

    if (aId[i] > bId[i]) {
      return 1;
    }
  }

  return -1;
};
