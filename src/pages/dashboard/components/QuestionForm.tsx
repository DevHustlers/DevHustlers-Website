import { useState } from "react";
import { Check } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { FieldSelect } from "./ui/FieldSelect";
import { PrimaryBtn } from "./ui/PrimaryBtn";
import { SecondaryBtn } from "./ui/SecondaryBtn";

import { CompetitionQuestion } from "@/types/competition";

// ─── Question Form Component ───
export const QuestionForm = ({
  onAdd,
  onCancel,
  defaultTimeLimit = 15,
}: {
  onAdd: (q: CompetitionQuestion) => void;
  onCancel: () => void;
  defaultTimeLimit?: number;
}) => {
  const [type, setType] = useState<CompetitionQuestion["type"]>("mcq");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [modelAnswer, setModelAnswer] = useState("");
  const [timeLimit, setTimeLimit] = useState(defaultTimeLimit);
  const [points, setPoints] = useState(100);

  const canAdd = type === "mcq" ? (question.trim() && options.every(o => o.trim())) : (question.trim() && (type !== 'text' || modelAnswer.trim()));

  return (
    <div className="p-4 bg-accent/20 space-y-3 border-t border-border">
      <div>
        <FieldLabel>Question</FieldLabel>
        <FieldInput value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter question..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Question Type</FieldLabel>
          <FieldSelect 
            value={type} 
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="mcq">Multiple Choice (MCQ)</option>
            <option value="text">Open-Ended (Manual Review)</option>
            <option value="code">Code Challenge</option>
          </FieldSelect>
        </div>
        <div>
          <FieldLabel>Points</FieldLabel>
          <FieldInput type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={10} />
        </div>
      </div>

      {type === "mcq" ? (
        <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => setCorrectIdx(i)}
                className={`w-7 h-7 shrink-0 flex items-center justify-center border text-[11px] font-mono font-bold transition-colors ${
                  correctIdx === i
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-border text-muted-foreground hover:border-foreground/40"
                }`}
              >
                {["A", "B", "C", "D"][i]}
              </button>
              <FieldInput
                value={opt}
                onChange={e => {
                  const u = [...options];
                  u[i] = e.target.value;
                  setOptions(u);
                }}
                placeholder={`Option ${["A", "B", "C", "D"][i]}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
          <div>
            <FieldLabel>Model Target Sequence / Correct Answer</FieldLabel>
            <FieldInput 
              value={modelAnswer} 
              onChange={e => setModelAnswer(e.target.value)} 
              placeholder="Enter the expected official solve..." 
            />
          </div>
          <p className="text-[11px] text-primary/70 font-medium flex items-center gap-2 bg-primary/5 p-3 rounded-lg border border-primary/10">
            <Check className="w-4 h-4" /> This solve will require match authority verification during the live session.
          </p>
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="w-32">
          <FieldLabel>Time (s)</FieldLabel>
          <FieldInput type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} min={5} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-4">Click A/B/C/D to mark correct answer (green = correct)</p>
      </div>
      <div className="flex items-center gap-2">
        <PrimaryBtn onClick={() => { if (canAdd) onAdd({ id: Date.now(), question, options: type === "mcq" ? [...options] : [], correctIndex: type === "mcq" ? correctIdx : -1, modelAnswer: type === 'mcq' ? options[correctIdx] : modelAnswer, timeLimit, type, points }); }} disabled={!canAdd}>
          <Check className="w-4 h-4" /> Add Round Solve
        </PrimaryBtn>
        <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
      </div>
    </div>
  );
};
