import React from 'react';

import Testimonials from '../unauthComponents/Testimonials';
import FeaturesHighlights from '../unauthComponents/FeaturesHighlights';
import HeroSection from '../unauthComponents/HeroSection';
import TopHeader from '../unauthComponents/TopHeader';
import GetStarted from '../unauthComponents/GetStarted';
import FAQSection from '../unauthComponents/FAQSection';
import ContactSection from '../unauthComponents/Contact&Footer';

const LandingPage = () => {
    return (
        <div className="">
            <TopHeader />
            <HeroSection />
            <FeaturesHighlights />
        
            <GetStarted />
            <Testimonials />
            <FAQSection />
            <ContactSection />
        </div>
    );
};

export default LandingPage;
