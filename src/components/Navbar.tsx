import React from 'react';
import Link from 'next/link'; // For routing
import Image from 'next/image';
import LogoImg from '../../public/RandomDistionary.png'

const Navbar = () => {
    return (
        <nav className="min-h-[40vh] flex items-center justify-center ">
            <Link href="/">
                <Image src={LogoImg} alt="Your logo or image" 
                width={300} height={100}className="h-full object-contain" />
            </Link>
        </nav>
    );
};

export default Navbar;
