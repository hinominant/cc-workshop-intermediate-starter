export interface EOSEvent {
  event_id: string;
  provider: string;
  type: string;
  payload: Record<string, unknown>;
  received_at: string;
  metadata?: Record<string, unknown>;
}

export interface ProcessingResult {
  event_id: string;
  status: "success" | "failure" | "skipped";
  actions: ActionResult[];
  processed_at: string;
  duration_ms: number;
}

export interface ActionResult {
  action: string;
  status: "success" | "failure";
  detail?: string;
}

export type EventHandler = (event: EOSEvent) => Promise<ProcessingResult>;
