import { somethingB } from "./moduleB";
import { somethingC } from "./moduleC";

export const somethingA = () => {
  somethingB();
  somethingC();
};
