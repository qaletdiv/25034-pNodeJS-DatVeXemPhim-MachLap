import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

import Filter from "../../component/Filter/Filter";
import Carousel from "./../../component/Carousel/Carousel";
import MovieGrid from "../../component/MovieGrid/MovieGrid";
import { fetchMovie } from "../../redux/Slices/movieSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.movies);
  const filters = useSelector((state) => state.filters);

  const queryParams = useMemo(
    () => ({ status, ...filters }),
    [status, filters]
  );

  useEffect(() => {
    dispatch(fetchMovie(queryParams));
  }, [queryParams]);

  return (
    <div>
      <Carousel />
      <Filter />
      <MovieGrid />
    </div>
  );
};

export default Home;
