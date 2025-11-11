declare module "lodash-move" {
  export default function move<T>(
    array: T[],
    fromIndex: number,
    toIndex: number
  ): T[];
}
