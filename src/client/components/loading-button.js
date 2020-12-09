import React, { useState } from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const StButton = styled(Button)`
  background-color: ${(props) => props.selected ? '#81c784' : 'white'};
  &:hover {
    background-color: ${(props) => props.selected ? '#679F6A' : 'lightgray'}
  }
  color: ${(props) => props.selected ? 'white' : 'black'};
  font-size: 12px;
`;

const RequestProgress = styled(CircularProgress)`
  color: #81c784;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

const LoadingButton = ({ onClick, selected = false, children, ...otherProps }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isLoading) {
      setIsLoading(true);
      await onClick();
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <StButton
        fullWidth={true}
        variant="outlined"
        selected={!isLoading && selected}
        disabled={isLoading}
        onClick={handleButtonClick}
        {...otherProps}
      >
        {children}
      </StButton>
      {isLoading && <RequestProgress size={24} />}
    </div>
  );
}

export default LoadingButton;
