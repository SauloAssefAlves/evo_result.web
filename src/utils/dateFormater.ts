export function formatDateWithTimezone(data_criacao: string | number | Date) {
  // Cria um objeto Date e adiciona 3 horas
  const data = new Date(data_criacao);
  data.setHours(data.getHours() + 3);

  // Formata a data no padrão brasileiro
  const dataFormatada = data.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Formata a hora no padrão brasileiro (24h)
  const horaFormatada = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Retorna no formato "dd/mm/aaaa hh:mm +0300"
  return `${dataFormatada} ${horaFormatada}`;
}

export function formatDateWithoutTimezone(
  data_criacao: string | number | Date
) {
  if (!data_criacao) {
    return null; // Retorna a menor data possível se o valor for inválido
  }
  // Cria um objeto Date
  const data = new Date(data_criacao);

  // Formata a data no padrão brasileiro
  const dataFormatada = data.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Formata a hora no padrão brasileiro (24h)
  const horaFormatada = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Retorna no formato "dd/mm/aaaa hh:mm"
  return `${dataFormatada} ${horaFormatada}`;
}
