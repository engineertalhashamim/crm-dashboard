const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'transparent',
    '& fieldset': {
      borderColor: '#E0E3E7'
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#EDE7F6',
      boxShadow: 'none'
    }
  },
  '& .MuiInputLabel-root': {
    color: '#6f7e8c'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#5e35b1'
  },

  // Autofill fix for Chrome
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
    WebkitTextFillColor: '#000000 !important',
    transition: 'background-color 5000s ease-in-out 0s !important',
    animation: 'onAutofillStart 0s forwards'
  },
  '& input:-webkit-autofill:focus': {
    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
    WebkitTextFillColor: '#000000 !important'
  },
  '& input:-internal-autofill-selected': {
    backgroundColor: 'transparent !important',
    color: 'inherit !important'
  },

  // Optional: handle selects
  '& .MuiSelect-select:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px #ffffff inset !important',
    WebkitTextFillColor: '#000000 !important'
  },

  // Trigger animation to repaint autofill background
  '@keyframes onAutofillStart': {
    from: {},
    to: { color: '#000000', background: '#ffffff' }
  }
};

export { inputStyle };
