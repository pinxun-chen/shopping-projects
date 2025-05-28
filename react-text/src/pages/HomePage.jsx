import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const goToProducts = () => {
        navigate('/products');
    };

    return (
        <div className="cursor-pointer">
            <img
                src="/assets/home.png"
                alt="首頁圖片"
                className="w-full object-cover hover:opacity-90 transition duration-300"
                onClick={goToProducts}
            />
        </div>
    );
}

export default HomePage;
