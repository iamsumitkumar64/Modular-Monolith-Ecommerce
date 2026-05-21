export const sliderSettings = {
    // dots: true,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    vertical: false,
    swipeToSlide: true,
    responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 6 } },
        { breakpoint: 768, settings: { slidesToShow: 5 } },
        { breakpoint: 480, settings: { slidesToShow: 3 } }
    ]
};