import apiAgent from "../utils/apiAgent";
import ListingList from "./ListingList";

const Home = () => {
  const getAllListingsCallback = async (searchQueryParams: any) => {
    return await apiAgent.Listings.getAllListings(searchQueryParams);
  };

  return <ListingList getListingsCallback={getAllListingsCallback} />;
};

export default Home;
