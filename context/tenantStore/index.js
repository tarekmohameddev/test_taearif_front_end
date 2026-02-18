import { create } from "zustand";
import { initialState } from "./storeState";
import { createStoreActions } from "./storeActions";
import { createUpdateFunctions } from "./updateFunctions";
import { createFetchFunctions } from "./fetchFunctions";
import { createSaveHeaderChanges } from "./saveFunctions/header";
import { createSaveHeroChanges } from "./saveFunctions/hero";
import { createSaveFooterChanges } from "./saveFunctions/footer";
import { createSaveHalfTextHalfImageChanges } from "./saveFunctions/halfTextHalfImage";
import { createSaveCtaValuationChanges } from "./saveFunctions/ctaValuation";
import { createSavePropertySliderChanges } from "./saveFunctions/propertySlider";
import { createSaveGridChanges } from "./saveFunctions/grid";
import { createSaveFilterButtonsChanges } from "./saveFunctions/filterButtons";
import { createSavePropertyFilterChanges } from "./saveFunctions/propertyFilter";

const useTenantStore = create((set, get) => ({
  ...initialState,
  ...createStoreActions(set, get),
  ...createUpdateFunctions(set, get),
  ...createFetchFunctions(set, get),
  ...createSaveHeaderChanges(set),
  ...createSaveHeroChanges(set),
  ...createSaveFooterChanges(set),
  ...createSaveHalfTextHalfImageChanges(set),
  ...createSaveCtaValuationChanges(set),
  ...createSavePropertySliderChanges(set),
  ...createSaveGridChanges(set),
  ...createSaveFilterButtonsChanges(set),
  ...createSavePropertyFilterChanges(set),
}));

export default useTenantStore;
