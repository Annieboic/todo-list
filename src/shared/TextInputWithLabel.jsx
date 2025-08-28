function TextInputWithLabel({ elementId, ref, onChange, value, label }) {
  return (
    <>
      <label htmlFor={elementId}>{label}</label>
      <input
        type="text"
        id={elementId}
        value={value}
        ref={ref}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
