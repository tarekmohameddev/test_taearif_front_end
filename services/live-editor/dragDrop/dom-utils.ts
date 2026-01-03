export function getDeepScrollPosition(element: HTMLElement) {
  console.log(
    "🔍 [DOM-UTILS] getDeepScrollPosition called for element:",
    element,
  );
  let x = 0;
  let y = 0;
  let currentElement: HTMLElement | null = element;

  while (currentElement) {
    x += currentElement.scrollLeft;
    y += currentElement.scrollTop;
    currentElement = currentElement.parentElement;
  }

  console.log("🔍 [DOM-UTILS] getDeepScrollPosition result:", { x, y });
  return { x, y };
}

export function accumulateTransform(element: HTMLElement | null) {
  console.log(
    "🔍 [DOM-UTILS] accumulateTransform called for element:",
    element,
  );
  let scaleX = 1;
  let scaleY = 1;

  if (!element) {
    console.log(
      "🔍 [DOM-UTILS] accumulateTransform - no element, returning default",
    );
    return { scaleX, scaleY };
  }

  const computedStyle = getComputedStyle(element);
  const transform = computedStyle.getPropertyValue("transform");

  if (transform && transform !== "none") {
    const matrix = new DOMMatrix(transform);
    scaleX = matrix.a;
    scaleY = matrix.d;
  }

  const parentTransforms = accumulateTransform(element.parentElement);

  const result = {
    scaleX: scaleX * parentTransforms.scaleX,
    scaleY: scaleY * parentTransforms.scaleY,
  };

  console.log("🔍 [DOM-UTILS] accumulateTransform result:", result);
  return result;
}
