import Nav from "../components/Nav";

export default function HomeLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="bg-secondary flex h-full w-full flex-grow flex-col items-center space-y-8 p-8">
        {children}
      </main>
    </>
  );
}
