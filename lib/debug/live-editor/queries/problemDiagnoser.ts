/**
 * Problem Diagnoser
 * Diagnoses problems and suggests fixes
 */

import { AIFriendlyEvent, ComponentTrace, StoreSnapshot, DataFlowStep, Diagnosis } from "../core/types";
import { dataFlowAnalyzer } from "../analyzers/dataFlowAnalyzer";
import { priorityAnalyzer } from "../analyzers/priorityAnalyzer";
import { diffAnalyzer } from "../analyzers/diffAnalyzer";

class ProblemDiagnoser {
  /**
   * Diagnose problem
   */
  async diagnose(context: {
    question: string;
    events: AIFriendlyEvent[];
    trace: ComponentTrace | null;
    snapshots: StoreSnapshot[];
    dataFlow: DataFlowStep[] | null;
  }): Promise<Diagnosis> {
    // Analyze events to find problem
    const problem = this.identifyProblem(context);
    const rootCause = this.findRootCause(context, problem);
    const solution = this.suggestSolution(problem, rootCause);
    const steps = this.generateSteps(problem, rootCause, solution);

    return {
      problem,
      rootCause,
      solution,
      steps,
    };
  }

  /**
   * Identify problem
   */
  private identifyProblem(context: any): string {
    const { events, trace, snapshots, dataFlow } = context;

    // Check for data not updating
    const saveEvents = events.filter((e) => e.eventType === "SAVE_COMPLETED");
    const updateEvents = events.filter((e) => e.eventType === "STORE_UPDATED");

    if (saveEvents.length > 0 && updateEvents.length === 0) {
      return "Data not updating in store after save";
    }

    // Check for merge conflicts
    if (dataFlow) {
      const conflicts = dataFlow.filter((df) => df.conflicts && df.conflicts.length > 0);
      if (conflicts.length > 0) {
        return "Merge conflicts detected";
      }
    }

    // Check for priority issues
    if (dataFlow) {
      const priorityIssues = dataFlow.filter((df) => {
        const analysis = priorityAnalyzer.analyzePriorityOrder(df);
        return !analysis.isValid;
      });
      if (priorityIssues.length > 0) {
        return "Priority order issues detected";
      }
    }

    // Check for store update failures
    const failedSaves = events.filter((e) => e.eventType === "SAVE_COMPLETED" && e.details.success === false);
    if (failedSaves.length > 0) {
      return "Store update failures detected";
    }

    // Default: no specific problem identified
    return "No specific problem identified. Review events for details.";
  }

  /**
   * Find root cause
   */
  private findRootCause(context: any, problem: string): string {
    const { events, trace, snapshots, dataFlow } = context;

    if (problem.includes("not updating")) {
      // Check event sequence
      const saveInitiated = events.find((e) => e.eventType === "SAVE_INITIATED");
      const mergeStarted = events.find((e) => e.eventType === "MERGE_STARTED");
      const mergeCompleted = events.find((e) => e.eventType === "MERGE_COMPLETED");
      const storeUpdated = events.find((e) => e.eventType === "STORE_UPDATED");

      if (!saveInitiated) {
        return "Save process was not initiated";
      }
      if (!mergeStarted) {
        return "Merge process did not start";
      }
      if (!mergeCompleted) {
        return "Merge process did not complete";
      }
      if (!storeUpdated) {
        return "Store was not updated after merge";
      }
    }

    if (problem.includes("conflicts")) {
      if (dataFlow) {
        const conflicts = dataFlow.filter((df) => df.conflicts && df.conflicts.length > 0);
        if (conflicts.length > 0) {
          return `Merge conflicts in data sources: ${conflicts[0].conflicts.map((c: any) => c.type).join(", ")}`;
        }
      }
    }

    if (problem.includes("priority")) {
      if (dataFlow) {
        const priorityIssues = dataFlow.filter((df) => {
          const analysis = priorityAnalyzer.analyzePriorityOrder(df);
          return !analysis.isValid;
        });
        if (priorityIssues.length > 0) {
          return `Priority order mismatch: ${priorityIssues[0].merge?.order.join(" -> ")}`;
        }
      }
    }

    return "Root cause requires further analysis of event sequence and data flow";
  }

  /**
   * Suggest solution
   */
  private suggestSolution(problem: string, rootCause: string): string {
    if (problem.includes("not updating")) {
      return "Ensure store update is called after merge completion. Check that setComponentData is being called with merged data.";
    }

    if (problem.includes("conflicts")) {
      return "Resolve merge conflicts by adjusting data source priorities or handling conflicting values explicitly.";
    }

    if (problem.includes("priority")) {
      return "Fix priority order to match expected order based on priority values. Ensure merge order matches source priorities.";
    }

    return "Review event timeline and data flow to identify the issue. Check that all expected events are being emitted.";
  }

  /**
   * Generate steps
   */
  private generateSteps(problem: string, rootCause: string, solution: string): string[] {
    const steps: string[] = [];

    if (problem.includes("not updating")) {
      steps.push("1. Check that SAVE_INITIATED event is emitted");
      steps.push("2. Verify MERGE_STARTED and MERGE_COMPLETED events occur");
      steps.push("3. Ensure STORE_UPDATED event is emitted after merge");
      steps.push("4. Verify setComponentData is called with merged data");
      steps.push("5. Check store state to confirm data was saved");
    } else if (problem.includes("conflicts")) {
      steps.push("1. Review data sources and their priorities");
      steps.push("2. Identify conflicting values");
      steps.push("3. Adjust priorities or handle conflicts explicitly");
      steps.push("4. Re-run merge operation");
    } else if (problem.includes("priority")) {
      steps.push("1. Review current priority order");
      steps.push("2. Check priority values for each source");
      steps.push("3. Reorder merge sources to match priorities");
      steps.push("4. Verify merge order is correct");
    } else {
      steps.push("1. Review event timeline");
      steps.push("2. Check data flow history");
      steps.push("3. Analyze store snapshots");
      steps.push("4. Identify missing or unexpected events");
    }

    return steps;
  }
}

// Export singleton instance
export const problemDiagnoser = new ProblemDiagnoser();
