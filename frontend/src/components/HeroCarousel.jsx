import { useState, useEffect } from "react";
import "./HeroCarousel.css";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1600857948624-a21226a20b08?q=80&w=2000&auto=format&fit=crop",
        title: "The Spring Collection",
        subtitle: "Discover light, airy pieces perfect for the season.",
        textColor: "#ffffff",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=2000&auto=format&fit=crop",
        title: "Everyday Elegance",
        subtitle: "Curated essentials for your minimal wardrobe.",
        textColor: "#ffffff",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2000&auto=format&fit=crop",
        title: "Home & Living",
        subtitle: "Bring the boutique aesthetic into your space.",
        textColor: "#423826", // Dark text for light image
    }
];

function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // 5 second auto-advance
        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="hero-carousel">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`hero-slide ${index === currentSlide ? "active" : ""}`}
                >
                    <img src={slide.image} alt={slide.title} className="hero-image" />
                    <div className="hero-overlay"></div>
                    <div className="hero-content" style={{ color: slide.textColor }}>
                        <h2 className="hero-title">{slide.title}</h2>
                        <p className="hero-subtitle">{slide.subtitle}</p>
                        <button className="hero-cta" style={{ color: slide.textColor, borderColor: slide.textColor }}>
                            Shop Now
                        </button>
                    </div>
                </div>
            ))}

            <div className="hero-indicators">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator-dot ${index === currentSlide ? "active" : ""}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default HeroCarousel;
