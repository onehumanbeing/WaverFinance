
const sliceDigitalStr = (digital: string, position: number) => {
  const precision = 3;
  const headPart = digital.slice(0, digital.length - position);
  const decimalPart = digital.slice(digital.length - position, digital.length - position + Math.max(precision - headPart.length, 0));
  if(decimalPart.length === 0) {
    return headPart;
  }
  return `${headPart}.${decimalPart}`;
} 

/** transform 12345 to 12k */
export const transIntegerWithUnit = (digital: string) => {
  const digitalLen = digital.length;
  if (digitalLen <= 3) {
    return digital;
  } else if (digitalLen <= 6) {
    return `${sliceDigitalStr(digital, 3)}K`;
  } else if (digitalLen <= 9) {
    return `${sliceDigitalStr(digital, 6)}M`;
  } else if (digitalLen <= 12) {
    return `${sliceDigitalStr(digital, 9)}B`;
  } else if (digitalLen <= 15) {
    return `${sliceDigitalStr(digital, 12)}T`;
  } else if (digitalLen <= 18) {
    return `${sliceDigitalStr(digital, 15)}P`;
  } else if (digitalLen <= 21) {
    return `${sliceDigitalStr(digital, 18)}E`;
  } else if (digitalLen <= 24) {
    return `${sliceDigitalStr(digital, 21)}Z`;
  } else if (digitalLen <= 27) {
    return `${sliceDigitalStr(digital, 24)}Y`;
  } else {
    return `${sliceDigitalStr(digital, 27)}B`;
  }
}

export const insertComma = (digital: string) => {
  const digitalLen = digital.length;
  if (digitalLen <= 3) {
    return digital;
  } else {
    const digitalArr = digital.split("");
    const digitalArrLen = digitalArr.length;
    const digitalArrNew = [];
    for (let i = 0; i < digitalArrLen; i++) {
      if ((digitalArrLen - i) % 3 === 0 && i !== 0) {
        digitalArrNew.push(",");
      }
      digitalArrNew.push(digitalArr[i]);
    }
    return digitalArrNew.join("");
  }
}

export const transDigital = (digital: string | number, mode: "normal" | "brief") => {
  const digitalStr = digital.toString();
  const [integer, decimal] = digitalStr.split(".");

  if (mode === "normal") {
    return `${insertComma(integer)}${decimal ? `.${decimal.slice(0, 2)}` : ""}`;
  }
  if (mode === "brief") {
    if (integer.length < 3) {
      return `${integer}${decimal ? `.${decimal.slice(0, 3 - integer.length)}` : ""}`;
    } else {
      return transIntegerWithUnit(integer);
    }
  }

  throw new Error("mode is not valid");
}
