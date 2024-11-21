import { Box, Grid2, Typography } from "@mui/material";
import Button from '@mui/material/Button';

import image1 from "../Assets/Images/house1.jpeg"
import { Link, useNavigate } from "react-router-dom";
import { Business } from "../models/Business";
import { Service } from "../models/Service";



interface Props {
    service:Service
}

const ServiceCard = ({service} : Props) =>{

  const navigate = useNavigate();

    return <Box>
                <Box >
                  <img style={{ width: "100%", height:"100%" }} src={image1}/>
                    
                </Box>
                <Box>
                  <Box>
                    <Typography sx={{fontWeight:'bold'}}>{service.name}</Typography>
                    <Typography>{service.description}</Typography>
                  </Box>
                  
                </Box>

                <br></br>
                <hr></hr>
                <br></br>
            </Box>

            

}

export default ServiceCard;