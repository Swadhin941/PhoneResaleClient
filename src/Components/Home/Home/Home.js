import React from 'react';
import Banner from '../Banner/Banner';
import FakeCard from '../FakeCard/FakeCard';
import Categories from '../Categories/Categories';
import useTitle from '../../CustomHook/useTitle';

const Home = () => {
    useTitle("Home E-Buy");
    return (
        <div>
            <Banner></Banner>
            <FakeCard></FakeCard>
            <Categories></Categories>
        </div>
    );
};

export default Home;