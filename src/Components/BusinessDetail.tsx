import { Box, Container, TextField, Button, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, useStepContext, Grid2 } from "@mui/material";

import ShareIcon from '@mui/icons-material/Share';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import React, { useContext, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { Business } from "../models/Business";

import image1 from "../Assets/Images/house1.jpeg"
import avatar_image from "../Assets/Images/img_avatar.png"
import ServiceCard from "./ServiceCard";


const zoomOutProperties = {
    duration: 0,
    transitionDuration: 0,
    infinite: false,
    indicators: true,
    scale: 0.4,
    arrows: true,
    autoplay: false
};

//for debug only


  

const BusinessDetail = () => {

    const navigate = useNavigate();

    const today = new Date();

    const {id} = useParams();

    const [selectedServices, setSelectedServices] = useState<string[]>([])

    // const [property, setProperty] = useState<Business>();
    const business = {
        "id": "2",
        "name": "NG landscaping",
        "description": "We’re dedicated to delivering beautiful, lasting designs with the latest industry standards, ensuring quality, integrity, and respect are at the heart of everything we do.",
        "address": "3333 main st",
        "city": "seattle",
        "state": "wa",
        "zipcode": "3333",
        "phone":"111-111-1111",
        "email":"landscape@gmail.com",
        "services":[
            {
                "id":"4",
                "businessId":"2",
                "name":"Yard Clean Up",
                "description":"tree pruning, tree cutting, hedge trimming,shrub pruning, strump grinding, vine pruning, invasive plants/weeding, lawn mowing, edging, bamboo removal, reducing overgrown plants, plant removal, pressure washing, and more"
            },
            {
                "id":"5",
                "businessId":"2",
                "name":"Landscaping Hardspace Construction",
                "description":"Our landscape and hardscape construction services cover a wide range of outdoor projects to beautify your home and increase its functionality. Whether you're looking to create new outdoor spaces or improve existing ones, we offer solutions that meet your design and maintenance needs."
            },
            {
                "id":"6",
                "businessId":"2",
                "name":"Lawn Care & Maintenance",
                "description":"Maintaining a healthy and beautiful lawn requires consistent care, especially during the growing seasons. We are proud to offer a comprehensive bi-weekly lawn and yard maintenance service from early Spring through late Fall. This regular schedule helps keep your yard looking its best by addressing the rapid growth and changes that occur during the warmer months. Our skilled team ensures that your lawn stays neat and well-maintained, making your outdoor space more enjoyable."
            },
        ]
    
    }


    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
          },
        },
      };

    const handleServiceSelect = (event:any) =>{
        let value = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
        setSelectedServices(value)
    }

    useEffect (()=>{
        
       

    },[]);

    return (
        <Container maxWidth="xl">

            <Container maxWidth="xl">
                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <Box>
                        <h2>{business?.name}</h2>
                    </Box>

                    <Box>
                        
                        <ShareIcon></ShareIcon>
                        &nbsp;
                        <a href="share">Share</a>
                        
                        &nbsp;
                        &nbsp;

                        <FavoriteBorderIcon></FavoriteBorderIcon>
                        &nbsp;
                        <a href="Save"> Save</a>

                    </Box>
                    
                </Box>

            </Container>

            <Container maxWidth="xl" sx={{display:"flex"}}>

                <Box sx={{fontSize:"large", width:"70%", paddingRight:"50px"}}>
                    <Box>
                        <h3>{business?.city + ', ' + business?.state}</h3>
                    </Box>

                    <hr/>

                    {/* <Box sx={{display:"flex", justifyContent:"flex-start", alignItems:"center"}}>
                        <div>
                            <img style={{ width: "50px", height:"50px", borderRadius:"50%" }} src={avatar_image}></img>
                        </div>

                        &nbsp;
                        &nbsp;

                        
                    </Box> */}

                    <Box
                        sx={{
                            mt:'50px',
                            width: '100%',
                            maxWidth: '100%',
                        }}
                    >
                            {business.services.map((prop)=>{
                                return <ServiceCard service={prop}></ServiceCard>
                            })}
                    </Box>

                </Box>

                <Box sx={{width:"30%", height:"100%", border: "2px solid gray", borderRadius:"10px"}}>
                    
                    <Container maxWidth="xl">
                        <Box>
                            <h3>{"Book A Service"}</h3>
                            <Box sx={{display:"flex", width: "95%"}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker label="Select A Date"/>
                                </LocalizationProvider>
                            </Box>
                            <Box sx={{marginTop:"10px"}}>
                                <FormControl sx={{ m: 1, width: "95%" }}>
                                    <InputLabel id="service-multiple-checkbox-label">Select Services</InputLabel>
                                    <Select
                                    labelId="service-multiple-checkbox-label"
                                    id="service-multiple-checkbox"
                                    name="serviceSelection"
                                    multiple
                                    value={selectedServices}
                                    onChange={handleServiceSelect}
                                    input={<OutlinedInput label="services"/>}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                    >
                                    {business.services.map((service) => (
                                        <MenuItem key={service.id} value={service.name}>
                                        <Checkbox checked={selectedServices.includes(service.name)} />
                                        <ListItemText primary={service.name} />
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{marginTop:"10px"}}>
                                <ul>
                                    {selectedServices.map((service) => {
                                       return <li>{service}</li>
                                    })}
                                </ul>
                            </Box>

                            <Box sx={{marginTop:"10px"}}>
                                <Button sx={{width:"100%"}} variant="contained">Reserve</Button>
                            </Box>

                            <Box sx={{marginTop:"20px"}}>

                            <Box sx={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
                                    <div>Subtotal</div>
                                    <div>$100</div>
                                </Box>

                                <Box sx={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
                                    <div>Tax</div>
                                    <div>$10</div>
                                </Box>

                                <Box sx={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
                                    <div>Service fee</div>
                                    <div>$20</div>
                                </Box>

                                <hr/>

                                <Box sx={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
                                    <strong>Total:</strong>
                                    <div>$130</div>
                                </Box>

                                <br/>
                                
                            </Box>
                            
                        </Box>
                    </Container>

                </Box>

            </Container>

            

        </Container>
        
    )
}

export default BusinessDetail;