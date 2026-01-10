"use client";

import React from "react";
import type { Customer, PipelineStage as PipelineStageType } from "@/types/crm";
import PipelineStage from "./pipeline-stage";
import MobileCustomersView from "./mobile-customers-view";

interface PipelineBoardProps {
  pipelineStages: PipelineStageType[];
  customersData: Customer[];
  filteredCustomers: Customer[];
  isDragging: boolean;
  draggedCustomer: Customer | null;
  dragOverStage: string | null;
  focusedCustomer: Customer | null;
  onDragStart: (e: any, customer: Customer) => void;
  onDragEnd: (e: any) => void;
  onDragOver: (e: any, stageId: string) => void;
  onDragLeave: (e: any, stageId: string) => void;
  onDrop: (e: any, stageId: string) => void;
  onKeyDown: (e: any, customer: Customer, stageId: string) => void;
  onViewDetails: (customer: Customer) => void;
  onAddNote: (customer: Customer) => void;
  onAddReminder: (customer: Customer) => void;
  onAddInteraction: (customer: Customer) => void;
  onUpdateCustomerStage: (
    customerId: string,
    stageId: string,
  ) => Promise<boolean>;
}

export default function PipelineBoard({
  pipelineStages,
  customersData,
  filteredCustomers,
  isDragging,
  draggedCustomer,
  dragOverStage,
  focusedCustomer,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onKeyDown,
  onViewDetails,
  onAddNote,
  onAddReminder,
  onAddInteraction,
  onUpdateCustomerStage,
}: PipelineBoardProps) {
  return (
    <div className="space-y-4">
      {/* Mobile View - Mobile Customers View */}
      <div className="block lg:hidden">
        <MobileCustomersView
          pipelineStages={pipelineStages}
          customersData={customersData}
          filteredCustomers={filteredCustomers}
          onViewDetails={onViewDetails}
          onAddNote={onAddNote}
          onAddReminder={onAddReminder}
          onAddInteraction={onAddInteraction}
          onUpdateCustomerStage={onUpdateCustomerStage}
        />
      </div>

      {/* Tablet View - 2 Columns */}
      <div className="hidden lg:block xl:hidden">
        <div className="grid grid-cols-2 gap-4 min-h-[600px]">
          {pipelineStages.map((stage) => (
            <PipelineStage
              key={stage.id}
              stage={stage}
              customers={customersData}
              filteredCustomers={filteredCustomers}
              isDragging={isDragging}
              draggedCustomer={draggedCustomer}
              dragOverStage={dragOverStage}
              focusedCustomer={focusedCustomer}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onKeyDown={onKeyDown}
              onViewDetails={onViewDetails}
              onAddNote={onAddNote}
              onAddReminder={onAddReminder}
              onAddInteraction={onAddInteraction}
              viewType="tablet"
            />
          ))}
        </div>
      </div>

      {/* Desktop View - Full Grid */}
      <div className="hidden xl:block">
        <div
          className={`grid gap-4 min-h-[600px] ${
            pipelineStages.length <= 3
              ? "grid-cols-3"
              : pipelineStages.length <= 4
                ? "grid-cols-4"
                : pipelineStages.length <= 6
                  ? "grid-cols-6"
                  : "grid-cols-6"
          }`}
        >
          {pipelineStages.map((stage) => (
            <PipelineStage
              key={stage.id}
              stage={stage}
              customers={customersData}
              filteredCustomers={filteredCustomers}
              isDragging={isDragging}
              draggedCustomer={draggedCustomer}
              dragOverStage={dragOverStage}
              focusedCustomer={focusedCustomer}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onKeyDown={onKeyDown}
              onViewDetails={onViewDetails}
              onAddNote={onAddNote}
              onAddReminder={onAddReminder}
              onAddInteraction={onAddInteraction}
              viewType="desktop"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
