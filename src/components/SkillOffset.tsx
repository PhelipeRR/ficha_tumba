import React from "react";

interface SkillOffsetProps {
  value: number;
  onChange: (delta: number) => void;
}

const SkillOffset: React.FC<SkillOffsetProps> = ({ value, onChange }) => {
  return (
    <div className="offset-controls">
      <button
        type="button"
        onClick={() => onChange(-1)}
      >
        -
      </button>

      <span className="offset">{value}</span>

      <button
        type="button"
        onClick={() => onChange(1)}
      >
        +
      </button>
    </div>
  );
};

export default SkillOffset;
