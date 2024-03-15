import {
  ActivityDtoStatusEnum,
  ActivityDtoTypeEnum,
  UpdateActivityDtoStatusEnum,
  UpdateActivityDtoTypeEnum,
} from "../../api/models";

const AysUtils = {
  generateRandomTC,
  convertActivityTypeToEnum,
  convertActivityStatusToEnum,
  convertActivityStatusToColor,
  capitalizeFirstLetter,
  getFormattedGsm,
  getUTCDateString,
  getUTCDate,
  getStudentRecordType,
  getGsmString,
  removeHourSection,
  getDateFromTime,
  prefixGSM,
  getLabelWithRequiredIndicator,
  arrayJoin,
  capitalizeName,
};

export function capitalizeName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function arrayJoin(arr: any[], joinStr: string): string {
  return arr.join(joinStr);
}

export function getUTCDateString(n: number): string {
  const date = new Date(n);
  const dateUTC = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
  return dateUTC.toISOString();
}

export function getLabelWithRequiredIndicator(label: string | undefined) {
  if (label) {
    return (
      <>
        {label}
        <span style={{ color: "red" }}>{" *"}</span>
      </>
    );
  } else {
    return <>{label}</>;
  }
}

export function removeHourSection(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
}

export function getUTCDate(n: number): Date {
  const date = new Date(n);
  const dateUTC = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  );
  return dateUTC;
}

export enum ActivityPageView {
  day,
  week,
  month,
}

export enum Days {
  Pazartesi = "Pzt",
  Salı = "Sal",
  Carsamba = "Çar",
  Persembe = "Per",
  Cuma = "Cum",
  Cumartesi = "Cmt",
  Pazar = "Paz",
}

export enum Months {
  Ocak = "Oca",
  Subat = "Şub",
  Mart = "Mar",
  Nisan = "Nis",
  Mayis = "May",
  Haziran = "Haz",
  Temmuz = "Tem",
  Agustos = "Ağu",
  Eylul = "Eyl",
  Ekim = "Eki",
  Kasim = "Kas",
  Aralik = "Ara",
}

export function getDateFromTime(time: string) {
  let date = new Date();
  let splitTime = time.split(":");

  date.setUTCHours(parseInt(splitTime[0]));
  date.setUTCMinutes(parseInt(splitTime[1]));

  return date.getTime();
}

export function capitalizeFirstLetter(inputString: string): string {
  if (inputString.length === 0) {
    return inputString; // Return the original string if it's empty
  }

  const firstLetter = inputString[0].toUpperCase();
  const restOfTheString = inputString.slice(1);

  return firstLetter + restOfTheString;
}

export function getStudentRecordType(type: ActivityDtoTypeEnum) {
  if (ActivityDtoTypeEnum.Default === type) {
    return [""];
  } else if (ActivityDtoTypeEnum.Attendance === type) {
    return ["false", "true"];
  } else if (ActivityDtoTypeEnum.Meal === type) {
    return ["yemedi", "az yedi", "yedi"];
  }
}

export function getGsmString(gsm: string) {
  if (gsm) {
    let digitsOnly = gsm.replace(/\D/g, "");
    digitsOnly = digitsOnly.substring(2, digitsOnly.length);

    if (digitsOnly.length >= 10) {
      return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(
        3,
        6
      )} ${digitsOnly.slice(6)}`;
    } else {
      return gsm;
    }
  }
}

export function prefixGSM(gsm: string | number | null | undefined) {
  if (gsm) {
    return "+90" + gsm;
  } else {
    return "";
  }
}

export function validateGsm(gsmNumber: string) {
  if (/^(?:\d{10}|\+90\d{10})$/.test(prefixGSM(gsmNumber))) {
    return true;
  } else {
    return false;
  }
}

export function getFormattedGsm(gsm: string | number | null | undefined) {
  if (gsm) {
    const gsmString = gsm.toString();
    const updatedGsm = gsmString.replace(/\s/g, "");

    if (validateGsm(updatedGsm)) {
      return prefixGSM(updatedGsm);
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function generateRandomTC() {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const tcArray = [firstDigit];

  for (let i = 0; i < 8; i++) {
    const digit = Math.floor(Math.random() * 10);
    tcArray.push(digit);
  }

  const sumOfFirstNine = tcArray.reduce((sum, digit, index) => {
    if (index < 9) {
      sum += digit;
    }
    return sum;
  }, 0);

  const tenthDigit = (sumOfFirstNine * 7) % 10;
  tcArray.push(tenthDigit);

  const eleventhDigit = tcArray.reduce((sum, digit) => sum + digit) % 10;
  tcArray.push(eleventhDigit);

  const tcNo = tcArray.reduce((accum, digit) => accum * 10 + digit, 0);

  return tcNo;
}

export function convertActivityTypeToEnum(
  typeEnum: ActivityDtoTypeEnum | UpdateActivityDtoTypeEnum
): String {
  if (ActivityDtoTypeEnum.Attendance === typeEnum) {
    return "Yoklama";
  } else if (ActivityDtoTypeEnum.Meal === typeEnum) {
    return "Yemek";
  } else {
    return "Etkinlik";
  }
}

export function convertActivityStatusToEnum(
  statusEnum: ActivityDtoStatusEnum | UpdateActivityDtoStatusEnum
): String {
  if (ActivityDtoStatusEnum.Active === statusEnum) {
    return "Aktif";
  } else if (ActivityDtoStatusEnum.Planned === statusEnum) {
    return "Planlı";
  } else if (ActivityDtoStatusEnum.Completed === statusEnum) {
    return "Tamamlandı";
  } else if (ActivityDtoStatusEnum.Cancelled === statusEnum) {
    return "İptal Edildi";
  } else {
    return "";
  }
}

export function convertActivityStatusToColor(
  statusEnum: ActivityDtoStatusEnum | UpdateActivityDtoStatusEnum
): string {
  if (ActivityDtoStatusEnum.Active === statusEnum) {
    return "primary";
  } else if (ActivityDtoStatusEnum.Planned === statusEnum) {
    return "secondary";
  } else if (ActivityDtoStatusEnum.Completed === statusEnum) {
    return "success";
  } else if (ActivityDtoStatusEnum.Cancelled === statusEnum) {
    return "danger";
  } else {
    return "";
  }
}

export default AysUtils;
