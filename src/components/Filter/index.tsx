import React from "react";
import { Path, useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Input<T> {
  label: Path<T>;
  type: string;
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

  const renderInputs = () => {
    return inputs.map((input) => {
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
  };

  return (
    <div className="pb-6 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-wrap gap-4">
          {renderInputs()}
          <div className="min-w-[200px] flex-1">
            <button
              className="btn btn-soft text-neutral w-full h-[42px]"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Filter;
