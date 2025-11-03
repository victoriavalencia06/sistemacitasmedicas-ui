// src/components/forms/ReusableForm.jsx
import { useState } from "react";

/**
 * props:
 *  - fields: [{ name, label, type, placeholder, options (for select) }]
 *  - onSubmit: fn(values)
 *  - submitText: string
 */
export default function ReusableForm({ fields = [], onSubmit, submitText = "Enviar" }) {
    const initial = fields.reduce((acc, f) => ({ ...acc, [f.name]: f.default || "" }), {});
    const [values, setValues] = useState(initial);

    function handleChange(e) {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(values);
    }

    return (
        <form onSubmit={handleSubmit} className="reusable-form" style={{ display: "grid", gap: 10, maxWidth: 640 }}>
            {fields.map(f => (
                <div key={f.name} className="form-row">
                    <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>{f.label}</label>

                    {f.type === "textarea" ? (
                        <textarea name={f.name} placeholder={f.placeholder || ""} value={values[f.name] || ""} onChange={handleChange} />
                    ) : f.type === "select" ? (
                        <select name={f.name} value={values[f.name] || ""} onChange={handleChange}>
                            {(f.options || []).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    ) : (
                        <input name={f.name} type={f.type || "text"} placeholder={f.placeholder || ""} value={values[f.name] || ""} onChange={handleChange} />
                    )}
                </div>
            ))}

            <div>
                <button className="btn-import" type="submit">{submitText}</button>
            </div>
        </form>
    );
}
