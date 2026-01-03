import { useState } from "react";
import { PointerSensor } from "@dnd-kit/react";
import { isElement } from "@dnd-kit/dom/utilities";
import { type Distance } from "@dnd-kit/geometry";

export interface DelayConstraint {
  value: number;
  tolerance: Distance;
}

export interface DistanceConstraint {
  value: Distance;
  tolerance?: Distance;
}

export interface ActivationConstraints {
  distance?: DistanceConstraint;
  delay?: DelayConstraint;
}

const touchDefault = { delay: { value: 200, tolerance: 10 } };
const otherDefault = {
  delay: { value: 200, tolerance: 10 },
  distance: { value: 5 },
};

export const useLiveEditorSensors = (
  {
    other = otherDefault,
    mouse,
    touch = touchDefault,
  }: {
    mouse?: ActivationConstraints;
    touch?: ActivationConstraints;
    other?: ActivationConstraints;
  } = {
    touch: touchDefault,
    other: otherDefault,
  },
) => {
  const [sensors] = useState(() => {
    return [
      PointerSensor.configure({
        activationConstraints(event, source) {
          const { pointerType, target } = event;

          if (
            pointerType === "mouse" &&
            isElement(target) &&
            (source.handle === target || source.handle?.contains(target))
          ) {
            return mouse;
          }

          if (pointerType === "touch") {
            return touch;
          }

          return other;
        },
      }),
    ];
  });
  return sensors;
};
