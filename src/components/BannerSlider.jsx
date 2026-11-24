import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { DEFAULT_SLIDES, useBranding } from "../context/BrandingContext";

const BannerSlider = () => {
  const { settings } = useBranding();
  const slides = settings?.heroSlides?.length ? settings.heroSlides : DEFAULT_SLIDES;
  const delayMs = Math.max(1, Number(settings?.sliderAutoplayDelay) || 5) * 1000;

  return (
    <div className="carousel-container" data-aos="fade-down">
      <Swiper
        key={`banner-swiper-${delayMs}-${slides.length}`}
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: delayMs, disableOnInteraction: false }}
        loop={slides.length > 1}
        className="mySwiper rounded-2xl mb-12"
      >
        {slides.map((slide, index) => {
          const isInternal = slide.buttonLink?.startsWith("/") && !slide.buttonLink.startsWith("//");
          return (
            <SwiperSlide key={index}>
              <div
                className="relative w-full h-[400px] sm:h-[200px] md:h-[300px] lg:h-[500px] bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image || DEFAULT_SLIDES[0].image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-4">
                  <h2 className="text-3xl font-bold">{slide.heading}</h2>
                  <p className="mt-2 text-lg">{slide.description}</p>
                  {slide.buttonLabel && (isInternal ? (
                    <Link to={slide.buttonLink} className="mt-4 px-6 py-2 bg-primary hover:bg-blue-400 rounded-md text-white font-semibold">
                      {slide.buttonLabel}
                    </Link>
                  ) : (
                    <a href={slide.buttonLink || "/donate"} className="mt-4 px-6 py-2 bg-primary hover:bg-blue-400 rounded-md text-white font-semibold">
                      {slide.buttonLabel}
                    </a>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
