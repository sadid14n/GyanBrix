import { useState } from "react";
import { X } from "lucide-react";

const QuestionEditModal = ({ question, onClose, onSave }) => {
  const [form, setForm] = useState({
    question: question.question || "",
    options: question.options || ["", "", "", ""],
    correctIndex: question.correctIndex || 0,
    explanation: question.explanation || "",
    difficulty: question.difficulty || "medium",
    marks: question.marks || 1,
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateOption = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm((prev) => ({ ...prev, options: updated }));
  };

  const handleSubmit = () => {
    if (!form.question.trim()) return alert("Question cannot be empty");

    for (const opt of form.options)
      if (!opt.trim()) return alert("Options cannot be empty");

    if (
      typeof form.correctIndex !== "number" ||
      form.correctIndex < 0 ||
      form.correctIndex > form.options.length - 1
    )
      return alert("Select correct option");

    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
      <div className="bg-surface p-6 rounded-lg w-full max-w-2xl space-y-4 shadow-xl relative">
        <button
          className="absolute top-3 right-3 text-text-subtle hover:text-error"
          onClick={onClose}
        >
          <X />
        </button>

        <h2 className="text-lg font-heading font-semibold text-text-heading">
          Edit Question
        </h2>

        {/* Question */}
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <textarea
            className="admin-input min-h-[80px]"
            value={form.question}
            onChange={(e) => updateField("question", e.target.value)}
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {form.options.map((opt, index) => (
            <div key={index}>
              <label className="block text-sm mb-1">Option {index + 1}</label>
              <input
                type="text"
                className="admin-input"
                value={opt}
                onChange={(e) => updateOption(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Correct option / difficulty / marks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Correct Option</label>
            <select
              className="admin-input"
              value={form.correctIndex}
              onChange={(e) =>
                updateField("correctIndex", Number(e.target.value))
              }
            >
              {form.options.map((_, i) => (
                <option key={i} value={i}>
                  Option {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Difficulty</label>
            <select
              className="admin-input"
              value={form.difficulty}
              onChange={(e) => updateField("difficulty", e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Marks</label>
            <input
              type="number"
              min={1}
              className="admin-input"
              value={form.marks}
              onChange={(e) => updateField("marks", Number(e.target.value))}
            />
          </div>
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm mb-1">Explanation</label>
          <textarea
            className="admin-input min-h-[60px]"
            value={form.explanation}
            onChange={(e) => updateField("explanation", e.target.value)}
          />
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="admin-button-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="admin-button-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditModal;
