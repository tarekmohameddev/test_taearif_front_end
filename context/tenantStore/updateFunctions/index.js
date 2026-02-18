// Combine all update functions
import { createHeaderUpdateFunctions } from "./header";
import { createHeroUpdateFunctions } from "./hero";
import { createFooterUpdateFunctions } from "./footer";
import { createHalfTextHalfImageUpdateFunctions } from "./halfTextHalfImage";
import { createCtaValuationUpdateFunctions } from "./ctaValuation";
import { createGridUpdateFunctions } from "./grid";
import { createFilterButtonsUpdateFunctions } from "./filterButtons";
import { createPropertyFilterUpdateFunctions } from "./propertyFilter";

export const createUpdateFunctions = (set, get) => ({
  ...createHeaderUpdateFunctions(set, get),
  ...createHeroUpdateFunctions(set, get),
  ...createFooterUpdateFunctions(set, get),
  ...createHalfTextHalfImageUpdateFunctions(set, get),
  ...createCtaValuationUpdateFunctions(set, get),
  ...createGridUpdateFunctions(set, get),
  ...createFilterButtonsUpdateFunctions(set, get),
  ...createPropertyFilterUpdateFunctions(set, get),
});
