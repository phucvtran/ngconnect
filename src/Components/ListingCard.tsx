import { Box, Grid2, Typography } from "@mui/material";
import Button from '@mui/material/Button';

import listingImage from "../Assets/Images/listing.jpg"
import jobImage from "../Assets/Images/job_image.avif"
import { Link, useNavigate } from "react-router-dom";
import { ListingDetails } from "../models/Listing";


interface Props {
    listing:ListingDetails
}

const ListingCard = ({listing} : Props) =>{

  const navigate = useNavigate();

    return <Box>
                <Box >
                    
                  <img style={{ width: "100%", height:"100%" }} src={listing.categoryId == 1 ? jobImage : listingImage}/>
                    
                </Box>
                <Box>
                  <Box>
                    <Typography sx={{fontWeight:'bold'}}>{listing.title}</Typography>
                    <Typography>{listing.description} <Link to={"/business"}>Learn more.</Link></Typography>
                    <Typography sx={{fontWeight:'bold'}}>{listing.city + ', ' + listing.state}</Typography>
                  </Box>
                  
                </Box>
            </Box>

            

}

export default ListingCard;