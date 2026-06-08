import z from 'zod';

const movieSchema = z.object({
        title: z.string({
            invalid_type_error: 'Title must be a string',
            required_error: 'Title is required',

        }),
        genre: z.array(z.enum(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Crime', 'Thriller', 'Animation', 'Adventure', 'Fantasy', 'Documentary']),
        {
            invalid_type_error: 'Genre must be an array of strings',
            required_error: 'Genre is required',
        }
    ),
        year: z.number().int().positive().min(1900).max(new Date().getFullYear()),
        director: z.string(),
        duration: z.number().int().positive(),
        rate: z.number().min(0).max(10),
        poster: z.string().url()
    })


  export function validateMovie(movie) {
    return movieSchema.safeParse(movie);
  }

  export function validatePartialMovie(movie) {
    return movieSchema.partial().safeParse(movie);
  }

