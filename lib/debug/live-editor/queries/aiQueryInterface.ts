/**
 * AI Query Interface
 * Main interface for AI to query debug data
 */

import { AIQueryResult, ParsedQuestion, EventType } from "../core/types";
import { fileReader } from "../utils/fileReader";
import { eventSearcher } from "./eventSearcher";
import { componentTracer } from "./componentTracer";
import { problemDiagnoser } from "./problemDiagnoser";
import { exportByQuery } from "../utils/exportForAI";

class AIQueryInterface {
  /**
   * Main query method
   */
  async query(question: string): Promise<AIQueryResult> {
    // Parse question to extract information
    const parsed = this.parseQuestion(question);

    // Search events based on parsed question
    const events = await eventSearcher.search({
      componentId: parsed.componentId,
      componentType: parsed.componentType,
      variant: parsed.variant,
      eventType: parsed.eventType,
      fieldPath: parsed.fieldPath,
      timeRange: parsed.timeRange,
    });

    // Get component trace if componentId exists
    const trace =
      parsed.componentId && parsed.componentType
        ? await componentTracer.trace(parsed.componentId, parsed.componentType)
        : null;

    // Get store snapshots
    const snapshots = parsed.componentId
      ? await fileReader.getStoreSnapshots({
          componentId: parsed.componentId,
          componentType: parsed.componentType,
          date: parsed.date,
        })
      : [];

    // Get data flow
    const dataFlow =
      parsed.componentId && parsed.componentType
        ? await fileReader.getDataFlow({
            componentId: parsed.componentId,
            componentType: parsed.componentType,
            date: parsed.date,
          })
        : null;

    // Diagnose problem
    const diagnosis = await problemDiagnoser.diagnose({
      question,
      events,
      trace,
      snapshots,
      dataFlow: Array.isArray(dataFlow) ? dataFlow : null,
    });

    // Generate result
    const result: AIQueryResult = {
      question,
      parsed,
      events,
      trace,
      snapshots,
      dataFlow: Array.isArray(dataFlow) ? dataFlow : null,
      diagnosis,
      summary: this.generateSummary(events, trace, diagnosis),
    };

    // Export query result
    await exportByQuery(question, result);

    return result;
  }

  /**
   * Parse question to extract filters
   */
  private parseQuestion(question: string): ParsedQuestion {
    const parsed: ParsedQuestion = {};

    // Extract component info
    const componentMatch = question.match(/(hero|header|footer|halfTextHalfImage|testimonials|contactCards|features|pricing|faq|cta|gallery|blog|products|navbar|sidebar|breadcrumb|searchBar|filterBar|map|video|audio|image|text|button|link|icon|badge|card|modal|tooltip|popover|dropdown|accordion|tabs|slider|carousel|timeline|table|form|input|textarea|select|checkbox|radio|switch|datepicker|timepicker|colorpicker|fileupload|rating|progress|spinner|skeleton|alert|notification|toast|banner|divider|spacer|container|grid|flex|stack|box|section|article|aside|nav|main|header|footer)\s*(\d+)?/i);
    if (componentMatch) {
      parsed.componentType = componentMatch[1].toLowerCase();
      if (componentMatch[2]) {
        parsed.variant = `${parsed.componentType}${componentMatch[2]}`;
      }
    }

    // Extract field info
    const fieldMatch = question.match(/(title|subtitle|image|enabled|background|content|searchForm|font|alignment|maxWidth|position|offset|color|opacity|shadow|border|borderRadius|placeholder|options|default|icon|value|label|text|href|target|size|weight|family|desktop|tablet|mobile|height|minHeight|width|minWidth|padding|margin|gap|direction|wrap|justify|align|order|grow|shrink|basis|overflow|display|visibility|opacity|zIndex|transform|transition|animation|cursor|pointerEvents|userSelect|resize|outline|boxShadow|textShadow|borderRadius|borderWidth|borderStyle|borderColor|backgroundColor|color|fontSize|fontWeight|fontFamily|lineHeight|letterSpacing|textAlign|textDecoration|textTransform|whiteSpace|wordWrap|wordBreak|textOverflow|listStyle|listStyleType|listStylePosition|listStyleImage|tableLayout|borderCollapse|borderSpacing|captionSide|emptyCells|verticalAlign|direction|unicodeBidi|writingMode|textOrientation|textIndent|textShadow|textDecorationLine|textDecorationColor|textDecorationStyle|textDecorationThickness|textUnderlineOffset|textUnderlinePosition|textEmphasis|textEmphasisColor|textEmphasisStyle|textEmphasisPosition|textCombineUpright|textSizeAdjust|fontVariant|fontStretch|fontKerning|fontFeatureSettings|fontVariationSettings|fontDisplay|fontSynthesis|fontSmoothing|fontRendering|fontVariantLigatures|fontVariantCaps|fontVariantNumeric|fontVariantEastAsian|fontVariantAlternates|fontVariantPosition|fontVariantEmoji|fontPalette|fontOpticalSizing|fontVariationSettings|fontDisplay|fontSynthesis|fontSmoothing|fontRendering|fontVariantLigatures|fontVariantCaps|fontVariantNumeric|fontVariantEastAsian|fontVariantAlternates|fontVariantPosition|fontVariantEmoji|fontPalette|fontOpticalSizing)/i);
    if (fieldMatch) {
      parsed.fieldPath = fieldMatch[1];
    }

    // Extract event type
    const eventTypeMap: Record<string, EventType> = {
      save: "SAVE_INITIATED",
      update: "FIELD_UPDATED",
      render: "COMPONENT_RENDERED",
      merge: "MERGE_STARTED",
      opened: "LIVE_EDITOR_OPENED",
      closed: "SIDEBAR_CLOSED",
    };

    const eventTypeMatch = question.match(/(save|update|render|merge|opened|closed)/i);
    if (eventTypeMatch) {
      parsed.eventType = eventTypeMap[eventTypeMatch[1].toLowerCase()];
    }

    // Extract date
    const dateMatch = question.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      parsed.date = dateMatch[1];
    }

    return parsed;
  }

  /**
   * Generate AI-friendly summary
   */
  private generateSummary(events: any[], trace: any, diagnosis: any): string {
    return `Based on ${events.length} events${trace ? " and component trace" : ""}, the issue is: ${diagnosis.problem}. Root cause: ${diagnosis.rootCause}. Solution: ${diagnosis.solution}`;
  }
}

// Export singleton instance
export const aiQueryInterface = new AIQueryInterface();
