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
      name: "Abdul Jabbar Al Nahid",
      role: "Beneficiary",
      image: "https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg",
      message:
        "We received jackets and blankets when we needed them most during the coldest nights of winter. The support brought warmth and comfort to our family. Thank you for your kindness!",
      location: "Sylhet",
      title: "Winter Aid Distribution Success",
    },
    {
      id: 2,
      name: "Rahim Uddin",
      role: "Volunteer",
      image: "https://i.ibb.co.com/931fDV3/pexels-photo-749091.webp",
      message:
        "Distributing blankets in Khulna was an unforgettable experience. Seeing the joy and gratitude on people's faces made every effort worthwhile. This initiative gave me a deeper understanding of humanity.",
      location: "Khulna",
      title: "Smiles Through Winter Relief",
    },
    {
      id: 3,
      name: "Ayesha Khatun",
      role: "Beneficiary",
      image: "https://i.ibb.co.com/tZc6dPW/pexels-1844773-3426975.webp",
      message:
        "Thanks to this wonderful initiative, my children stayed warm and safe during the harsh winter months. We are truly grateful for this amazing support during a difficult time.",
      location: "Dhaka",
      title: "Helping Families Stay Warm",
    },
    {
      id: 4,
      name: "Karim Ali",
      role: "Volunteer",
      image: "https://i.ibb.co.com/B67Ggd1/pexels-photo-7562076.webp",
      message:
        "I feel privileged to be part of such a noble cause. Helping people in Chattogram during tough times taught me the true value of giving back to the community.",
      location: "Chattogram",
      title: "Giving Back in Chattogram",
    },
  ];

  return (
    <div data-aos="fade-right" className="my-16">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
        Testimonial
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
