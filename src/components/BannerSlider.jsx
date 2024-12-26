import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const BannerSlider = () => {
  const slides = [
    {
      image:
        "https://i.ibb.co/Wy1D8Np/DALL-E-2024-11-19-04-43-42-A-volunteer-warmly-wrapping-a-child-in-a-cozy-blanket-during-winter-surro.webp",
      heading: "Warmth for All",
      description:
        "Families receiving winter donations, spreading warmth and hope.",
      buttonLabel: "Donate Now",
      buttonLink: "/campaigns",
    },
    {
      image:
        "https://i.ibb.co.com/KjC0cVX/DALL-E-2024-11-19-05-13-31-A-heartwarming-scene-of-volunteers-distributing-warm-winter-clothing-to-p.webp",
      heading: "Together, We Can Make a Difference",
      description:
        "Volunteers distributing clothing to those in need this winter.",
      buttonLabel: "View Campaigns",
      buttonLink: "/campaigns",
    },
    {
      image:
        "https://i.ibb.co.com/L5mK6Vs/DALL-E-2024-11-19-05-15-26-A-touching-scene-of-a-child-smiling-joyfully-as-they-receive-warm-winter.webp",
      heading: "Every Act of Kindness Counts",
      description: "A child smiling as they receive warm clothing.",
      buttonLabel: "Get Involved",
      buttonLink: "/campaigns",
    },
    {
      image:
        "https://i.ibb.co.com/cwxPF9M/DALL-E-2024-11-19-05-17-07-A-highly-realistic-and-heartwarming-scene-of-people-from-diverse-backgrou.webp",
      heading: "Join Our Mission",
      description: "Together, we’re creating a brighter, warmer future.",
      buttonLabel: "Support Us",
      buttonLink: "how-to-help",
    },
  ];

  return (
    <div className="carousel-container">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="mySwiper rounded-2xl mb-12"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full h-[400px] sm:h-[200px] md:h-[300px] lg:h-[500px] bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-4">
                <h2 className="text-3xl font-bold">{slide.heading}</h2>
                <p className="mt-2 text-lg">{slide.description}</p>
                <a
                  href={slide.buttonLink}
                  className="mt-4 px-6 py-2 bg-primary hover:bg-blue-400 rounded-md text-white font-semibold"
                >
                  {slide.buttonLabel}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
