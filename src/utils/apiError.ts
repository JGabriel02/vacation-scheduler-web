import axios from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: string;
  errors?: Record<string, string> | string[];
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Ocorreu um erro inesperado. Tente novamente.";
  }

  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "A API demorou para responder. Ela pode estar inicializando.";
    }

    return "Não foi possível conectar ao servidor. Verifique sua conexão.";
  }

  const status = error.response.status;
  const data = error.response.data;

  if (data?.message) {
    return data.message;
  }

  if (data?.details) {
    return data.details;
  }

  if (data?.error && typeof data.error === "string") {
    return data.error;
  }

  if (data?.errors) {
    if (Array.isArray(data.errors)) {
      return data.errors.join(" ");
    }

    const messages = Object.values(data.errors);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  const messages: Record<number, string> = {
    400: "Verifique os dados informados e tente novamente.",
    401: "E-mail, senha ou sessão inválidos.",
    403: "Você não possui permissão para realizar esta ação.",
    404: "O recurso solicitado não foi encontrado.",
    409: "Já existe um registro com esses dados.",
    422: "Os dados informados não puderam ser processados.",
    500: "O servidor encontrou um problema. Tente novamente mais tarde.",
    502: "A API está temporariamente indisponível.",
    503: "O serviço está inicializando. Aguarde alguns segundos.",
  };

  return (
    messages[status] ??
    "Não foi possível concluir a operação. Tente novamente."
  );
}