import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  // Retornando um sistema inteiro de rotas para caso o usuário esteja logado
  // Quando o usuário logar, o contexto vai ser importante para repetir essa informação pros componentes
  // que dependem dele, inclusive o de rotas e com essa informação setada, as rotas desviam o usuário
  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
