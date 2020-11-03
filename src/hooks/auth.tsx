import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>; // Passando um método na interface
  signOut(): void;
  updateUser(user: User): Promise<void>;
}

// Hackzinho, burlar a tipagem do typescript e deixar inicializar o objeto vazio
// Motivo: o usuário pode não estar logado, então tem que estar vazio mesmo
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  // Essa lógica para pegar o usuário e o token do LocalStorage só vai executar quando o usuário abrir ou recarregar a página
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  // Como não podemos utilizar o Async dentro do useState, devemos criar um hook de useEffect para buscar
  // as informações no storage que no caso do mobile são assincronas
  useEffect(() => {
    // useEffect não permite ser uma função async, por isso devemos criar uma outra dentro do escopo dele
    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      /**
       * O mutiGet retorna um array de array, onde no segundo array a primeira posição é a chave
       * e a segunda posição o valor
       * portanto [[Chave0, Valor0], [Chave1, Valor1]]
       */
      if (token[1] && user[1]) {
        // Como o stringfy foi usado, preciso retornar para objeto
        setData({ token: token[1], user: JSON.parse(user[1]) });

        // Enviando o token para as rotas autenticadas
        api.defaults.headers.authorization = `Bearer ${token[1]}`;
      }

      setLoading(false);
    }

    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);
    // O user é um objeto, mas para salvar no AsyncStorage preciso que ele fique como string

    // Enviando o token para as rotas autenticadas
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    // Setando como vazio novamente, ou seja não tem nenhum usuário logado
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, loading, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook para autenticação
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  // Caso o componente que está tentando acessar não esteja no escopo do contexto
  // Um erro será disparado
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
