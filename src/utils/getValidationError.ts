// Erro dentro do Yup
import { ValidationError } from 'yup';

interface Errors {
  // Pode ser qualquer coisa desde que seja uma string, ou quantos eu quiser passar
  // Como estamos fazendo uma função que é mais geral, pode ser que eu passe mais campos ou menos campos dependendo do formulário
  // E não só nome, email e password
  [key: string]: string;
}

export default function getValidationErros(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  /**
   * Inner é um array de ValidationError, e dentro de cada um dos itens, temos que pegar o path, que é o input que deu erro e setar uma mensagem pra ele
   * ValidationError
      errors: (3) ["Nome obrigatório", "Email obrigatório", "No mínimo 06 dígitos"]
      inner: Array(3)
        0: ValidationError
        errors: ["Nome obrigatório"]
        inner: []
        message: "Nome obrigatório"
        name: "ValidationError"
        params: {path: "name", value: "", originalValue: "", label: undefined}
        path: "name"
        type: "required"
        value: ""
   */
  err.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  });

  // console.log(validationErrors);

  return validationErrors;
}
