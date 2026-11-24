import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useBranding } from "../context/BrandingContext";

const TestimonialSlider = () => {
  const { settings } = useBranding();
  const testData = settings.testimonials || {};
  const items = Array.isArray(testData.items) && testData.items.length > 0 ? testData.items : [
    {
      id: 1,
      name: "আব্দুল জব্বার আল নাহিদ",
      role: "উপকারভোগী",
      image: "https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg",
      message: "শীতের সবচেয়ে কঠিন সময়ে আমরা জ্যাকেট ও কম্বল পেয়েছি। এই সহায়তা আমাদের পরিবারকে উষ্ণতা ও স্বস্তি দিয়েছে। আপনাদের সদয় উদ্যোগের জন্য ধন্যবাদ!",
      location: "সিলেট",
      title: "শীতকালীন সহায়তা বিতরণ",
    },
    {
      id: 2,
      name: "রহিম উদ্দিন",
      role: "স্বেচ্ছাসেবক",
      image: "https://i.ibb.co.com/931fDV3/pexels-photo-749091.webp",
      message: "খুলনায় কম্বল বিতরণের অভিজ্ঞতা আমার মনে থাকবে। মানুষের আনন্দ ও কৃতজ্ঞতা দেখে সব পরিশ্রম সার্থক মনে হয়েছে।",
      location: "খুলনা",
      title: "শীতকালীন সহায়তায় হাসি",
    },
    {
      id: 3,
      name: "আয়েশা খাতুন",
      role: "উপকারভোগী",
      image: "https://i.ibb.co.com/tZc6dPW/pexels-1844773-3426975.webp",
      message: "এই উদ্যোগের সহায়তায় শীতের কঠিন সময়ে আমার সন্তানেরা উষ্ণ ও নিরাপদ ছিল। এমন সহায়তার জন্য আমরা কৃতজ্ঞ।",
      location: "ঢাকা",
      title: "পরিবারের পাশে উষ্ণ সহায়তা",
    },
  ];

  return (
    <div data-aos="fade-right" className="my-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
        {testData.title || "মানুষের অভিজ্ঞতা"}
      </h2>

      <div className="bg-white py-12 px-6 rounded-lg relative shadow-sm border border-gray-100">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".button-next",
            prevEl: ".button-prev",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={items.length > 1}
          className="mySwiper"
        >
          {items.map((item, idx) => (
            <SwiperSlide key={item.id || idx}>
              <div className="p-4 md:p-8 w-full md:w-3/4 mx-auto text-left">
                {item.title && (
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                )}
                <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed italic">
                  &ldquo;{item.message}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow">
                    <img
                      src={item.image || "https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-primary font-medium">
                      {item.role} {item.location ? `· ${item.location}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 flex z-20">
          <div className="bg-blue-500 hover:bg-blue-700 p-3 rounded-full shadow-md cursor-pointer button-prev transition">
            <FaArrowLeft className="text-white text-lg" />
          </div>
          <div className="bg-blue-500 hover:bg-blue-700 p-3 rounded-full shadow-md cursor-pointer button-next ml-3 transition">
            <FaArrowRight className="text-white text-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
