// Combine all update functions
import { createHeaderUpdateFunctions } from "./header";
import { createHeroUpdateFunctions } from "./hero";
import { createFooterUpdateFunctions } from "./footer";
import { createHalfTextHalfImageUpdateFunctions } from "./halfTextHalfImage";
import { createCtaValuationUpdateFunctions } from "./ctaValuation";
import { createGridUpdateFunctions } from "./grid";
import { createFilterButtonsUpdateFunctions } from "./filterButtons";
import { createPropertyFilterUpdateFunctions } from "./propertyFilter";

export const createUpdateFunctions = (set) => ({
  ...createHeaderUpdateFunctions(set),
  ...createHeroUpdateFunctions(set),
  ...createFooterUpdateFunctions(set),
  ...createHalfTextHalfImageUpdateFunctions(set),
  ...createCtaValuationUpdateFunctions(set),
  ...createGridUpdateFunctions(set),
  ...createFilterButtonsUpdateFunctions(set),
  ...createPropertyFilterUpdateFunctions(set),
});
