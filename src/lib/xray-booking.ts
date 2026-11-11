export const CALL_PURPOSES = [
  { value: "visibility", label: "Get seen" },
  { value: "conversion", label: "Turn attention into clients" },
  { value: "engine", label: "Build the engine" },
  { value: "review", label: "Review my Client X-Ray" },
] as const;

export type CallPurpose = typeof CALL_PURPOSES[number]["value"];
export function callPurposeLabel(value: string | undefined) {
  return CALL_PURPOSES.find(purpose => purpose.value === value)?.label;
}