"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required.",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});
// "formSchema" - это схема для валидации данных
// "z.object({})" - это метод "object" из библиотеки "zod", который создает объект с ожидаемой структурой и правилами валидации полей.
// "name: z.string().min(1, {})" - это описание поля "name". Тут указано, что оно должно быть строкой и иметь минимальную длину 1 символ. Если условия не выполняются - то выдается сообщение "Server name is required."
// "imageUrl: z.string().min(1, {})" - то же самое.

export const InitialModal = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  // "z.infer<typeof formSchema>" - это тип данных, который извлекается (инферируется) из схемы "formSchema", определенной с использованием библиотеки "zod".
  // Указание <typeof formSchema> здесь для того чтобы извлечь типа из значения, которое предоставляется formSchema

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* handleSubmit - это специальный метод React Hook Form. Используется для проксирования события отправки фрмы и выполнения всех проверок, валидаций и обработки, предост-ых React Hook Form. С его помощью связываю функцию "onSubmit" с библиотекой React Hook Form !!!Это для использования функциональности библиотеки - проверки валидации!!! */}
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                TODO: Image Uploads
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:secondary/70">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
