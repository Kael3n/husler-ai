import Head from "next/head";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout({ children, title = "HustleFinder AI" }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <Head>
        <title>{title}</title>
      </Head>
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
