import { Box, Grid2, Typography } from "@mui/material";
import Button from '@mui/material/Button';

import image1 from "../Assets/Images/house1.jpeg"
import { Link, useNavigate } from "react-router-dom";
import { Business } from "../models/Business";



interface Props {
    business:Business
}

const BusinessCard = ({business} : Props) =>{

  const navigate = useNavigate();

    return <Box>
                <Box >
                    
                  <img style={{ width: "100%", height:"100%" }} src={image1}/>
                    
                </Box>
                <Box>
                  <Box>
                    <Typography sx={{fontWeight:'bold'}}>{business.name}</Typography>
                    <Typography>{business.description} <Link to={"/business"}>Learn more.</Link></Typography>
                    <Typography sx={{fontWeight:'bold'}}>{business.city + ', ' + business.state}</Typography>
                  </Box>
                  
                </Box>
            </Box>

            

}

export default BusinessCard;