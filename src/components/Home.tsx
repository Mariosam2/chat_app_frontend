import "./Home.css";
import previewImg from "../assets/preview.webp";
import logo from "../assets/logo.png";
import kansasLogo from "../assets/kansas.svg";
import flashLogo from "../assets/flash.svg";
import savannahLogo from "../assets/savannah.svg";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  UserGroupIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";

import {
  MapPinIcon,
  AtSymbolIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import NetworkSVG from "./NetworkSVG";
import Nav from "./Nav";
import { NavLink } from "react-router";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const Home = () => {
  useGSAP(() => {
    ScrollSmoother.create({
      wrapper: "#root",
      content: ".home",
    });

    gsap.fromTo(
      ".jumbo .preview",
      { y: 20 },
      {
        y: 100,
        scrollTrigger: {
          trigger: ".jumbo .preview",
          start: "bottom bottom",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      ".sponsor",
      { x: -20, opacity: 0 },
      {
        duration: 0.35,
        x: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: ".features-content",
          start: "center bottom",
        },
      }
    );

    gsap.fromTo(
      '.features-content > [class^="features"]:not(.feature)',
      { y: 20, opacity: 0 },
      {
        duration: 0.35,
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: ".features-content",
          start: "center bottom",
        },
      }
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".feature-container",
        start: "top bottom",
      },
    });
    tl.fromTo(
      ".feature#first",
      { y: 50, opacity: 0 },
      {
        y: 0,
        delay: 0.2,
        opacity: 1,
        duration: 0.35,
      }
    );
    tl.fromTo(
      ".feature#second",
      { y: 50, opacity: 0 },
      {
        y: 0,
        delay: 0.2,
        opacity: 1,
        duration: 0.35,
      }
    );
    tl.fromTo(
      ".feature#third",
      { y: 50, opacity: 0 },
      {
        y: 0,
        delay: 0.2,
        opacity: 1,
        duration: 0.35,
      }
    );

    gsap.fromTo(
      ".footer",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: ".footer",
          start: "center bottom",
        },
      }
    );
  });
  return (
    <section className="home">
      <Nav />

      <section className="jumbo bg-ms-dark relative">
        <div className="glow left "></div>
        <NetworkSVG />
        <div className=" max-w-2xl mx-auto text-ms-almost-white pt-52">
          <h1 className="heading text-center font-bold text-4xl md:text-[64px] ">
            Connect with people
          </h1>
          <div className="content font-light text-base md:text-lg max-w-4/6 mx-auto text-center text-ms-muted mt-6 ">
            Connect instantly and effortlessly. Chat App brings people together
            with fast, secure, and intuitive messaging—anytime, anywhere.
          </div>
          <NavLink
            to={"/dashboard"}
            className="call-to-action block relative text-sm md:text-base bg-ms-secondary rounded-full px-5 pt-2.5 pb-3 w-fit font-medium mt-8 mx-auto"
          >
            Start messaging now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              className="size-6 absolute top-0 left-0 translate-x-[-100%] translate-y-[-25%]"
            >
              <defs>
                <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3779f7" />
                  <stop offset="100%" stopColor="#7F00FF" />
                </linearGradient>
              </defs>
              <path
                stroke="url(#grad1)"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          </NavLink>
          <div className="preview mx-4 relative w-fit  rounded-2xl">
            <img className="preview-img  rounded-2xl" src={previewImg} alt="" />
          </div>
        </div>
      </section>
      <section className="features  pt-32 pb-40 p-4 bg-ms-almost-white">
        <div className="sponsors max-w-2xl mx-auto px-12 gap-y-4 xxs:gap-y-0 xxs:px-8 sm:px-0 xxs:gap-x-6 grid grid-cols-1  xxs:grid-cols-3 place-items-center">
          <div className="sponsor">
            <img src={kansasLogo} alt="" />
          </div>
          <div className="sponsor">
            <img src={flashLogo} alt="" />
          </div>
          <div className="sponsor">
            <img src={savannahLogo} alt="" />
          </div>
        </div>
        <div className="features-content container pt-24 mx-auto  flex flex-col items-center">
          <h1 className="features-heading text-3xl md:text-4xl text-center lg:text-5xl font-bold text-ms-dark">
            Some of our features that will help you
          </h1>
          <p className="features-description text-ms-muted text-center font-medium pt-10 md:pt-12 lg:pt-16 max-w-2xl">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis
            perspiciatis laborum distinctio, animi consectetur culpa
            voluptatibus magni laboriosam obcaecati, dolorum aperiam mollitia!
            Unde aspernatur molestias accusantium nam quam tempore recusandae!
          </p>

          <div className="feature-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-32 gap-2">
            <div className="feature p-6" id="first">
              <div className="feature-icon communication size-10">
                <ChatBubbleOvalLeftEllipsisIcon className="w-full p-1 fill-ms-green" />
              </div>
              <h2 className="py-6 text-2xl font-semibold">
                Easy communication
              </h2>
              <p className="text-ms-muted font-regular ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
                modi nesciunt ad aperiam corporis odio odit vero quasi soluta
                alias.
              </p>
            </div>
            <div className="feature p-6 " id="second">
              <div className="feature-icon community size-10">
                <UserGroupIcon className="w-full p-1 fill-ms-yellow" />
              </div>
              <h2 className="py-6 text-2xl font-semibold">Community support</h2>
              <p className="text-ms-muted font-regular">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
                modi nesciunt ad aperiam corporis odio odit vero quasi soluta
                alias.
              </p>
            </div>
            <div className="feature p-6" id="third">
              <div className="feature-icon discover size-10">
                <GlobeAltIcon className="w-full p-1 fill-ms-cyan" />
              </div>
              <h2 className="py-6 text-2xl font-semibold">Discover channel</h2>
              <p className="text-ms-muted font-regular">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
                modi nesciunt ad aperiam corporis odio odit vero quasi soluta
                alias.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="footer relative bg-ms-dark text-ms-almost-white p-4">
        <div className="glow left"></div>
        <div className="max-w-6xl grid grid-cols-2 sm:grid-cols-10 place-items-center   items-center mx-auto">
          <ul className="footer-links pt-6 p-4 justify-self-end sm:col-span-2">
            <li className="heading pb-3">
              <h4 className="text-xl font-semibold">Useful Links</h4>
            </li>
            <li className="footer-link p-2 ps-1 text-ms-muted">Useful Link</li>
            <li className="footer-link p-2 ps-1 text-ms-muted">Useful Link</li>
            <li className="footer-link p-2 ps-1 text-ms-muted">Useful Link</li>
            <li className="footer-link p-2 ps-1 text-ms-muted">Useful Link</li>
          </ul>
          <ul className="footer-links  pt-6 p-4 justify-self-start sm:col-span-2 ">
            <li className="heading pb-3">
              <h4 className="text-xl font-semibold">Useful Links</h4>
            </li>
            <li className="footer-link p-2 ps-1 text-ms-muted">Useful Link</li>
            <li className="footer-link p-2 ps-1 text-ms-muted">Useful Link</li>
            <li className="footer-link p-2 ps-1 text-ms-muted">Useful Link</li>
            <li className="footer-link p-2 ps-1 text-ms-muted">Useful Link</li>
          </ul>
          <div className="brand pt-6 col-span-2 sm:col-start-8">
            <div id="footer-logo" className="max-w-[120px]">
              <img src={logo} alt="chat app logo" />
            </div>
            <div className="brand-infos p-3 font-light">
              <div className="location flex py-2">
                <MapPinIcon className="size-6 me-1" />
                <span>Route Example, 4, 57646 US</span>
              </div>
              <div className="location flex py-2">
                <AtSymbolIcon className="size-6 me-1" />
                <span>example@example.com</span>
              </div>
              <div className="location flex py-2">
                <PhoneIcon className="size-6 me-1" />
                <span>+44 123 1223 123</span>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright text-center font-light text-ms-almost-white border-t border-ms-muted pt-4 mt-8">
          <span className="inline-block w-fit">
            Chat App &copy;, 2025 All rights reserved{" "}
          </span>
        </div>
      </section>
    </section>
  );
};

export default Home;
