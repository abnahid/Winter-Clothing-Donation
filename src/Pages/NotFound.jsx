import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <div>
      <Navbar />
      <section className="bg-primary">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-300">
              404
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-white md:text-4xl ">
              দুঃখিত, একটি অপ্রত্যাশিত সমস্যা হয়েছে।
            </p>
            <p className="mb-4 text-lg font-light text-gray-300">
              <i>পাতাটি পাওয়া যায়নি অথবা সাময়িক সমস্যা হয়েছে।</i>
            </p>
            <Link
              to={`/`}
              className="inline-flex text-white bg-blue-300 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4"
            >
              মূল পাতায় ফিরুন
            </Link>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default NotFound;
