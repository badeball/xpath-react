export default function (a, b) {
  a = a.getId();
  b = b.getId();

  if (a === b) {
    return 0;
  }

  a = a.split(".").map(function (number) {
    return parseInt(number, 10);
  });

  b = b.split(".").map(function (number) {
    return parseInt(number, 10);
  });

  for (var i = 0; i < a.length; i++) {
    if (i === b.length) {
      return 1;
    }

    if (a[i] < b[i]) {
      return -1;
    }

    if (a[i] > b[i]) {
      return 1;
    }
  }

  return -1;
};
