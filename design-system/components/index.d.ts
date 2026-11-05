// Epoch — component types. Documentation for consumers: every component is a plain function
// returning an HTMLElement; mount it with `container.appendChild(Epoch.X(props))`.

export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'stopped' | 'draft';
export type NodeKind = 'prompt' | 'llm' | 'tool' | 'retriever' | 'parser' | 'memory';

export interface ButtonProps {
  /** Visible label. Korean verb phrase, e.g. "학습 시작". */
  label: string;
  /** primary = one per screen; secondary = default; ghost = inline; danger = stop/delete. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Heights from the size tokens: sm 28px, md 32px, lg 40px. */
  size?: 'sm' | 'md' | 'lg';
  /** A one-character mono glyph before the label (▶ ■ ✓). Never an emoji. */
  glyph?: string;
  disabled?: boolean;
  /** Shows a spinner and disables the button; keep the label. */
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: (e: MouseEvent) => void;
}
export declare function Button(props: ButtonProps): HTMLButtonElement;

export interface StatusChipProps {
  status: RunStatus;
  /** Overrides the default word (ko: 대기/실행 중/완료/실패/중지/초안). */
  label?: string;
  lang?: 'ko' | 'en';
  className?: string;
}
export declare function StatusChip(props: StatusChipProps): HTMLSpanElement;

export interface MetricTileProps {
  /** e.g. "정확도", "검증 손실". */
  label: string;
  /** Preformatted value in the metric style; format it yourself (loss 4 decimals, lr as 1e-4). */
  value: string | number;
  unit?: string;
  /** Preformatted delta with its sign, e.g. "+0.0333". */
  delta?: string;
  /** Meaning of the delta, decided by the consumer: for loss, a drop is good. */
  deltaTone?: 'good' | 'bad' | 'neutral';
  /** Recent values for the sparkline (series-1). */
  series?: number[];
  note?: string;
  className?: string;
}
export declare function MetricTile(props: MetricTileProps): HTMLDivElement;

export interface EpochProgressProps {
  /** Current epoch, 1-based. */
  epoch: number;
  epochs: number;
  /** Current step within the epoch. */
  step?: number;
  steps?: number;
  status?: RunStatus;
  title?: string;
  loss?: string | number;
  acc?: string | number;
  lr?: string | number;
  /** hh:mm:ss */
  eta?: string;
  className?: string;
}
export declare function EpochProgress(props: EpochProgressProps): HTMLDivElement;

export interface LogLine { t?: string; level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'; msg: string }
export interface LogConsoleProps {
  lines: LogLine[];
  title?: string;
  status?: RunStatus;
  /** Max height in px before the body scrolls (default 160). */
  height?: number;
  /** Scroll to the last line on mount (default true). */
  follow?: boolean;
  className?: string;
}
export declare function LogConsole(props: LogConsoleProps): HTMLDivElement;

export interface ChainNodeProps {
  kind: NodeKind;
  /** Overrides the kind badge text (default ko: 프롬프트/LLM/도구/리트리버/파서/메모리). */
  kindLabel?: string;
  name: string;
  /** One mono line: model id, k, temperature, index name. */
  meta?: string;
  status?: RunStatus;
  selected?: boolean;
  /** Hide the left / right port. */
  input?: boolean;
  output?: boolean;
  className?: string;
  onSelect?: (e: MouseEvent) => void;
}
export declare function ChainNode(props: ChainNodeProps): HTMLDivElement;
/** Lays nodes (props or elements) in a row with an edge between each pair. */
export declare function chain(nodes: Array<ChainNodeProps | HTMLElement>): HTMLDivElement;
export declare function chainEdge(): HTMLSpanElement;

export interface CodeCellProps {
  /** code = Python cell with In/Out gutter; prompt = template with {variables} highlighted. */
  kind?: 'code' | 'prompt';
  index?: number | string;
  code: string;
  /** Rendered verbatim under the source in the Out row. */
  output?: string;
  status?: 'idle' | 'running' | 'done' | 'error';
  /** Optional header bar text and language tag. */
  title?: string;
  lang?: string;
  className?: string;
}
export declare function CodeCell(props: CodeCellProps): HTMLDivElement;

export interface ParamFieldProps {
  /** Korean label, e.g. "학습률". */
  label: string;
  /** The identifier as the code spells it, e.g. learning_rate. Shown in mono beside the label. */
  name?: string;
  value?: string | number;
  /** number renders a text input with a decimal keypad so "1e-4" stays typeable. */
  kind?: 'text' | 'number' | 'select';
  options?: Array<string | { value: string; label: string }>;
  unit?: string;
  placeholder?: string;
  hint?: string;
  /** Replaces the hint and marks the field invalid. */
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
}
export declare function ParamField(props: ParamFieldProps): HTMLDivElement;

export interface DataTableColumn {
  key: string;
  label?: string;
  /** num = right-aligned mono with tabular figures. */
  align?: 'text' | 'num';
  /** First column of a report (class names, model names) rendered as a row header. */
  rowHeader?: boolean;
  /** toFixed digits for numbers. */
  digits?: number;
  format?: (v: unknown) => string | Node;
  /** Colors the column's largest number primary. */
  highlightMax?: boolean;
}
export interface DataTableProps {
  columns: DataTableColumn[];
  rows: Array<Record<string, unknown>>;
  caption?: string;
  footer?: Record<string, unknown>;
  className?: string;
}
export declare function DataTable(props: DataTableProps): HTMLDivElement;

declare global {
  interface Window {
    Epoch: {
      Button: typeof Button; StatusChip: typeof StatusChip; MetricTile: typeof MetricTile;
      EpochProgress: typeof EpochProgress; LogConsole: typeof LogConsole; ChainNode: typeof ChainNode;
      CodeCell: typeof CodeCell; ParamField: typeof ParamField; DataTable: typeof DataTable;
      chain: typeof chain; chainEdge: typeof chainEdge;
    };
  }
}
