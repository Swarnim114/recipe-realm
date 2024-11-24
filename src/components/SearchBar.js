import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Define a schema for validation using zod
const searchSchema = z.object({
  query: z
    .string()
    .min(2, { message: "Search query must be at least 2 characters long" })
    .nonempty({ message: "Please enter a search query" }),
});

// Replace with your Spoonacular API key
const SPOONACULAR_API_KEY = "dc49b0826e7a40bfbbd0d39540cb7569";
const SPOONACULAR_API_URL = "https://api.spoonacular.com/recipes/complexSearch";

const SearchBar = ({ onSearch }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.get(SPOONACULAR_API_URL, {
        params: {
          query: data.query,
          number: 10, // Number of recipes to fetch
          apiKey: SPOONACULAR_API_KEY,
        },
      });

      console.log("Response data:", response.data); // Debugging
      onSearch(response.data.results); // Pass fetched recipes to parent component
    } catch (error) {
      console.error("Error fetching recipes:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to fetch recipes. Please try again.");
    }
  };


  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: '50rem',
        height: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto'
      }}
    >
      <TextField
        label="Search Recipes"
        size="small"
        variant="outlined"
        sx={{ marginRight: "0.1rem", width: "40rem" }}
        error={!!errors.query}
        helperText={errors.query ? errors.query.message : ''}
        {...register("query")}
      />
      <Button type="submit" variant="contained" color="primary" startIcon={<SearchIcon />}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
