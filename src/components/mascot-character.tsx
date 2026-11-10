import original from "@/assets/dr-dan-guide.png.asset.json";
import wave from "@/assets/mascot-wave.png";
import thinking from "@/assets/mascot-thinking.png";
import diagnosing from "@/assets/mascot-examining.png";
import explaining from "@/assets/mascot-findings.png";
import celebrating from "@/assets/mascot-celebrating.png";
import encouraging from "@/assets/mascot-positive.png";

export type CharacterState = "welcome" | "thinking" | "explaining" | "diagnosing" | "celebrating" | "encouraging" | "booking";
const poses: Record<CharacterState, string> = { welcome: wave, thinking, explaining, diagnosing, celebrating, encouraging, booking: original.url };

export function MascotCharacter({ state = "welcome" }: { state?: CharacterState }) {
  return <div className={`companion-character character-${state}`} aria-hidden="true">
    <img key={state} src={poses[state]} width={768} height={768} alt="" draggable={false} />
    {state === "thinking" && <span className="character-question">?</span>}
    {state === "diagnosing" && <span className="character-scan" />}
  </div>;
}