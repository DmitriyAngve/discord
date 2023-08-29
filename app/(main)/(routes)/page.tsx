import { UserButton } from "@clerk/nextjs/app-beta";

export default function Home() {
  return <UserButton afterSignOutUrl="/" />;
}
