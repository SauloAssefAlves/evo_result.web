// Remove todos os caracteres que não sejam dígitos

export function telefoneFormater(telefone: string) {
  let formattedPhone = telefone.replace(/\D/g, "");

  // Verifica se o telefone tem o DDD e o número
  if (formattedPhone.length === 13) {
    // Formato: +55 (DDD) 9 NÚMERO
    formattedPhone = formattedPhone.replace(
      /^(\d{2})(\d{2})(\d{1})(\d{4})(\d{4})$/,
      "+$1 ($2) $3 $4$5"
    );
  } else if (formattedPhone.length === 12) {
    // Formato: +55 (DDD) NÚMERO (8 dígitos)
    formattedPhone = formattedPhone.replace(
      /^(\d{2})(\d{2})(\d{4})(\d{4})$/,
      "+$1 ($2) $3$4"
    );
  } else if (formattedPhone.length === 11) {
    // Formato: (DDD) 9 NÚMERO
    formattedPhone = formattedPhone.replace(
      /^(\d{2})(\d{1})(\d{4})(\d{4})$/,
      "($1) $2 $3$4"
    );
  } else if (formattedPhone.length === 10) {
    // Formato: (DDD) NÚMERO (8 dígitos)
    formattedPhone = formattedPhone.replace(
      /^(\d{2})(\d{4})(\d{4})$/,
      "($1) $2$3"
    );
  }
  return formattedPhone;
}

export function telefoneFormaterWithoutMask(telefone: string) {
  return telefone.replace(/\D/g, "");
}
