// Exemplo de como usar a tabela com diferentes tipos de ordenação

import Table from "./index";

// Exemplo de dados
const exemploData = [
  {
    nome: "João Silva",
    idade: 25,
    datacadastro: "15/01/2023",
    ultimoacesso: "15/01/2023 14:30",
    ativo: true,
    salario: 5000.5,
  },
  {
    nome: "Maria Santos",
    idade: 30,
    datacadastro: "10/12/2022",
    ultimoacesso: "10/12/2022 09:15",
    ativo: false,
    salario: 7500.0,
  },
  {
    nome: "Pedro Costa",
    idade: 22,
    datacadastro: "20/03/2024",
    ultimoacesso: "20/03/2024 18:45",
    ativo: true,
    salario: 3200.75,
  },
  {
    nome: "Ana Costa",
    idade: 28,
    datacadastro: "15/07/2025",
    ultimoacesso: "15/07/2025 08:11",
    ativo: true,
    salario: 4200.0,
  },
  {
    nome: "Carlos Silva",
    idade: 35,
    datacadastro: null, // Valor null será tratado como menor data
    ultimoacesso: null, // Valor null será tratado como menor data/hora
    ativo: false,
    salario: 3800.0,
  },
  {
    nome: "Lucia Pereira",
    idade: 27,
    datacadastro: "", // String vazia também será tratada como menor data
    ultimoacesso: "", // String vazia também será tratada como menor data/hora
    ativo: true,
    salario: 5200.0,
  },
];

// Exemplo de configuração de colunas com tipos de ordenação
const exemploColumns = [
  // Coluna simples (ordenação alfabética padrão)
  "Nome",

  // Colunas com tipos específicos
  { name: "Idade", sortType: "number" as const },
  { name: "Data Cadastro", sortType: "date" as const },
  { name: "Último Acesso", sortType: "datetime" as const },
  { name: "Ativo", sortType: "boolean" as const },
  { name: "Salário", sortType: "number" as const },

  // Coluna sem ordenação
  { name: "Ações", sortable: false },
];

export default function ExemploTabela() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Exemplo de Tabela com Tipos de Ordenação
      </h2>
      <Table columns={exemploColumns} data={exemploData} />

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Tipos de Ordenação Disponíveis:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>string</strong> (padrão): Ordenação alfabética
          </li>
          <li>
            <strong>number</strong>: Ordenação numérica
          </li>
          <li>
            <strong>date</strong>: Ordenação por data (ignora hora)
          </li>
          <li>
            <strong>datetime</strong>: Ordenação por data e hora completa
          </li>
          <li>
            <strong>boolean</strong>: Ordenação booleana (false antes de true)
          </li>
        </ul>

        <h3 className="font-bold mt-4 mb-2">Controle de Ordenação:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>sortable: true</strong> (padrão): Coluna ordenável com
            ícones de sort
          </li>
          <li>
            <strong>sortable: false</strong>: Coluna não ordenável (sem ícone,
            sem clique)
          </li>
        </ul>

        <h3 className="font-bold mt-4 mb-2">Como usar:</h3>
        <pre className="bg-gray-800 text-white p-2 rounded text-sm overflow-x-auto">
          {`// Coluna simples (string por padrão)
"Nome da Coluna"

// Coluna com tipo específico
{ name: "Nome da Coluna", sortType: "number" }

// Coluna sem ordenação
{ name: "Ações", sortable: false }

// Exemplo completo
const columns = [
  "Nome",
  { name: "Idade", sortType: "number" },
  { name: "Data", sortType: "date" },
  { name: "Data e Hora", sortType: "datetime" },
  { name: "Ativo", sortType: "boolean" },
  { name: "Ações", sortable: false }
];`}
        </pre>

        <h3 className="font-bold mt-4 mb-2">
          Diferença entre Date e DateTime:
        </h3>
        <div className="bg-blue-50 p-3 rounded mb-4">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <strong>date</strong>: Compara apenas a data, ignorando a hora
              <br />
              <span className="text-gray-600">
                Exemplo: "2023-01-15" e "2023-01-15T14:30:00" são considerados
                iguais
              </span>
            </li>
            <li>
              <strong>datetime</strong>: Compara data e hora completa
              <br />
              <span className="text-gray-600">
                Exemplo: "2023-01-15T14:30:00" vem antes de
                "2023-01-15T18:45:15"
              </span>
            </li>
          </ul>
        </div>

        <h3 className="font-bold mt-4 mb-2">Formatos de Data Aceitos:</h3>
        <div className="bg-green-50 p-3 rounded mb-4">
          <div className="text-sm space-y-1">
            <p>
              <strong>Para sortType: "date":</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>"15/07/2025" (formato brasileiro)</li>
              <li>"15-07-2025" (com traços)</li>
              <li>"2025-07-15" (formato ISO)</li>
              <li>"July 15, 2025" (formato extenso)</li>
            </ul>

            <p className="mt-3">
              <strong>Para sortType: "datetime":</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>"15/07/2025 08:11" (brasileiro com hora)</li>
              <li>"15/07/2025 08:11:30" (com segundos)</li>
              <li>"15-07-2025 08:11" (traços com hora)</li>
              <li>"2025-07-15T08:11:00" (formato ISO)</li>
              <li>"2025-07-15 08:11:00" (ISO com espaço)</li>
            </ul>

            <p className="mt-2 text-blue-600 font-medium">
              ✅ Agora suporta formato brasileiro: dd/mm/yyyy hh:mm
            </p>
          </div>
        </div>

        <h3 className="font-bold mt-4 mb-2">
          Tratamento de Valores Null/Vazios:
        </h3>
        <div className="bg-yellow-50 p-3 rounded mb-4">
          <div className="text-sm space-y-1">
            <p>
              <strong>Para date e datetime:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <code>null</code> → Tratado como menor data (1970-01-01)
              </li>
              <li>
                <code>undefined</code> → Tratado como menor data (1970-01-01)
              </li>
              <li>
                <code>""</code> (string vazia) → Tratado como menor data
                (1970-01-01)
              </li>
            </ul>
            <p className="mt-2 text-orange-600 font-medium">
              📝 Valores null aparecerão sempre no início da ordenação crescente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
