import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const TestimonialSlider = () => {
  const testimonials = [
    {
      id: 1,
      name: "আব্দুল জব্বার আল নাহিদ",
      role: "উপকারভোগী",
      image: "https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg",
      message:
        "শীতের সবচেয়ে কঠিন সময়ে আমরা জ্যাকেট ও কম্বল পেয়েছি। এই সহায়তা আমাদের পরিবারকে উষ্ণতা ও স্বস্তি দিয়েছে। আপনাদের সদয় উদ্যোগের জন্য ধন্যবাদ!",
      location: "সিলেট",
      title: "শীতকালীন সহায়তা বিতরণ",
    },
    {
      id: 2,
      name: "রহিম উদ্দিন",
      role: "স্বেচ্ছাসেবক",
      image: "https://i.ibb.co.com/931fDV3/pexels-photo-749091.webp",
      message:
        "খুলনায় কম্বল বিতরণের অভিজ্ঞতা আমার মনে থাকবে। মানুষের আনন্দ ও কৃতজ্ঞতা দেখে সব পরিশ্রম সার্থক মনে হয়েছে।",
      location: "খুলনা",
      title: "শীতকালীন সহায়তায় হাসি",
    },
    {
      id: 3,
      name: "আয়েশা খাতুন",
      role: "উপকারভোগী",
      image: "https://i.ibb.co.com/tZc6dPW/pexels-1844773-3426975.webp",
      message:
        "এই উদ্যোগের সহায়তায় শীতের কঠিন সময়ে আমার সন্তানেরা উষ্ণ ও নিরাপদ ছিল। এমন সহায়তার জন্য আমরা কৃতজ্ঞ।",
      location: "ঢাকা",
      title: "পরিবারের পাশে উষ্ণ সহায়তা",
    },
    {
      id: 4,
      name: "করিম আলী",
      role: "স্বেচ্ছাসেবক",
      image: "https://i.ibb.co.com/B67Ggd1/pexels-photo-7562076.webp",
      message:
        "এমন মানবিক কাজে যুক্ত হতে পেরে আমি আনন্দিত। কঠিন সময়ে চট্টগ্রামের মানুষের পাশে দাঁড়িয়ে সমাজকে ফিরিয়ে দেওয়ার মূল্য বুঝেছি।",
      location: "চট্টগ্রাম",
      title: "চট্টগ্রামে মানুষের পাশে",
    },
  ];

  return (
    <div data-aos="fade-right" className="my-16">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
        মানুষের অভিজ্ঞতা
      </h2>

      <div className="bg-white py-12 px-6 rounded-lg relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".button-next",
            prevEl: ".button-prev",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="mySwiper"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="p-8 w-full md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-6">{item.message}</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full">
                    <img src={item.image} alt="" className="rounded-full" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="absolute bottom-8 right-32  md:bottom-20 md:right-20 flex z-20">
          <div className="bg-blue-500 hover:bg-blue-700 p-3 rounded-full shadow-md cursor-pointer button-prev ">
            <FaArrowLeft className="text-white text-xl" />
          </div>
          <div className="bg-blue-500 hover:bg-blue-700 p-3 rounded-full shadow-md cursor-pointer button-next ml-4">
            <FaArrowRight className="text-white text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
