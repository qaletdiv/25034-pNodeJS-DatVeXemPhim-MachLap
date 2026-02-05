import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";

import Filter from "../../component/FilterMovie/FilterMovie";
import Carousel from "./../../component/Carousel/Carousel";
import MovieGrid from "../../component/MovieGrid/MovieGrid";
import { fetchMovie } from "../../redux/Slices/movieSlice";
import { useDebounce } from "../../hooks/useDebounce";

const Home = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.movies);
  const filters = useSelector((state) => state.filters);

  const queryParams = useMemo(() => {
    return {
      status,
      ...filters,
    };
  }, [status, filters]);

  const debouncedQueryParams = useDebounce(queryParams, 300);

  // // Thêm useEffect này để monitor debounced value
  // useEffect(() => {
  //   console.log("🟢 debouncedQueryParams changed:", debouncedQueryParams);
  // }, [debouncedQueryParams]);

  useEffect(() => {
    console.log("🔴 Dispatching fetchMovie with:", debouncedQueryParams);
    const promiseResult = dispatch(fetchMovie(debouncedQueryParams));

    return () => {
      console.log("🟡 Aborting previous request");
      promiseResult.abort();
    };
  }, [debouncedQueryParams, dispatch]);

  // useEffect(() => {
  //   dispatch(fetchMovie(queryParams));
  // }, [queryParams]);

  return (
    <div className="pt-16">
      <Carousel />
      <Filter />
      <MovieGrid />
    </div>
  );
};

export default Home;
