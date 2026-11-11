/** Reset only this browser's active assessment; saved Cloud records stay intact. */
export function restartXray() {
  localStorage.removeItem("client-xray-diagnosis");
  localStorage.removeItem("client-xray-v2");
}