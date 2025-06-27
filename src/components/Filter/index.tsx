import { Path, useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GiCancel } from "react-icons/gi";

interface Input<T> {
  label: Path<T>;
  type: string;
  options?: { label: string; value: string }[];
  placehold?: string;
}

interface FilterProps<T extends Record<string, unknown>> {
  onSubmit: (data: T) => void;
  inputs: Input<T>[];
}

const Filter = <T extends Record<string, unknown>>({
  onSubmit,
  inputs,
}: FilterProps<T>) => {
  const { register, handleSubmit, control } = useForm<T>();

  const renderInputs = () =>
    inputs.map((input) => {
      if (input.type === "date-range") {
        return (
          <div key={input.label as string} className="min-w-[300px] flex-1">
            <Controller
              name={input.label}
              control={control}
              render={({ field }) => {
                // field.value should be [startDate, endDate] or undefined
                const value = Array.isArray(field.value)
                  ? field.value
                  : [null, null];
                return (
                  <div className="w-full flex items-center relative">
                    <DatePicker
                      clearButtonClassName="!hidden"
                      selectsRange
                      startDate={value[0] ? new Date(value[0]) : null}
                      endDate={value[1] ? new Date(value[1]) : null}
                      onChange={(dates) => {
                        const [start, end] = dates as [
                          Date | null,
                          Date | null
                        ];
                        field.onChange([
                          start ? start.toISOString() : null,
                          end ? end.toISOString() : null,
                        ]);
                      }}
                      dateFormat="dd/MM/yyyy"
                      placeholderText={
                        !input.placehold
                          ? `Selecione o intervalo`
                          : input.placehold
                      }
                      isClearable
                      className="input focus:outline-0 placeholder:font-semibold w-full flex-1"
                    />
                    {(value[0] || value[1]) && (
                      <button
                        className="btn btn-circle text-neutral hover:text-error h-7 w-7 absolute right-2 top-1 mt-0.5"
                        type="button"
                        onClick={() => field.onChange([null, null])}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              }}
            />
          </div>
        );
      }

      if (input.type === "date") {
        return (
          <div key={input.label as string} className="min-w-[200px] flex-1">
            <Controller
              name={input.label}
              control={control}
              render={({ field }) => (
                <div className="w-full flex items-center relative">
                  <DatePicker
                    selected={
                      field.value ? new Date(field.value as string) : null
                    }
                    onChange={(date) => field.onChange(date?.toISOString())}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/aaaa"
                    id={input.label as string}
                    isClearable
                    clearButtonClassName="!hidden"
                    className="input focus:outline-0 placeholder:font-semibold w-full flex-1 "
                  />

                  {field.value && (
                    <button
                      className="btn btn-circle text-neutral hover:text-error   h-7 w-7   absolute right-2 top-1 mt-0.5"
                      type="button"
                      onClick={() => field.onChange(null)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            />
          </div>
        );
      }

      if (input.type === "select" && (input as any).options) {
        const options = (input as any).options as {
          label: string;
          value: string;
        }[];
        return (
          <div key={input.label as string} className="min-w-[200px] flex-1">
            <Controller
              name={input.label}
              control={control}
              render={({ field }) => (
                <select
                  className="input focus:outline-0 placeholder:font-semibold w-full"
                  id={input.label as string}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : field.value
                      ? String(field.value)
                      : ""
                  }
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                >
                  <option value="">
                    {!input.placehold
                      ? `Selecione a Empresa...`
                      : input.placehold}
                  </option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        );
      }

      if (input.type === "radio" && (input as any).options) {
        const options = (input as any).options as {
          label: string;
          value: string;
        }[];
        return (
          <div key={input.label as string}>
            <Controller
              name={input.label}
              control={control}
              render={({ field }) => (
                <div className="flex gap-4 w-full">
                  {options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 px-3 py-2 rounded border transition-colors cursor-pointer whitespace-nowrap
                  ${
                    field.value === opt.value
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-neutral-300 bg-white text-neutral-700"
                  }
                  `}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        checked={field.value === opt.value}
                        onChange={() => field.onChange(opt.value)}
                        name={field.name}
                        ref={field.ref}
                        className="accent-blue-500"
                      />
                      <span className="font-medium whitespace-nowrap">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>
        );
      }

      return (
        <div key={input.label as string} className="min-w-[200px] flex-1">
          <input
            className="input focus:outline-0 placeholder:font-semibold w-full"
            id={input.label as string}
            placeholder={input.label as string}
            type={input.type}
            {...register(input.label)}
          />
        </div>
      );
    });

  return (
    <div className="pb-6 w-full flex">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-wrap gap-4 w-full">
          {renderInputs()}
          <div className="flex gap-2 min-w-[200px]">
            <button
              className="btn btn-soft text-neutral h-[42px] min-w-[200px]"
              type="submit"
            >
              Submit
            </button>

            <button
              className="btn btn-warning"
              type="button"
              onClick={() => {
                // Limpa todos os campos do formulário e retorna os dados limpos
                const resetData = Object.fromEntries(
                  inputs.map((input) => [
                    input.label,
                    input.type === "date" ? null : "",
                  ])
                );
                // @ts-ignore
                control._reset(resetData);
                onSubmit(resetData as T);
              }}
            >
              <GiCancel className="h-5 w-5 text-neutral" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Filter;
