import { Box, Container, TextField, CssBaseline, Autocomplete, Typography, SelectChangeEvent, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from "@mui/material";
import Grid from '@mui/material/Grid2';



import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import BusinessCard from "./BusinessCard";
import { Business } from "../models/Business";

// test data
const business : Business[] = [
    {
        "id": "1",
        "name": "NG cleaning",
        "description": "We are dedicated to providing top-tier cleaning services for offices and warehouses, ensuring your spaces are not only spotless but also optimized for productivity.",
        "address": "3333 main st",
        "city": "seattle",
        "state": "wa",
        "zipcode": "3333",
        "phone":"111-111-1111",
        "email":"janitor@gmail.com",
        "services":[
            {
                "id":"1",
                "businessId":"1",
                "name":"Office Janitor",
                "description":"cleaning office"
            },
            {
                "id":"2",
                "businessId":"1",
                "name":"House Cleaning",
                "description":"We offer deep cleaning for single family home"
            },
            {
                "id":"3",
                "businessId":"1",
                "name":"warehouse Janitor",
                "description":"Warehouse cleaning, storage clean up"
            },
        ]
    
    },
    {
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
    
    },
    {
        "id": "3",
        "name": "Renton Tailoring",
        "description": "Our skilled tailors are dedicated to ensuring a perfect fit for every occasion, whether it's a wedding, formal event, or everyday wear. We pride ourselves on our attention to detail and commitment to quality, offering personalized consultations to understand your unique needs.",
        "address": "3333 main st",
        "city": "Renton",
        "state": "wa",
        "zipcode": "3333",
        "phone":"111-111-1111",
        "email":"tailoring@gmail.com",
        "services":[
            {
                "id":"7",
                "businessId":"3",
                "name":"Wedding dress",
                "description":"Our team understands the significance of the perfect wedding dress. We provide intricate alterations, from hem adjustments to taking in or letting out bodices, ensuring your dress complements your figure beautifully."
            },
            {
                "id":"8",
                "businessId":"3",
                "name":"Bridesmaids' Dresses",
                "description":"Each bridesmaid deserves to feel stunning. We offer personalized adjustments to ensure a perfect fit for every dress, accommodating different body types and preferences while maintaining the overall aesthetic of the bridal party."
            },
            {
                "id":"9",
                "businessId":"3",
                "name":"Suits and Jackets",
                "description":"For both men and women, we offer expert suit and jacket alterations. Whether it’s shortening sleeves, tapering sides, or adjusting lengths, our goal is to create a polished look that enhances your silhouette."
            },
            {
                "id":"10",
                "businessId":"3",
                "name":"Pants and Trousers",
                "description":"Finding the right fit in pants can be challenging. Our services include hemming, taking in or letting out waists, and adjusting inseams to ensure you feel confident and comfortable in your trousers."
            },
            {
                "id":"11",
                "businessId":"3",
                "name":"Custom Tailoring",
                "description":"In addition to alterations, we provide custom tailoring services. If you have a vision for a unique piece, our team can help bring it to life, ensuring every detail meets your specifications."
            },
            {
                "id":"12",
                "businessId":"3",
                "name":"Repair and Restoration",
                "description":"We also offer repair services to mend damaged garments, from simple seam repairs to more complex restoration projects, preserving your favorite pieces for years to come."
            },
            
        ]
    
    },
    
]

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

const Home = () => {

    const navigate = useNavigate();

    

    useEffect (()=>{
        // getProperties();
    },[])

    

    return (
        <Container maxWidth="xl">

            <Container maxWidth="xl">
                <Box
                    sx={{
                        mt:'50px',
                        width: '100%',
                        maxWidth: '100%',
                    }}
                >
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs:6, sm: 6, md: 12, lg:12 }}>
                        {business.map((prop)=>{
                            return <Grid size={{ xs: 12, sm: 6}} key={prop.id}>
                                <BusinessCard business={prop}></BusinessCard>
                            </Grid>
                        })}
                    </Grid>
                </Box>

            </Container>

        </Container>
        
    )
}

export default Home;