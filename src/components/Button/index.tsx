import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  // Obrigando o uso do children
  children: string;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container {...rest}>
    {/* Todo texto no ReactNative precisa de uma tag text */}
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
