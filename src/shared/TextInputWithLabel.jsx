import styled from 'styled-components';

const Wrapper = styled.form`
  padding: 10px;
`;

function TextInputWithLabel({ elementId, ref, onChange, value, label }) {
  return (
    <Wrapper>
      {label && <label htmlFor={elementId}>{label}</label>}
      <input
        type="text"
        id={elementId}
        value={value}
        ref={ref}
        onChange={onChange}
        style={{ margin: '0' }}
      />
    </Wrapper>
  );
}

export default TextInputWithLabel;
