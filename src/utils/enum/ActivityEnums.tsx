import { RangeValue } from "@ionic/core";

export enum ActivityTypes {
  attendance = "attendance",
  food = "food",
  daily = "daily",
}

enum FoodStatus {
  none = 0,
  half = 1,
  full = 2,
}

namespace FoodStatus {
  export function toString(value: FoodStatus): string {
    if (value === FoodStatus.none) {
      return "Yemedi";
    } else if (value === FoodStatus.half) {
      return "Az Yedi";
    } else {
      return "Yedi";
    }
  }

  export function rangeValueToString(rangeValue: RangeValue): string {
    if (FoodStatus.none === Number(rangeValue)) {
      return "Yemedi";
    } else if (FoodStatus.half === Number(rangeValue)) {
      return "Az Yedi";
    } else {
      return "Yedi";
    }
  }

  export function stringToNumberValue(value: string): number {
    if (value === toString(FoodStatus.none)) {
      return 0;
    } else if (value === toString(FoodStatus.half)) {
      return 1;
    } else {
      return 2;
    }
  }
}

export { FoodStatus };

export enum StudentFoodStatus {
  full,
  half,
  none,
  default,
}
