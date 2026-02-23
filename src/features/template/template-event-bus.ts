import { EventEmitter } from 'node:events';

import { injectable } from 'tsyringe';

/** Payload for upload progress SSE event. */
export interface TemplateProgressEvent {
  uploadId: string;
  percent: number;
}

/** Payload for attachment complete SSE event. */
export interface TemplateAttachmentCompleteEvent {
  key: string;
  name: string;
}

const EVENT_PROGRESS = 'progress';
const EVENT_ATTACHMENT_COMPLETE = 'attachmentComplete';

/**
 * In-memory event bus for template-related events (upload progress, attachment complete).
 * SSE endpoint subscribes per template id; services emit when client reports progress or completion.
 */
@injectable()
export class TemplateEventBus {
  private readonly emitter = new EventEmitter();

  /** Subscribe to events for a template (e.g. SSE handler). */
  on(templateId: string, listener: (event: { type: string; data: unknown }) => void): void {
    const progressHandler = (data: TemplateProgressEvent) =>
      listener({ type: EVENT_PROGRESS, data });
    const completeHandler = (data: TemplateAttachmentCompleteEvent) =>
      listener({ type: EVENT_ATTACHMENT_COMPLETE, data });
    this.emitter.on(channelProgress(templateId), progressHandler);
    this.emitter.on(channelComplete(templateId), completeHandler);
    // Store for cleanup (off when client disconnects)
    const cleanup = () => {
      this.emitter.off(channelProgress(templateId), progressHandler);
      this.emitter.off(channelComplete(templateId), completeHandler);
    };
    this.emitter.once(channelDisconnect(templateId), cleanup);
  }

  /** Remove listener when client disconnects (call from SSE on close). */
  off(templateId: string): void {
    this.emitter.emit(channelDisconnect(templateId));
  }

  emitProgress(templateId: string, uploadId: string, percent: number): void {
    this.emitter.emit(channelProgress(templateId), { uploadId, percent });
  }

  emitAttachmentComplete(templateId: string, key: string, name: string): void {
    this.emitter.emit(channelComplete(templateId), { key, name });
  }
}

function channelProgress(templateId: string): string {
  return `template:${templateId}:progress`;
}
function channelComplete(templateId: string): string {
  return `template:${templateId}:attachmentComplete`;
}
function channelDisconnect(templateId: string): string {
  return `template:${templateId}:disconnect`;
}
