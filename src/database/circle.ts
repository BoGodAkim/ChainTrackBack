export class Circle {
  x: number;
  y: number;
  radius: number;
}

export const circleTransformer = {
  to: (value: Circle): string | null => {
    if (value == null) {
      return null;
    }
    return `(${value.x},${value.y}),${value.radius}`;
  },
  from: (value: Circle) => {
    if (value == null) {
      return null;
    }
    return { x: value.x, y: value.y, radius: value.radius };
  },
};
