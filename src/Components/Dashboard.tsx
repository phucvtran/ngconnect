import apiAgent from "../utils/apiAgent";
import ListingList from "./ListingList";

const Dashboard = () => {
  const getListingsCallback = async (searchQueryParams: any) => {
    return await apiAgent.Listings.getMyListings(searchQueryParams);
  };

  return (
    <ListingList
      getListingsCallback={getListingsCallback}
      allowEdit
    ></ListingList>
  );
};
export default Dashboard;
