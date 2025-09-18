import styled from 'styled-components';

const StyledForm = styled.form`
  padding: 10px;
`;

function TextInputWithLabel({ elementId, ref, onChange, value, label }) {
  return (
    <>
      <StyledForm>
        <label htmlFor={elementId}>{label}</label>
        <input
          type="text"
          id={elementId}
          value={value}
          ref={ref}
          onChange={onChange}
          style={{ margin: '0' }}
        />
      </StyledForm>
    </>
  );
}

export default TextInputWithLabel;
