import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="">
      <p className="text-3xl font-bold text-indigo-500">Hello Discord Clone!</p>
      <Button>Click me</Button>
    </div>
  );
}
//  <Button className={cn("bg-indigo-500", state && "bg-red-500")}>Click me</Button> - if state is true, then bg-red-500
