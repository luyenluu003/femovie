import React from 'react';
import Navbar from '../../components/Navbar';
import Header from '../../components/header';
import Banner from '../banner/Banner';
import MovieWatching from '../movieWatching/MovieWatching';
import MovieHot from '../MovieHot/MovieHot';
import Series from '../series/Series';
import Footer from '../../components/Footer';

const Home = () => {
    return (
        <main className="w-full min-h-screen bg-black  text-neutral-500 flex flex-col">
            <Navbar />
            <div className='w-full min-h-screen  space-y-16 flex flex-col'>
                <Banner/>
                <MovieWatching />
                <MovieHot />
                <Series />
            </div>
            <Footer />
        </main>
    )
}

export default Home