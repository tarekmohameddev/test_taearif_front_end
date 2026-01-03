// Enhanced Position Tracker - Simplified version

export interface PositionDebugInfo {
  operation: string;
  calculatedIndex: number;
  finalIndex: number;
  adjustmentReason: string;
  beforeState: Array<{ componentName: string; index: number }>;
  afterState: Array<{ componentName: string; index: number }>;
}

export interface ComponentMoveResult {
  success: boolean;
  updatedComponents: any[];
  debugInfo: PositionDebugInfo;
}

class EnhancedPositionTracker {
  private static instance: EnhancedPositionTracker;
  private debugMode = false;
  private positionHistory: any[] = [];
  private moveOperations: any[] = [];

  private constructor() {}

  static getInstance(): EnhancedPositionTracker {
    if (!EnhancedPositionTracker.instance) {
      EnhancedPositionTracker.instance = new EnhancedPositionTracker();
    }
    return EnhancedPositionTracker.instance;
  }

  recordState(components: any[], reason: string): void {
    const positions = components.map((comp, index) => ({
      componentName: comp.componentName || comp.name || `Component-${index}`,
      index,
      id: comp.id,
    }));

    this.positionHistory.push({
      timestamp: Date.now(),
      reason,
      positions,
    });

    // Keep only last 50 records
    if (this.positionHistory.length > 50) {
      this.positionHistory.shift();
    }

    if (this.debugMode) {
      // Debug logging disabled
    }
  }

  private calculateCorrectIndex(
    sourceIndex: number,
    sourceZone: string,
    destinationIndex: number,
    destinationZone: string,
    totalComponents: number,
  ): { finalIndex: number; adjustmentReason: string } {
    let finalIndex = destinationIndex;
    let adjustmentReason = "No adjustment needed";

    // Ensure index is within bounds
    const maxIndex = Math.max(0, totalComponents - 1);
    if (finalIndex > maxIndex) {
      finalIndex = maxIndex;
      adjustmentReason = `Index capped at maximum: ${maxIndex}`;
    }

    if (this.debugMode) {
      // Debug logging disabled
    }

    return { finalIndex, adjustmentReason };
  }

  trackComponentMove(
    components: any[],
    sourceIndex: number,
    sourceZone: string,
    destinationIndex: number,
    destinationZone: string,
  ): ComponentMoveResult {
    const startTime = Date.now();

    try {
      // Calculate correct index
      const { finalIndex, adjustmentReason } = this.calculateCorrectIndex(
        sourceIndex,
        sourceZone,
        destinationIndex,
        destinationZone,
        components.length,
      );

      // Create copies for manipulation
      const workingComponents = [...components];

      // Remove source component
      const [movedComponent] = workingComponents.splice(sourceIndex, 1);

      // Insert at destination
      workingComponents.splice(finalIndex, 0, movedComponent);

      // Update position properties
      const updatedComponents = workingComponents.map((comp, index) => ({
        ...comp,
        position: index,
        layout: {
          ...comp.layout,
          row: index,
        },
      }));

      // Create debug info
      const debugInfo: PositionDebugInfo = {
        operation: "move-component",
        calculatedIndex: destinationIndex,
        finalIndex,
        adjustmentReason,
        beforeState: components.map((c, i) => ({
          componentName: c.componentName || c.name || `Component-${i}`,
          index: i,
        })),
        afterState: updatedComponents.map((c, i) => ({
          componentName: c.componentName || c.name || `Component-${i}`,
          index: i,
        })),
      };

      // Record the operation
      this.moveOperations.push({
        timestamp: Date.now(),
        sourceIndex,
        finalIndex,
        adjustmentReason,
      });

      if (this.debugMode) {
        // Debug logging disabled
      }

      return {
        success: true,
        updatedComponents,
        debugInfo,
      };
    } catch (error) {
      return {
        success: false,
        updatedComponents: components,
        debugInfo: {
          operation: "move-component-error",
          calculatedIndex: destinationIndex,
          finalIndex: sourceIndex,
          adjustmentReason: `Error: ${error}`,
          beforeState: components.map((c, i) => ({
            componentName: c.componentName || c.name || `Component-${i}`,
            index: i,
          })),
          afterState: components.map((c, i) => ({
            componentName: c.componentName || c.name || `Component-${i}`,
            index: i,
          })),
        },
      };
    }
  }

  generateReport(): any {
    return {
      totalOperations: this.moveOperations.length,
      historyLength: this.positionHistory.length,
      recentOperations: this.moveOperations.slice(-10),
      recentHistory: this.positionHistory.slice(-10),
    };
  }

  reset(): void {
    this.positionHistory = [];
    this.moveOperations = [];
    // Debug logging disabled
  }

  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    // Debug logging disabled
  }
}

// Export functions
export const positionTracker = EnhancedPositionTracker.getInstance();

export const trackComponentMove = (
  components: any[],
  sourceIndex: number,
  sourceZone: string,
  destinationIndex: number,
  destinationZone: string,
): ComponentMoveResult => {
  return positionTracker.trackComponentMove(
    components,
    sourceIndex,
    sourceZone,
    destinationIndex,
    destinationZone,
  );
};

export const generatePositionReport = () => positionTracker.generateReport();
export const resetPositionTracker = () => positionTracker.reset();
export const setPositionTrackerDebugMode = (enabled: boolean) =>
  positionTracker.setDebugMode(enabled);

// Validation function for component positions
export interface PositionValidation {
  isValid: boolean;
  issues: string[];
  correctedComponents?: any[];
}

export const validateComponentPositions = (
  components: any[],
): PositionValidation => {
  const issues: string[] = [];
  const correctedComponents: any[] = [];
  let isValid = true;

  try {
    components.forEach((component, index) => {
      // Check if position property exists and matches index
      if (component.position !== undefined && component.position !== index) {
        issues.push(
          `Component at index ${index} has incorrect position: ${component.position}`,
        );
        isValid = false;

        // Create corrected component
        correctedComponents.push({
          ...component,
          position: index,
          layout: {
            ...component.layout,
            row: index,
          },
        });
      } else {
        // Component is correct, just ensure position is set
        correctedComponents.push({
          ...component,
          position: index,
          layout: {
            ...component.layout,
            row: index,
          },
        });
      }

      // Check for duplicate positions
      const duplicatePositions = components.filter(
        (comp, i) => i !== index && comp.position === component.position,
      );

      if (duplicatePositions.length > 0) {
        issues.push(
          `Duplicate position ${component.position} found for component at index ${index}`,
        );
        isValid = false;
      }
    });

    // Check for gaps in position sequence
    const positions = components
      .map((comp) => comp.position)
      .filter((pos) => pos !== undefined);
    const sortedPositions = [...positions].sort((a, b) => a - b);

    for (let i = 0; i < sortedPositions.length - 1; i++) {
      if (sortedPositions[i + 1] - sortedPositions[i] > 1) {
        issues.push(
          `Gap in position sequence: ${sortedPositions[i]} to ${sortedPositions[i + 1]}`,
        );
        isValid = false;
      }
    }
  } catch (error) {
    issues.push(`Validation error: ${error}`);
    isValid = false;
  }

  return {
    isValid,
    issues,
    correctedComponents: isValid ? undefined : correctedComponents,
  };
};
