"use client";
import { Footer } from "./../../components/footer";
import HomeNavbar from "./../../components/HomeHeader";
import { Hero } from "./../main-section-landing-page";
import { useAppContext } from "./../../context-provider/context_Provider";
import MainSection from "./main_section";
export default function LandingPage() {
  return (
    <>
      <header>
        {/* <nav className=""></nav> */}
        <HomeNavbar />
      </header>
      <section className="h-[98vh] sm:h-[90vh]">
        <article className="h-full">
          {/* <div> This is the Home page</div> */}
          {/* <Hero/> */}
          <MainSection />
        </article>
      </section>
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
}
