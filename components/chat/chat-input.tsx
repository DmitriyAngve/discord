"use client";

import { useForm } from "react-hook-form";
import * as z from "zod"; // зод для проверки схем данных из БД

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>; // этот тип имеет ключи как строки, а значения любого типа
  name: string;
  type: "conversation" | "channel"; // тут "conversation" тип нужен для чата 1 на 1, а "channel" нужен для общения на канале
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    // создаем экземпляр формы с использованием "react-hook-form". Это позволяет "react-hook-form" знать, какие поля ожидать и какие типы данных они должны иметь. Внутри тип "<z.infer<typeof formSchema>>", который извлекает тип данных из схемы "formSchema"
    resolver: zodResolver(formSchema), // "zodResolver" используется для проверки данных формы на основе схемы zod. Позволяет автоматически валидировать данные формы
    defaultValues: {
      // объект, определеяющий значения по умолчанию для полей формы
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting; // определяем, отправляется ли форма в данный момент.
  // form - это объект, представляющий форму, созданную при помощи useForm
  // formState - это часть объекта формы, которая хранит состояние формы и различные свойства формы
  // isSibmitting - это свойство определяет, выполняется ли в данный момент процесс отправки формы

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => }
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
