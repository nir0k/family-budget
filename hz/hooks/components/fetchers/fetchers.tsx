import axios from 'axios';
import { request } from 'http';
import React, {useEffect, useState} from 'react';
// export async function get<T>(
//     path: string
// ): Promise<T> {
//     const { data } = await axios.get(path);
//     return data;
// };

export async function get<T>( 
    url: string
    ): Promise<T> {
        const response = await fetch(url)
        return await response.json()
    }

// export async function get(path: string){
//     try {
//         const response = await fetch(path);
//         const json = await response.json();
//         return json
//         // setData(json.movies);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         // setLoading(false);
//     }
// };