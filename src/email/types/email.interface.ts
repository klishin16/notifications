export interface IEmail {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
  readonly template?: string;
  readonly templateData?: Record<string, any>;
  readonly attachments?: { filename: string; path: string }[];
}
